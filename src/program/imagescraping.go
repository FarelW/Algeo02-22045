package main

import (
	"fmt"
	"image"
	"strings"

	"net/http"
	"net/url"

	"github.com/FarelW/Algeo02-22045/src/program"
	"github.com/gocolly/colly"
)

func scrappingToUrlArray(urlStr string) []string {

	c := colly.NewCollector()

	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		fmt.Println("Error parsing URL:", err)
		return nil
	}
	c.AllowedDomains = []string{parsedURL.Hostname()}

	var imageUrls []string

	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		// Extract the src attribute value
		link := e.Attr("src")

		// Check if the link ends with .jpg, .png, or .jpeg
		if strings.HasSuffix(link, ".jpg") || strings.HasSuffix(link, ".png") || strings.HasSuffix(link, ".jpeg") {
			imageUrls = append(imageUrls, link)
		}
	})

	err = c.Visit(urlStr)
	if err != nil {
		fmt.Printf("Error visiting URL: %s\n", err)
		return nil
	}

	return imageUrls
}

func main() {
	defer program.timer("main")()  
	urlToScrape := "https://scrapeme.live/shop/"
	imageUrls := scrappingToUrlArray(urlToScrape)

	fmt.Println("Image URLs:")
	for _, imageUrl := range imageUrls {
		resp, err := http.Get(imageUrl)
		if err != nil {
			fmt.Println("Error downloading image:", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			fmt.Println("Error: Non-OK status code received:", resp.Status)
			return
		}

		img, _, err := image.Decode(resp.Body)
		if err != nil {
			fmt.Println("Error decoding image:", err)
			return
		}
		imageFile1 := "../../img/beda1.png"
		img2 := img
		img1, err := program.loadImage(imageFile1)
		if err != nil {
			fmt.Println("Error loading the image:", err)
			return
		}

		imgRGB1 := program.getNormalizedRGBValues(img1)
		imgRGB2 := program.getNormalizedRGBValues(img2)
		var imgHSV1 program.ImageHSV
		var imgHSV2 program.ImageHSV
		var vector1 [9][72]float32
		var vector2 [9][72]float32
		program.convertRGBToHSVValues(imgRGB1, &imgHSV1)
		program.convertRGBToHSVValues(imgRGB2, &imgHSV2)
		program.divideHSVMatrixTo9Vectors(imgHSV1, &vector1)
		program.divideHSVMatrixTo9Vectors(imgHSV2, &vector2)
		fmt.Printf("%.2f%%\n", 100*program.ArrayOfVectorCosineWeighting(vector1, vector2))
	}
}
