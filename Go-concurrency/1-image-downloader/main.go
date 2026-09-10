package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"
)

func main() {
	// Define paths
	csvFilePath := "stats.csv"

	// File containing image URLs
	filePath := "image_urls.txt"

	// Directories to save downloaded images
	sequentialDir := "sequential_downloads"
	concurrentDir := "concurrent_downloads"

	// Create directories
	err := createDirectory(sequentialDir)
	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	err = createDirectory(concurrentDir)
	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	// Read URLs from file
	urls, err := readURLsFromFile(filePath)
	if err != nil {
		fmt.Println("Error reading URLs from file:", err)
		return
	}

	// Sequentially download images
	seqTimings, seqTotalTime, err := downloadImagesSequentially(urls, sequentialDir)
	if err != nil {
		fmt.Println("Error downloading images sequentially:", err)
		return
	}
	fmt.Printf("Sequential download took: %v\n", seqTotalTime)

	// Concurrently download images
	concTimings, concTotalTime, err := downloadImagesConcurrently(urls, concurrentDir)
	if err != nil {
		fmt.Println("Error downloading images concurrently:", err)
		return
	}
	fmt.Printf("Concurrent download took: %v\n", concTotalTime)

	// Save download timings to CSV
	err = saveStatsToCSV(seqTimings, concTimings, csvFilePath)
	if err != nil {
		fmt.Println("Error saving stats to CSV:", err)
		return
	}

	fmt.Println("Download stats saved to:", csvFilePath)
}

func createDirectory(dir string) error {
	err := os.Mkdir(dir, 0755)
	if err != nil && !os.IsExist(err) {
		return err
	}
	return nil
}

func readURLsFromFile(filePath string) ([]string, error) {
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

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return urls, nil
}

func downloadImagesSequentially(urls []string, dir string) ([]time.Duration, time.Duration, error) {
	var timings []time.Duration
	start := time.Now() // Capture start time for sequential download

	for _, url := range urls {
		err := downloadImage(url, dir)
		if err != nil {
			fmt.Printf("Error downloading image %s: %v\n", url, err)
			continue
		}
		duration := time.Since(start) // Calculate time elapsed since download start
		timings = append(timings, duration)
		fmt.Printf("Downloaded image %s in %v\n", url, duration)
	}
	totalDuration := time.Since(start)
	return timings, totalDuration, nil
}

func downloadImagesConcurrently(urls []string, dir string) ([]time.Duration, time.Duration, error) {
	var wg sync.WaitGroup
	numWorkers := int(math.Sqrt(float64(len(urls)))) // Number of concurrent workers
	wg.Add(numWorkers)

	var timings []time.Duration
	start := time.Now() // Capture start time for concurrent download

	jobs := make(chan string, len(urls))
	results := make(chan time.Duration, len(urls))

	// Create workers
	for i := 0; i < numWorkers; i++ {
		go func() {
			defer wg.Done()
			for url := range jobs {
				err := downloadImage(url, dir)
				if err != nil {
					fmt.Printf("Error downloading image %s: %v\n", url, err)
					results <- 0 // Signal error
					continue
				}
				duration := time.Since(start) // time elapsed till start
				timings = append(timings, duration)
				results <- duration
				fmt.Printf("Downloaded image %s in %v\n", url, duration)
			}
		}()
	}

	// Queue jobs
	for _, url := range urls {
		jobs <- url
	}
	close(jobs)

	// Wait for all workers to finish
	wg.Wait()
	close(results)

	// Calculate total concurrent download time
	var totalDuration = timings[len(timings)-1]

	return timings, totalDuration, nil
}

func downloadImage(url string, dir string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Extract the file name from the URL
	fileName := filepath.Base(url)

	// Create the file in the specified directory
	filePath := filepath.Join(dir, fileName)
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Write the image content to the file
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return err
	}

	return nil
}

func saveStatsToCSV(seqTimings, concTimings []time.Duration, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write CSV header
	err = writer.Write([]string{"Image", "Sequential Time (ms)", "Concurrent Time (ms)"})
	if err != nil {
		return err
	}

	// Write CSV rows
	for i := 0; i < len(seqTimings) && i < len(concTimings); i++ {
		row := []string{
			strconv.Itoa(i + 1),
			strconv.FormatFloat(seqTimings[i].Seconds()*1000, 'f', 2, 64),
			strconv.FormatFloat(concTimings[i].Seconds()*1000, 'f', 2, 64),
		}
		err = writer.Write(row)
		if err != nil {
			return err
		}
	}

	return nil
}
