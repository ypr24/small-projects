use std::env;
use std::fs;
use std::io::{self, Read, Write};
use std::path::Path;
use indicatif::{ProgressBar, ProgressStyle};

fn main() {
    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: {} <source_dir> <destination_dir>", args[0]);
        std::process::exit(1);
    }

    // Extract source and destination directory paths
    let source_dir = Path::new(&args[1]);
    let destination_dir = Path::new(&args[2]);

    // Copy the directory recursively and update progress
    if let Err(err) = copy_dir_with_progress(source_dir, destination_dir) {
        eprintln!("Error: {}", err);
        std::process::exit(1);
    }

    // Print completion message
    println!("Directory copied successfully!");
}

fn copy_dir_with_progress(source: &Path, destination: &Path) -> io::Result<()> {
    // Create the destination directory if it doesn't exist
    if !destination.exists() {
        fs::create_dir_all(destination)?;
    }

    // Iterate through the entries in the source directory
    for entry in fs::read_dir(source)? {
        let entry = entry?;
        let entry_path = entry.path();

        if entry_path.is_dir() {
            // If the entry is a directory, recursively copy it
            let file_name = entry.file_name().into_string().unwrap_or_else(|os_string| {
                os_string.to_string_lossy().to_string()
            });
            let dest_path = destination.join(&file_name);
            copy_dir_with_progress(&entry_path, &dest_path)?;
        } else {
            // If the entry is a file, copy it with progress
            let file_name = entry.file_name().into_string().unwrap_or_else(|os_string| {
                os_string.to_string_lossy().to_string()
            });
            let dest_path = destination.join(&file_name);
            copy_file_with_progress(&entry_path, &dest_path, &file_name)?;
        }
    }

    Ok(())
}

fn copy_file_with_progress(source: &Path, destination: &Path, file_name_display: &str) -> io::Result<()> {
    let metadata = fs::metadata(source)?;
    let total_size = metadata.len();

    // Create a progress bar for each file
    let pb: ProgressBar = ProgressBar::new(total_size);

    pb.set_style(
        ProgressStyle::default_bar()
            .template(
                &format!(
                    "[{{elapsed_precise}}] {{bar:40.cyan/blue}} File: {} ({{bytes}}/{{total_bytes}} - {{eta}})",
                    file_name_display
                )
            )
            .expect("Failed to create progress bar style")
    );


    let mut source_file = fs::File::open(source)?;
    let mut destination_file = fs::File::create(destination)?;

    let mut buffer = [0; 8192]; // 8KB buffer
    let mut total_bytes = 0;

    loop {
        let bytes_read = source_file.read(&mut buffer)?;
        if bytes_read == 0 {
            break;
        }
        destination_file.write_all(&buffer[..bytes_read])?;
        total_bytes += bytes_read as u64;

        // Update progress bar
        pb.set_position(total_bytes);
    }


    Ok(())
}
