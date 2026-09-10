use std::env;
use std::fs;
use std::io;

fn main() -> io::Result<()> {
    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();

    // Ensure proper usage
    if args.len() != 3 {
        eprintln!("Usage: {} <source_file> <destination_file>", args[0]);
        std::process::exit(1);
    }

    // Extract source and destination file paths
    let source_file = &args[1];
    let destination_file = &args[2];

    // Copy the file
    match fs::copy(source_file, destination_file) {
        Ok(_) => println!("File copied successfully."),
        Err(e) => eprintln!("Error copying file: {}", e),
    }

    Ok(())

}
