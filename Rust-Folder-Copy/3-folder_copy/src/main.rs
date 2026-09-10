use std::env;
use std::fs;
use std::io;
use std::path::Path;

fn copy_dir(src: &Path, dest: &Path) -> io::Result<()> {
    // Create the destination directory if it doesn't exist
    if !dest.exists() {
        fs::create_dir(dest)?;
    }

    // Iterate through the entries in the source directory
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let entry_path = entry.path();
        let file_name = entry_path.file_name().unwrap().to_str().unwrap().to_string();
        let dest_path = dest.join(&file_name);

        // If the entry is a directory, recursively copy it
        if file_type.is_dir() {
            copy_dir(&entry_path, &dest_path)?;
        } else {
            // Otherwise, copy the file
            fs::copy(&entry_path, &dest_path)?;
        }
    }

    Ok(())
}

fn main() -> io::Result<()> {
    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();

    // Ensure proper usage
    if args.len() != 3 {
        eprintln!("Usage: {} <source_dir> <destination_dir>", args[0]);
        std::process::exit(1);
    }

    // Extract source and destination directory paths
    let source_dir = Path::new(&args[1]);
    let destination_dir = Path::new(&args[2]);

    // Copy the directory
    copy_dir(source_dir, destination_dir)?;

    println!("Directory copied successfully.");

    Ok(())
}
