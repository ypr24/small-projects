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

const (
	inputFile       = "image_urls.txt"
	statsFile       = "stats.csv"
	sequentialDir  = "sequential_downloads"
	concurrentDir  = "concurrent_downloads"
)

func main() {
	for _, directory := range []string{sequentialDir, concurrentDir} {
		if err := createDirectory(directory); err != nil {
			fmt.Println("Error creating directory:", err)
			return
		}
	}

	urls, err := readURLsFromFile(inputFile)
	if err != nil {
		fmt.Println("Error reading URLs from file:", err)
		return
	}

	seqTimings, seqTotalTime, err := downloadImagesSequentially(urls, sequentialDir)
	if err != nil {
		fmt.Println("Error downloading images sequentially:", err)
		return
	}
	fmt.Printf("Sequential download took: %v\n", seqTotalTime)

	concTimings, concTotalTime, err := downloadImagesConcurrently(urls, concurrentDir)
	if err != nil {
		fmt.Println("Error downloading images concurrently:", err)
		return
	}
	fmt.Printf("Concurrent download took: %v\n", concTotalTime)

	err = saveStatsToCSV(seqTimings, concTimings, statsFile)
	if err != nil {
		fmt.Println("Error saving stats to CSV:", err)
		return
	}

	fmt.Println("Download stats saved to:", statsFile)
}

func createDirectory(dir string) error {
	// 0755 gives the owner write access and everyone read/execute access.
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
	// defer is Go's usual cleanup pattern; the file closes when this function returns.
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
	// time.Duration is Go's type for elapsed time values.
	start := time.Now()

	for _, url := range urls {
		err := downloadImage(url, dir)
		if err != nil {
			fmt.Printf("Error downloading image %s: %v\n", url, err)
			continue
		}
		duration := time.Since(start)
		timings = append(timings, duration)
		fmt.Printf("Downloaded image %s in %v\n", url, duration)
	}
	totalDuration := time.Since(start)
	return timings, totalDuration, nil
}

func downloadImagesConcurrently(urls []string, dir string) ([]time.Duration, time.Duration, error) {
	workerCount := int(math.Sqrt(float64(len(urls))))
	if workerCount == 0 {
		workerCount = 1
	}

	// WaitGroup counts workers so the function can wait for all goroutines.
	var wg sync.WaitGroup
	wg.Add(workerCount)
	start := time.Now()

	// Channels are typed queues used to pass work between goroutines.
	jobs := make(chan string)
	completedTimings := make(chan time.Duration, len(urls))

	for i := 0; i < workerCount; i++ {
		// The go keyword starts this function concurrently.
		go func() {
			// defer runs when the worker exits, even after the jobs loop ends.
			defer wg.Done()
			// Ranging over a channel receives values until the channel is closed.
			for url := range jobs {
				if err := downloadImage(url, dir); err != nil {
					fmt.Printf("Error downloading image %s: %v\n", url, err)
					continue
				}
				duration := time.Since(start)
				completedTimings <- duration
				fmt.Printf("Downloaded image %s in %v\n", url, duration)
			}
		}()
	}

	// Sending blocks until a worker receives the URL from the jobs channel.
	for _, url := range urls {
		jobs <- url
	}
	// Closing tells workers that no more URLs will be sent.
	close(jobs)

	// Wait before closing completedTimings so no worker can send to a closed channel.
	wg.Wait()
	close(completedTimings)

	var timings []time.Duration
	// This range collects values until the workers' channel is closed.
	for timing := range completedTimings {
		timings = append(timings, timing)
	}

	return timings, time.Since(start), nil
}

func downloadImage(url string, dir string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	// The response body must be closed separately from the output file.
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
	// The file is closed automatically when downloadImage returns.
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
