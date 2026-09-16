# Understanding the Go Image Downloader

This program reads image URLs from `image_urls.txt`, downloads the images in two different ways, and records timing data in `stats.csv`:

1. Sequentially, one image after another.
2. Concurrently, using several worker goroutines.

The JavaScript mental model is:

```js
const urls = await readURLs();

await downloadOneAtATime(urls);
await downloadWithWorkers(urls);
await saveStats();
```

The main difference is that Go makes concurrency, errors, cleanup, and communication explicit.

---

## 1. Program flow

`main` runs the stages in this order:

```text
Create output directories
        ↓
Read image URLs from image_urls.txt
        ↓
Download sequentially
        ↓
Download concurrently
        ↓
Write timing data to stats.csv
```

Each helper returns an `error` when something can go wrong. The caller checks it immediately:

```go
urls, err := readURLsFromFile(inputFile)
if err != nil {
	fmt.Println("Error reading URLs from file:", err)
	return
}
```

This is similar to JavaScript's `try`/`catch`, but Go normally represents failure as an explicit return value rather than throwing an exception.

---

## 2. Creating directories

The program creates two output directories:

```go
for _, directory := range []string{sequentialDir, concurrentDir} {
	if err := createDirectory(directory); err != nil {
		return
	}
}
```

The slice contains the two directory names. The `for ... range` loop visits each name, similar to:

```js
for (const directory of directories) {
    createDirectory(directory);
}
```

`os.Mkdir(dir, 0755)` creates a directory. The code accepts `os.IsExist(err)` because rerunning the program should not fail just because the directories already exist.

`0755` is a Unix permission value: the owner can read, write, and execute; other users can read and execute.

---

## 3. Reading URLs from a file

`readURLsFromFile` opens the input file and scans it one line at a time:

```go
file, err := os.Open(filePath)
if err != nil {
	return nil, err
}
defer file.Close()

var urls []string
scanner := bufio.NewScanner(file)
for scanner.Scan() {
	urls = append(urls, scanner.Text())
}
```

The JavaScript equivalent would be conceptually similar to:

```js
const urls = fs.readFileSync(filePath, "utf8")
    .split("\n")
    .filter(Boolean);
```

`bufio.Scanner` avoids loading the entire file as one string. Each call to `scanner.Scan()` advances to the next line, and `scanner.Text()` returns that line.

`append` adds an item to a Go slice. A slice is similar to a JavaScript array, but it is a typed view over an underlying array.

The `defer file.Close()` call schedules cleanup when `readURLsFromFile` returns. `scanner.Err()` is checked after the loop because scanning can fail while reading the file.

---

## 4. The shared download helper

Both download modes call `downloadImage`, so the network and file logic lives in one place:

```go
resp, err := http.Get(url)
if err != nil {
	return err
}
defer resp.Body.Close()

if resp.StatusCode != http.StatusOK {
	return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
}
```

This is similar to:

```js
const response = await fetch(url);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.arrayBuffer();
```

Go's `http.Get` returns a response and an error. The response body is a resource, so it must be closed. Checking the status code separately is important because an HTTP request can complete successfully while the server still returns an error status.

The destination name comes from the URL:

```go
fileName := filepath.Base(url)
filePath := filepath.Join(dir, fileName)
file, err := os.Create(filePath)
```

`filepath.Join` builds a path using the operating system's path rules. `io.Copy(file, resp.Body)` streams bytes from the response into the output file without requiring the whole image to be stored in memory.

Both the response body and output file are closed with `defer` after they are successfully acquired.

---

## 5. Sequential downloading

The sequential function uses an ordinary loop:

```go
start := time.Now()
for _, url := range urls {
	err := downloadImage(url, dir)
	if err != nil {
		continue
	}
	timings = append(timings, time.Since(start))
}
```

The next URL is not started until the previous call to `downloadImage` returns:

```text
download image 1 → wait
download image 2 → wait
download image 3 → wait
```

`time.Since(start)` measures elapsed time from the beginning of the complete run. Therefore, each stored value is cumulative, not the duration of only that individual image.

If one download fails, the error is printed and the loop continues with the next URL. The failed image does not add a timing entry.

---

## 6. Concurrent downloading with workers

The concurrent function creates a worker pool. The number of workers is the integer square root of the number of URLs. With 20 URLs:

```text
√20 ≈ 4.47
int(√20) = 4 workers
```

If the URL list is empty, the code still creates one worker so that the worker count is never zero.

### Goroutines

This statement starts a function concurrently:

```go
go func() {
	// worker code
}()
```

The JavaScript mental model is a group of asynchronous tasks, although a goroutine is lighter than creating a new operating-system thread and does not require a Promise API.

### Channels

```go
jobs := make(chan string)
completedTimings := make(chan time.Duration, len(urls))
```

A channel is a typed queue used for communication between goroutines:

```text
main goroutine ── URL ──> jobs channel ──> worker
worker ── duration ──> completedTimings channel ──> main goroutine
```

The `jobs` channel is unbuffered, so sending a URL pauses until a worker receives it:

```go
for _, url := range urls {
	jobs <- url
}
```

This is useful backpressure: the producer cannot run indefinitely ahead of the workers.

Each worker receives jobs until the channel is closed:

```go
for url := range jobs {
	// download this URL
}
```

The producer closes the channel after sending every URL:

```go
close(jobs)
```

Closing does not delete queued values. It tells receivers that no more values will arrive.

### WaitGroup

`sync.WaitGroup` counts active workers:

```go
var wg sync.WaitGroup
wg.Add(workerCount)
```

Each worker calls `wg.Done()` when it exits. The `defer` ensures that this happens even when the worker reaches the end of its function normally:

```go
defer wg.Done()
```

The main goroutine waits here:

```go
wg.Wait()
close(completedTimings)
```

The timing channel is closed only after every worker has stopped sending. Closing it earlier could cause a worker to send to a closed channel and panic.

Finally, the main goroutine ranges over `completedTimings` and collects all values. The channel is the synchronization boundary between the workers and the result-building code.

---

## 7. Timing behavior

Both modes use one `start` time and store `time.Since(start)`. The plotter therefore receives cumulative elapsed times:

```text
image 1: total time through image 1
image 2: total time through image 2
image 3: total time through image 3
```

In the concurrent mode, workers finish in whatever order the network allows. The timing values are collected in completion order, not necessarily input URL order. The CSV compares the two timing slices by index, so its rows represent positions in each result slice rather than guaranteed matches for the same image URL.

The concurrent total is measured after `wg.Wait()`, which means it includes the complete worker run.

---

## 8. Writing the CSV

`saveStatsToCSV` creates `stats.csv` and uses Go's CSV writer:

```go
writer.Write([]string{
	"Image",
	"Sequential Time (ms)",
	"Concurrent Time (ms)",
})
```

`time.Duration` is converted to milliseconds with:

```go
duration.Seconds() * 1000
```

`strconv.FormatFloat` converts the number to text with two decimal places. The CSV writer handles commas and line endings safely instead of requiring manual string concatenation.

The loop stops at the shorter timing slice:

```go
for i := 0; i < len(seqTimings) && i < len(concTimings); i++ {
	// write one row
}
```

That prevents indexing beyond either slice when some downloads fail.

---

## Important Go concepts in this program

| Go concept | Role in this program | JavaScript mental model |
| --- | --- | --- |
| Slice | Stores URLs and timings | Array |
| Multiple return values | Returns a result plus an error | Result plus `try`/`catch` idea |
| `defer` | Runs cleanup when a function returns | `finally` placed near acquisition |
| Goroutine | Runs worker code concurrently | Lightweight async task |
| Channel | Passes typed values between goroutines | Queue between async tasks |
| `WaitGroup` | Waits for workers to finish | Wait for a group of promises |
| `time.Duration` | Represents elapsed time | Milliseconds or another duration value |
