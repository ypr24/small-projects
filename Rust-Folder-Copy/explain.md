# How the Rust Programs Work

This repository contains five small Rust programs. They build from a minimal program, to copying one file, to recursively copying folders, and finally to copying folders while displaying progress.

The folder `1-word_count` is named as if it were a word-count exercise, but its current source code is a file-copy program. The explanation below follows the source code, not the folder name.

## Rust and JavaScript/TypeScript at a glance

A useful mental model for a JavaScript or TypeScript developer is:

- `fn main()` is the program entry point, similar to a top-level script function.
- `let` creates a binding. Bindings are immutable by default; `let mut` is required when the binding itself will be changed.
- `Vec<String>` is a growable array of owned strings, roughly like `string[]`, but with explicit ownership rules.
- `&T` is a borrowed reference to a `T`. It is similar to receiving a reference to an existing object without taking ownership, but Rust checks its lifetime and aliasing rules at compile time.
- `Result<T, E>` represents either success (`Ok(T)`) or failure (`Err(E)`). Rust does not use exceptions for these ordinary filesystem errors.
- `Option<T>` represents either a value (`Some(T)`) or no value (`None`), similar to a nullable value but checked explicitly by the type system.
- `Path` and `PathBuf` represent filesystem paths. They are more appropriate than plain strings because paths can contain platform-specific representations that are not always valid Unicode.

Rust makes these distinctions explicit so that many invalid memory accesses, forgotten error cases, and use-after-cleanup bugs are rejected before the program runs.

## `0-hello/main.rs`

```rust
fn main() {
    println!("Hello, World!");
}
```

Execution starts in `main`. The `println!` macro writes a line to standard output. There are no files, fallible operations, borrowed references, or resources that need explicit cleanup in this example.

The `!` means `println!` is a macro rather than an ordinary function. Macros can accept syntax such as the format string and arguments and expand into Rust code during compilation.

## Shared startup flow in the file-copy programs

`1-word_count/src/main.rs` and `2-file_copy/src/main.rs` have the same behavior and nearly the same code. Both start with:

```rust
use std::env;
use std::fs;
use std::io;
```

These `use` statements bring names from the standard library modules into local scope:

- `std::env` provides access to process arguments.
- `std::fs` provides filesystem functions such as `fs::copy`.
- `std::io` provides the `io::Result` type used by `main`.

Their `main` functions return `io::Result<()>`:

```rust
fn main() -> io::Result<()> {
```

`io::Result<()>` is shorthand for `Result<(), io::Error>`. The `()` type means there is no useful success value. A successful program returns `Ok(())`; a failed I/O operation can return an `io::Error` to the Rust runtime, which reports it and exits with failure.

### 1. Collect command-line arguments

```rust
let args: Vec<String> = env::args().collect();
```

`env::args()` produces an iterator of command-line arguments. The first argument is normally the executable name. `.collect()` consumes the iterator and builds a `Vec<String>`.

Compared with JavaScript's `process.argv`, the important Rust difference is ownership. The vector owns its `String` values. The strings are not borrowed from some temporary process-wide array, so the program can safely keep using them while `args` is alive.

### 2. Validate the argument count

The programs require exactly three arguments in the vector: the executable name, a source path, and a destination path.

```rust
if args.len() != 3 {
    eprintln!("Usage: {} <source_file> <destination_file>", args[0]);
    std::process::exit(1);
}
```

`eprintln!` writes to standard error instead of standard output. `std::process::exit(1)` terminates the process immediately with exit code `1`, which conventionally means failure. Because this branch exits, the later code can safely index `args[1]` and `args[2]`.

Unlike JavaScript, where an out-of-range array access produces `undefined`, indexing a Rust vector with `args[1]` would panic if the index were invalid. The length check prevents that case.

### 3. Borrow the path strings

```rust
let source_file = &args[1];
let destination_file = &args[2];
```

The `&` creates references to strings owned by `args`. The program does not move the strings out of the vector and does not clone them. This is borrowing: `source_file` and `destination_file` can read the values while `args` remains their owner.

Rust ensures that these references cannot outlive `args`. JavaScript generally uses garbage collection to keep referenced objects alive; Rust instead proves at compile time that the owner remains valid for every borrow.

### 4. Copy the file and handle the result

```rust
match fs::copy(source_file, destination_file) {
    Ok(_) => println!("File copied successfully."),
    Err(e) => eprintln!("Error copying file: {}", e),
}
```

`fs::copy` performs a synchronous filesystem copy. It returns `Result<u64, io::Error>`: `Ok(_)` contains the number of bytes copied, and `Err(e)` contains the operating-system error. The `_` deliberately ignores the byte count.

`match` is Rust's exhaustive pattern-matching construct. It is similar to a `switch`, but it works directly with typed values such as `Result`. Both variants are handled here:

- `Ok(_)` prints success.
- `Err(e)` prints the error.

This code reports the copy error but then reaches `Ok(())` and returns success from `main`. Therefore, a failed `fs::copy` prints an error but does not necessarily produce a non-zero process exit code. That is the behavior of the current source.

There is no `?` in these two programs. If they used `fs::copy(source_file, destination_file)?`, the `Err` would return immediately from `main` instead of being handled by `match`.

## `3-folder_copy/src/main.rs`

This program adds recursive directory copying with:

```rust
use std::path::Path;
```

### `copy_dir`

```rust
fn copy_dir(src: &Path, dest: &Path) -> io::Result<()> {
```

`copy_dir` borrows two `Path` values. The function does not own or destroy the paths supplied by its caller. It returns `io::Result<()>` because reading directories, inspecting entries, creating directories, and copying files can all fail.

### Create the destination directory

```rust
if !dest.exists() {
    fs::create_dir(dest)?;
}
```

If the destination does not exist, `fs::create_dir` creates it. The `?` operator means:

- On `Ok(())`, continue to the next statement.
- On `Err(error)`, return that error immediately from `copy_dir`.

This is concise error propagation. It is somewhat like returning a rejected promise from an `async` JavaScript function, but this code is not asynchronous and `Result` is an ordinary synchronous value.

`dest.exists()` returns a boolean. It is only a preliminary check; the creation can still fail because of permissions, a race with another process, or another filesystem condition.

### Read entries and build paths

```rust
for entry in fs::read_dir(src)? {
    let entry = entry?;
    let file_type = entry.file_type()?;
    let entry_path = entry.path();
    let file_name = entry_path.file_name().unwrap().to_str().unwrap().to_string();
    let dest_path = dest.join(&file_name);
```

`fs::read_dir(src)?` opens the directory for iteration. The `for` loop visits each directory entry. Each item from the iterator is itself a `Result`, so `let entry = entry?` handles errors encountered while reading the next entry.

`entry.file_type()?` asks the operating system whether the entry is a directory or another file type. `entry.path()` creates an owned path value for the source entry.

`entry_path.file_name()` returns an `Option<&OsStr>` because a path might not have a final component. `.to_str()` returns an `Option<&str>` because an operating-system filename might not be valid UTF-8. The code calls `unwrap()` on both options, which means it assumes both values exist and are valid UTF-8. If either assumption is false, the program panics rather than returning an `io::Error`.

This is an important difference from JavaScript: Rust exposes possible absence and invalid text through `Option`, and the programmer must choose how to handle it. `unwrap()` is an explicit assertion that the value must be present. A more defensive implementation would use `match`, `ok_or`, or a lossy conversion.

`.to_string()` creates an owned `String`, and `dest.join(&file_name)` creates the destination path without taking ownership of `file_name`. The `&file_name` is a temporary borrow used during the call.

### Recurse into directories or copy files

```rust
if file_type.is_dir() {
    copy_dir(&entry_path, &dest_path)?;
} else {
    fs::copy(&entry_path, &dest_path)?;
}
```

For a directory, `copy_dir` calls itself. Each recursive call processes one nested directory and returns before its caller continues. For any entry that is not reported as a directory, `fs::copy` copies it as a file.

The recursion is synchronous and depth-first: one directory is completely processed before the loop continues with the next sibling entry. There is no parallel work.

The `?` operator propagates the first filesystem error up through every active recursive call until it reaches `main`.

### `main` for folder copying

`main` validates three arguments, then creates borrowed paths:

```rust
let source_dir = Path::new(&args[1]);
let destination_dir = Path::new(&args[2]);
```

`Path::new` creates a borrowed `&Path` view over the argument string. It does not copy the path text. The `args` vector remains alive for the rest of `main`, so these borrowed paths remain valid.

Then:

```rust
copy_dir(source_dir, destination_dir)?;
println!("Directory copied successfully.");
Ok(())
```

A successful recursive copy prints the message. Any propagated `io::Error` skips the message and returns the error from `main`, which causes the process to fail. This differs from the file-copy examples, which catch the error with `match` and still return `Ok(())` afterward.

## `4-folder_copy_with_progress/src/main.rs`

This program keeps the recursive structure but copies file contents manually so it can update an `indicatif::ProgressBar`.

Its imports are:

```rust
use std::env;
use std::fs;
use std::io::{self, Read, Write};
use std::path::Path;
use indicatif::{ProgressBar, ProgressStyle};
```

`Read` and `Write` are traits. Bringing them into scope makes methods such as `read` and `write_all` available on `std::fs::File`.

### Top-level error handling

This version uses:

```rust
if let Err(err) = copy_dir_with_progress(source_dir, destination_dir) {
    eprintln!("Error: {}", err);
    std::process::exit(1);
}
```

`if let` is a compact pattern match that runs the body only for an `Err` variant. On `Ok(())`, the program continues to the success message. On failure, it prints the error and explicitly exits with code `1`.

The `main` function itself returns `()`, not `io::Result<()>`, so it must handle the result itself.

### `copy_dir_with_progress`

```rust
fn copy_dir_with_progress(source: &Path, destination: &Path) -> io::Result<()> {
```

The function borrows both paths and recursively processes the source directory. It uses `fs::create_dir_all(destination)?`, which can create the destination and any missing parent directories. This is more capable than `create_dir` in `3-folder_copy`.

Each entry is classified with `entry_path.is_dir()`. For a directory, it converts the entry name into a `String`, joins it to the destination, and recursively calls `copy_dir_with_progress`.

For a file, it builds a destination path and calls:

```rust
copy_file_with_progress(&entry_path, &dest_path, &file_name)?;
```

The third argument, `file_name_display: &str`, is only borrowed for display in the progress bar. It does not need to be owned by `copy_file_with_progress`.

The filename conversion is more defensive than in `3-folder_copy`:

```rust
entry.file_name().into_string().unwrap_or_else(|os_string| {
    os_string.to_string_lossy().to_string()
});
```

`entry.file_name()` returns an `OsString`. `into_string()` returns `Result<String, OsString>` because the name may not be valid UTF-8. `unwrap_or_else` keeps the normal `String` when conversion succeeds, and otherwise converts the operating-system string lossily. Lossy conversion can replace invalid text, but it avoids panicking just because a filename is not UTF-8.

### `copy_file_with_progress`

The function begins by obtaining the source metadata:

```rust
let metadata = fs::metadata(source)?;
let total_size = metadata.len();
```

`metadata` can fail, so `?` propagates the error. `metadata.len()` gives the file size in bytes as a `u64`. The size becomes the progress bar's total.

Then it creates and configures the bar:

```rust
let pb: ProgressBar = ProgressBar::new(total_size);
```

`ProgressStyle::default_bar().template(...)` constructs the display format. The call to `template` returns a `Result`, so the code uses `.expect("Failed to create progress bar style")`. Unlike `?`, `expect` panics with the supplied message if the template is invalid. The template contains elapsed time, a 40-character bar, the filename, bytes copied, total bytes, and an estimated time remaining.

### Opening files and copying chunks

```rust
let mut source_file = fs::File::open(source)?;
let mut destination_file = fs::File::create(destination)?;
```

The source is opened for reading and the destination is created or truncated for writing. Both operations can fail and are propagated with `?`.

The `mut` is needed because reading advances the source file's current position and writing changes the destination file. The variables own their `File` handles.

The copying loop uses an 8 KiB buffer:

```rust
let mut buffer = [0; 8192];
let mut total_bytes = 0;

loop {
    let bytes_read = source_file.read(&mut buffer)?;
    if bytes_read == 0 {
        break;
    }
    destination_file.write_all(&buffer[..bytes_read])?;
    total_bytes += bytes_read as u64;
    pb.set_position(total_bytes);
}
```

Each `read` fills some or all of `buffer` and returns the number of bytes read. A return value of `0` signals end-of-file. Only `buffer[..bytes_read]` is written, so unused bytes from the final buffer are not copied.

`&mut buffer` is a mutable borrow. `read` may change the buffer contents, but the borrow is limited to the call. `&buffer[..bytes_read]` is an immutable slice borrow of exactly the bytes that were read. Rust ensures these borrows are valid and do not overlap incompatibly.

`write_all` keeps writing until the whole slice is written or an error occurs. Both `read` and `write_all` return `io::Result`, so `?` stops immediately on an I/O failure. The progress position is updated only after the destination accepted the bytes.

### Resource cleanup and `Drop`

`source_file`, `destination_file`, and `pb` are local variables owned by `copy_file_with_progress`. When the function returns, Rust automatically drops local values in reverse order of their scope. Dropping a `std::fs::File` closes its operating-system file handle; dropping the progress bar lets `indicatif` finish its cleanup behavior.

This is Rust's RAII-style resource management. JavaScript relies mostly on garbage collection, and garbage collection does not give a precise time at which a file or socket is closed. Rust's ownership system gives deterministic cleanup when the owner leaves scope. The `Drop` trait defines this cleanup behavior for types that need it. The source code does not implement `Drop` manually, but `File` and the progress-bar types have cleanup behavior supplied by their implementations.

If a `?` returns early because an operation fails, Rust still drops the local values that have already been created. Thus an opened source file is cleaned up even when a later read or write fails.

## Concurrency and timing

None of the programs create threads or use asynchronous tasks. They do not use channels, mutexes, atomics, or other synchronization primitives. Every filesystem operation happens synchronously on the current thread, and the next operation waits until the previous one returns.

That means:

- `fs::copy` blocks until the operating system finishes or reports an error.
- Recursive directory copying processes entries one at a time in the order returned by `read_dir`; the code does not promise a sorted order.
- The progress version reads and writes one buffer at a time. It updates the display after each successful chunk.
- The displayed elapsed time and ETA come from `indicatif`'s progress bar. They describe wall-clock progress while the synchronous copy loop is running; they do not make the copy concurrent.
- A slow disk, filesystem, or operating-system call pauses the current program and therefore pauses progress updates until that call returns.

Rust's ownership rules would also help make multithreaded versions safe, but there is no multithreading in this source code to coordinate.

## Complete execution summary

1. The operating system starts one selected `main` function.
2. The copy programs collect command-line arguments into `Vec<String>` and validate the count.
3. Source and destination paths are borrowed from that vector rather than copied.
4. The selected program either prints a greeting, copies one file, or walks a directory recursively.
5. Filesystem operations return `Result` values. `match`, `if let`, or `?` decides whether success continues or failure is reported and propagated.
6. The progress version opens each file, transfers bytes through an 8192-byte buffer, and updates `ProgressBar` after each successful write.
7. On normal return or early error return, owned resources are dropped automatically and file handles are closed deterministically.
8. A successful folder copy prints its completion message. Invalid arguments use `std::process::exit(1)`, and the folder-copy programs also exit with failure when an I/O error reaches their top-level handling.

These programs demonstrate Rust's central tradeoff: more explicit types and ownership rules than JavaScript/TypeScript, in exchange for predictable cleanup, no garbage-collector pause requirement for these resources, and compile-time checks around references and mutation.
