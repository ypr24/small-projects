package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const (
	imageCount = 20
	urlFile    = "image_urls.txt"
)

type Image struct {
	// JSON tags map Go field names to the API's lower-case JSON keys.
	ID          string `json:"id"`
	Author      string `json:"author"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	URL         string `json:"url"`
	DownloadURL string `json:"download_url"`
}

func main() {
	imageURLs, err := fetchImageURLs(imageCount)
	if err != nil {
		fmt.Println("Error fetching image URLs:", err)
		return
	}

	err = saveURLsToFile(imageURLs, urlFile)
	if err != nil {
		fmt.Println("Error saving URLs to file:", err)
		return
	}
	fmt.Println("Image URLs saved to:", urlFile)
}

func fetchImageURLs(limit int) ([]string, error) {
	endpoint := fmt.Sprintf("https://picsum.photos/v2/list?page=2&limit=%d", limit)

	resp, err := http.Get(endpoint)
	if err != nil {
		return nil, err
	}
	// defer runs when this function returns, so the response body is always closed.
	defer resp.Body.Close()

	var images []Image
	if err := json.NewDecoder(resp.Body).Decode(&images); err != nil {
		return nil, err
	}

	var imageURLs []string
	for _, image := range images {
		imageURLs = append(imageURLs, image.DownloadURL)
	}

	return imageURLs, nil
}

func saveURLsToFile(urls []string, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	// defer also guarantees that the file is closed on both success and failure.
	defer file.Close()

	for _, url := range urls {
		_, err := file.WriteString(url + "\n")
		if err != nil {
			return err
		}
	}
	return nil
}
