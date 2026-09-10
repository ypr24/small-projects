package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Image struct {
	ID          string `json:"id"`
	Author      string `json:"author"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	URL         string `json:"url"`
	DownloadURL string `json:"download_url"`
}

func main() {
	// Specify the number of random images to fetch
	numImages := 20

	// Fetch random image URLs
	imageURLs, err := fetchRandomImageURLs(numImages)
	if err != nil {
		fmt.Println("Error fetching image URLs:", err)
		return
	}

	// Save URLs to a file
	filePath := "image_urls.txt"
	err = saveURLsToFile(imageURLs, filePath)
	if err != nil {
		fmt.Println("Error saving URLs to file:", err)
		return
	}
	fmt.Println("Image URLs saved to:", filePath)
}

func fetchRandomImageURLs(numImages int) ([]string, error) {
	url := fmt.Sprintf("https://picsum.photos/v2/list?page=2&limit=%d", numImages)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Extract URLs from the JSON response
	var images []Image
	err = json.Unmarshal(body, &images)
	if err != nil {
		return nil, err
	}

	var imageURLs []string
	for _, img := range images {
		imageURLs = append(imageURLs, img.DownloadURL)
	}

	return imageURLs, nil
}

func saveURLsToFile(urls []string, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	for _, url := range urls {
		_, err := file.WriteString(url + "\n")
		if err != nil {
			return err
		}
	}
	return nil
}
