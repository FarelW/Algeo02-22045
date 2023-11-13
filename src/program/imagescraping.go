package main

import (
	"fmt"
	"strings"

	"net/http"
	"net/url"

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
		link := e.Request.AbsoluteURL(e.Attr("src"))
		if strings.HasSuffix(link, ".jpg") || strings.HasSuffix(link, ".png") || strings.HasSuffix(link, ".jpeg") {
			imageUrls = append(imageUrls, link)
		}
		fmt.Println(link)
	})

	err = c.Visit(urlStr)
	if err != nil {
		fmt.Printf("Error visiting URL: %s\n", err)
		return nil
	}

	return imageUrls
}

func main() {
	// defer program.timer("main")()
	urlToScrape := "https://tokopedia.com/"
	imageUrls := scrappingToUrlArray(urlToScrape)

	// imageUrls is array of image links
	// fmt.Println("Image URLs:")
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
	}
}
