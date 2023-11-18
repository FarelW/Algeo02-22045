package program

import (
	"fmt"
	"strings"

	"net/url"

	"github.com/gocolly/colly"

	_ "image/jpeg"
	_ "image/png"
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