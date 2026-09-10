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

func main() {
	// Define paths
	csvFilePath := "stats.csv"
	plotFilePath := "download_timings.png"

	// Read data from CSV
	seqCumulativeTimings, concCumulativeTimings, err := readDataFromCSV(csvFilePath)
	if err != nil {
		fmt.Println("Error reading data from CSV:", err)
		return
	}

	// Plot data and save to file
	err = plotData(seqCumulativeTimings, concCumulativeTimings, plotFilePath)
	if err != nil {
		fmt.Println("Error plotting data:", err)
		return
	}

	fmt.Println("Download timings plot saved to:", plotFilePath)
}

func readDataFromCSV(csvFilePath string) ([]float64, []float64, error) {
	var seqCumulativeTimings []float64
	var concCumulativeTimings []float64

	// Open CSV file
	file, err := os.Open(csvFilePath)
	if err != nil {
		return nil, nil, err
	}
	defer file.Close()

	// Read CSV records
	r := csv.NewReader(file)
	records, err := r.ReadAll()
	if err != nil {
		return nil, nil, err
	}

	// Parse records into float64 slices
	for i, record := range records {
		if i == 0 {
			continue // Skip header row
		}

		seqTime, err := strconv.ParseFloat(record[1], 64)
		if err != nil {
			return nil, nil, err
		}

		concTime, err := strconv.ParseFloat(record[2], 64)
		if err != nil {
			return nil, nil, err
		}

		seqCumulativeTimings = append(seqCumulativeTimings, seqTime)
		concCumulativeTimings = append(concCumulativeTimings, concTime)
	}

	return seqCumulativeTimings, concCumulativeTimings, nil
}

func plotData(seqTimings, concTimings []float64, plotFilePath string) error {
	// Create a new plot
	p := plot.New()

	// Set plot title and labels
	p.Title.Text = "Sequential vs Concurrent (With Goroutines) Download Timings"
	p.X.Label.Text = "Total Images Downloaded"
	p.Y.Label.Text = "Total Time Elapsed (ms)"

	// Create sequential data points
	seqPoints := make(plotter.XYs, len(seqTimings))
	for i, time := range seqTimings {
		seqPoints[i].X = float64(i + 1)
		seqPoints[i].Y = time
	}

	// Create concurrent data points
	concPoints := make(plotter.XYs, len(concTimings))
	for i, time := range concTimings {
		concPoints[i].X = float64(i + 1)
		concPoints[i].Y = time
	}

	// Create line plots for sequential and concurrent timings
	seqLine, err := plotter.NewLine(seqPoints)
	if err != nil {
		return err
	}
	seqLine.LineStyle.Width = vg.Points(1)
	seqLine.Color = plotutil.Color(0) // Red color for sequential line

	concLine, err := plotter.NewLine(concPoints)
	if err != nil {
		return err
	}
	concLine.LineStyle.Width = vg.Points(1)
	concLine.Color = plotutil.Color(2) // Green color for concurrent line

	// Add lines to the plot
	p.Add(seqLine, concLine)

	// Set legend
	p.Legend.Add("Sequential", seqLine)
	p.Legend.Add("Concurrent", concLine)

	// Save the plot to a file
	if err := p.Save(8*vg.Inch, 6*vg.Inch, plotFilePath); err != nil {
		return err
	}

	return nil
}
