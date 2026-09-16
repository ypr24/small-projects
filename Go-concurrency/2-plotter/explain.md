# Understanding the Go Timing Plotter

This program is the final stage of the project. It reads the timing data produced by `1-image-downloader`, turns the numbers into two lines, and saves a PNG chart:

```text
stats.csv
   ↓
Read CSV records
   ↓
Parse timing strings into float64 values
   ↓
Build Gonum plot points
   ↓
Save download_timings.png
```

The JavaScript mental model is:

```js
const rows = readCSV("stats.csv");
const sequential = rows.map(row => Number(row.sequential));
const concurrent = rows.map(row => Number(row.concurrent));
drawLineChart(sequential, concurrent);
```

Go makes each parsing step and each possible error explicit.

---

## 1. The module and imports

`go.mod` declares this folder as a Go module and lists `gonum.org/v1/plot` as a dependency. Gonum provides the plotting types and the PNG rendering implementation.

The standard-library imports are used for:

| Package | Purpose |
| --- | --- |
| `encoding/csv` | Read comma-separated records |
| `fmt` | Print errors and create descriptive errors |
| `os` | Open the input and create the output |
| `strconv` | Convert CSV text to `float64` |

The Gonum imports provide the chart, line series, colors, and physical dimensions.

---

## 2. Program flow

`main` coordinates two functions:

```go
sequentialTimings, concurrentTimings, err := readDataFromCSV(statsFile)
if err != nil {
	fmt.Println("Error reading data from CSV:", err)
	return
}

err = plotData(sequentialTimings, concurrentTimings, plotFile)
```

This is similar to:

```js
try {
    const [sequential, concurrent] = readDataFromCSV("stats.csv");
    plotData(sequential, concurrent, "download_timings.png");
} catch (error) {
    console.error(error);
}
```

The Go version does not throw here. Each function returns an error, and `main` decides whether to print it and stop.

---

## 3. Reading the CSV

`readDataFromCSV` opens the file and registers cleanup immediately:

```go
file, err := os.Open(filePath)
if err != nil {
	return nil, nil, err
}
defer file.Close()
```

`defer file.Close()` means the file closes when this function returns, including when a later validation or parsing step returns an error.

The CSV reader loads the records:

```go
r := csv.NewReader(file)
records, err := r.ReadAll()
```

Each `record` is a `[]string`. For the generated file, the first record is:

```csv
Image,Sequential Time (ms),Concurrent Time (ms)
```

The code checks that the file is not empty and then skips the header:

```go
for _, record := range records[1:] {
	if len(record) < 3 {
		return nil, nil, fmt.Errorf("invalid timing record: %v", record)
	}
	// parse record[1] and record[2]
}
```

`records[1:]` is a slice expression. It means “all records starting at index 1,” so the header at index 0 is excluded.

---

## 4. Converting CSV text to numbers

CSV values arrive as strings. The timing columns must become numbers before Gonum can plot them:

```go
sequentialTime, err := strconv.ParseFloat(record[1], 64)
if err != nil {
	return nil, nil, err
}
```

The `64` requests a 64-bit floating-point value, matching the `[]float64` slices returned by the function.

The same conversion is performed for the concurrent timing column. A malformed value such as `"unknown"` causes parsing to return an error instead of silently producing an invalid chart.

The slices are initialized with capacity for the expected number of data rows:

```go
sequentialTimings := make([]float64, 0, len(records)-1)
```

This is a typed, growable collection similar to an array, with an initial capacity that can reduce reallocations while values are appended.

---

## 5. Creating the chart

`plotData` creates a Gonum plot and labels it:

```go
p := plot.New()
p.Title.Text = "Sequential vs Concurrent (With Goroutines) Download Timings"
p.X.Label.Text = "Total Images Downloaded"
p.Y.Label.Text = "Total Time Elapsed (ms)"
```

The x-axis is the number of images and the y-axis is cumulative elapsed time in milliseconds. Those meanings come from the downloader's timing format.

The two timing slices are converted into Gonum point collections:

```go
sequentialPoints := makePoints(sequentialTimings)
concurrentPoints := makePoints(concurrentTimings)
```

Each timing value becomes a point whose x-coordinate starts at 1:

```go
points[index].X = float64(index + 1)
points[index].Y = elapsedMilliseconds
```

The explicit `float64` conversion is needed because Gonum coordinates are floating-point values, while `index` is an integer.

---

## 6. Lines and legend

Gonum's `plotter.NewLine` turns each point collection into a line series:

```go
sequentialLine, err := plotter.NewLine(sequentialPoints)
concurrentLine, err := plotter.NewLine(concurrentPoints)
```

The line width and colors are configured, then both lines are added to the plot:

```go
p.Add(sequentialLine, concurrentLine)
p.Legend.Add("Sequential", sequentialLine)
p.Legend.Add("Concurrent", concurrentLine)
```

The legend connects each visual line to the timing method it represents. If Gonum cannot construct a line from the supplied points, the error is returned to `main`.

---

## 7. Saving the PNG

The final statement renders the chart:

```go
return p.Save(8*vg.Inch, 6*vg.Inch, filePath)
```

The image is saved at 8 by 6 inches to `download_timings.png`. Gonum handles the drawing and PNG encoding; the program only supplies the data, labels, dimensions, and output path.

The generated image is an output artifact, not a source file. Running the program again replaces it with a chart based on the current `stats.csv`.

---

## Important behavior

- The plotter expects to be run from `2-plotter`, because `stats.csv` and `download_timings.png` are relative paths.
- The CSV header is skipped and the next two columns are parsed as milliseconds.
- An empty CSV, short record, unreadable file, invalid number, or plotting failure stops the program with an error.
- The x-axis uses row position, not an image ID from the CSV.
- The downloader records cumulative timing values, so the chart shows total elapsed time as more images are completed rather than isolated per-image durations.
- The concurrent values are collected as workers finish, so their row order is completion order rather than necessarily the original URL order.
