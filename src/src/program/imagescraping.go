package program

import (
	// "io"
	"fmt"
	// "log"
	"strings"

	// "net/http"
	"net/url"

	"github.com/gocolly/colly"

	// "encoding/base64"
	// "image"
	_ "image/jpeg"
	_ "image/png"
	// "bytes"
	// texture "github.com/FarelW/Algeo02-22045/program"
	// color "github.com/FarelW/Algeo02-22045/program"
)

func ScrappingToUrlArray(urlStr string) []string {
    c := colly.NewCollector()

    parsedURL, err := url.Parse(urlStr)
    if err != nil {
        fmt.Println("Error parsing URL:", err)
        return nil
    }
    c.AllowedDomains = []string{parsedURL.Hostname()}

    var imageUrls []string

    c.OnHTML("img[src]", func(e *colly.HTMLElement) {
        link := e.Request.AbsoluteURL(e.Attr("src"))
        link = trimURL(link, ".jpg")
        link = trimURL(link, ".jpeg")
        link = trimURL(link, ".png")

        if link != "" {
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

func trimURL(url, extension string) string {
    index := strings.Index(url, extension)
    if index != -1 {
        return url[:index+len(extension)]
    }
    return url
}

// func ScrapingSimilarity() {
// 	// defer program.timer("main")()
// 	urlToScrape := "https://www.kompasiana.com/"
// 	imageUrls := scrappingToUrlArray(urlToScrape)

// 	for _, imageUrl := range imageUrls {
// 		fmt.Println(imageUrl)
// 		resp, err := http.Get(imageUrl)
// 		if err != nil {
// 			fmt.Println("Error downloading image:", err)
// 			return
// 		}
// 		defer resp.Body.Close()

// 		if resp.StatusCode != http.StatusOK {
// 			fmt.Println("Error: Non-OK status code received:", resp.Status)
// 			return
// 		}

// 		// Read the image from the response body
// 		img, err := io.ReadAll(resp.Body)
// 		if err != nil {
// 			fmt.Println("Error reading image data:", err)
// 			return
// 		}

// 		var textureVector VectorCHE
// 		textureVector.C=24.421219
// 		textureVector.H=0.35270903
// 		textureVector.E=10.932979

// 		imgReader := bytes.NewReader(img)
// 		decodedImg, _, err := image.Decode(imgReader)
// 		if err != nil {
// 			fmt.Println("Error decoding image:", err)
// 			return
// 		}

// 		// Process the image (assuming img is the correct format for processing functions)
// 		var sim float32
// 		var compareData VectorCHE = TextureProcessing(decodedImg)
// 		sim = TextureSimilarity(textureVector, compareData)

// 		// Store file data
// 		temp := base64.StdEncoding.EncodeToString(img)
// 		fileData := map[string]interface{}{
// 			"base64":     temp,
// 			"Similarity": sim,
// 		}

// 		// Handle or output fileData as needed
// 		fmt.Println(fileData)
// 	}
// }
