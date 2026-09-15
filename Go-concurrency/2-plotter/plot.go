package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"

	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/plotutil"
	"gonum.org/v1/plot/vg"
)

const (
	statsFile = "stats.csv"
	plotFile  = "download_timings.png"
)

func main() {
	sequentialTimings, concurrentTimings, err := readDataFromCSV(statsFile)
	if err != nil {
		fmt.Println("Error reading data from CSV:", err)
		return
	}

	err = plotData(sequentialTimings, concurrentTimings, plotFile)
	if err != nil {
		fmt.Println("Error plotting data:", err)
		return
	}

	fmt.Println("Download timings plot saved to:", plotFile)
}

func readDataFromCSV(filePath string) ([]float64, []float64, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, nil, err
	}
	// defer keeps file cleanup next to file opening instead of at every return site.
	defer file.Close()

	r := csv.NewReader(file)
	records, err := r.ReadAll()
	if err != nil {
		return nil, nil, err
	}
	if len(records) == 0 {
		return nil, nil, fmt.Errorf("CSV file is empty")
	}

	sequentialTimings := make([]float64, 0, len(records)-1)
	concurrentTimings := make([]float64, 0, len(records)-1)
	// records[0] is the CSV header; records[1:] is a slice excluding that header.
	for _, record := range records[1:] {
		if len(record) < 3 {
			return nil, nil, fmt.Errorf("invalid timing record: %v", record)
		}

		sequentialTime, err := strconv.ParseFloat(record[1], 64)
		if err != nil {
			return nil, nil, err
		}

		concurrentTime, err := strconv.ParseFloat(record[2], 64)
		if err != nil {
			return nil, nil, err
		}

		sequentialTimings = append(sequentialTimings, sequentialTime)
		concurrentTimings = append(concurrentTimings, concurrentTime)
	}

	return sequentialTimings, concurrentTimings, nil
}

func plotData(sequentialTimings, concurrentTimings []float64, filePath string) error {
	p := plot.New()
	p.Title.Text = "Sequential vs Concurrent (With Goroutines) Download Timings"
	p.X.Label.Text = "Total Images Downloaded"
	p.Y.Label.Text = "Total Time Elapsed (ms)"

	sequentialPoints := makePoints(sequentialTimings)
	concurrentPoints := makePoints(concurrentTimings)

	sequentialLine, err := plotter.NewLine(sequentialPoints)
	if err != nil {
		return err
	}
	sequentialLine.LineStyle.Width = vg.Points(1)
	sequentialLine.Color = plotutil.Color(0)

	concurrentLine, err := plotter.NewLine(concurrentPoints)
	if err != nil {
		return err
	}
	concurrentLine.LineStyle.Width = vg.Points(1)
	concurrentLine.Color = plotutil.Color(2)

	p.Add(sequentialLine, concurrentLine)
	p.Legend.Add("Sequential", sequentialLine)
	p.Legend.Add("Concurrent", concurrentLine)

	return p.Save(8*vg.Inch, 6*vg.Inch, filePath)
}

func makePoints(timings []float64) plotter.XYs {
	// plotter.XYs is Gonum's slice type for points with X and Y coordinates.
	points := make(plotter.XYs, len(timings))
	for index, elapsedMilliseconds := range timings {
		points[index].X = float64(index + 1)
		points[index].Y = elapsedMilliseconds
	}
	return points
}
