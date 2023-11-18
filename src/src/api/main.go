package main

import (
	"bytes"
	"encoding/base64"
	"image"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	color "github.com/FarelW/Algeo02-22045/program"
	imagescraping "github.com/FarelW/Algeo02-22045/program"
	texture "github.com/FarelW/Algeo02-22045/program"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


type FileData struct {
    Base64     string  `json:"base64"`
    Similarity float32 `json:"similarity"`
}


func main ()  {
	app := fiber.New(fiber.Config{
		BodyLimit: 2 * 1024 * 1024 * 1024, 
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Post("/api/upload", func(c *fiber.Ctx) error {
		log.Println("Upload endpoint hit")
		
		proccesstype := c.FormValue("proccesstype")
		if proccesstype == "" {
			log.Printf("Error detecting process type: not provided\n")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Process type not found"})
		}

		var isColor bool
		if proccesstype == "true" {
			isColor = true
		} else if proccesstype == "false" {
			isColor = false
		} else {
			log.Printf("Error: Invalid process type value\n")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid process type"})
		}

		imageFileHeader, err := c.FormFile("imageFile")
		if err != nil {
			log.Printf("Error retrieving the image file: %v\n", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "image file not found"})
		}
	
		imageFile, err := imageFileHeader.Open()
		if err != nil {
			log.Printf("Error opening the image file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error opening image file"})
		}
		defer imageFile.Close()
	
		buf := new(bytes.Buffer)
		buf.ReadFrom(imageFile)
		var temp string= base64.StdEncoding.EncodeToString(buf.Bytes())

		img, _, err := image.Decode(buf)
		if err != nil {
			log.Printf("Error decoding the image: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error decoding image"})
		}

		response := fiber.Map{}
		var dataArray []fiber.Map
		var textureVector texture.VectorCHE
		var colorVector [9][72] float32

		if isColor {
			colorVector = color.ColorProcessing(img)
			response["imageFile"] = fiber.Map{
				"base64": temp,
			}
		} else {
			textureVector = texture.TextureProcessing(img)
			response["imageFile"] = fiber.Map{
				"base64": temp,
			}
		}

		log.Println("Image file processed")
	
		// Handle multiple dataset files upload
		form, err := c.MultipartForm()
		if err != nil {
			log.Printf("Error retrieving multipart form: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error retrieving files"})
		}

		files := form.File["selectedFiles"]
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				log.Printf("Error opening file: %v\n", err)
			}
			defer file.Close()

			extension := filepath.Ext(fileHeader.Filename)
			extension = strings.ToLower(extension)

			// Check if the extension is valid (jpg, jpeg, or png)
			if extension != ".jpg" && extension != ".jpeg" && extension != ".png" {
				log.Printf("Unsupported file format: %s\n", extension)
				continue // Skip this file and proceed with the next one
			}

			var nameperfile string = fileHeader.Filename

			buf := new(bytes.Buffer)
			buf.ReadFrom(file)
			// var halo string=fileHeader.Filename
			var temp string= base64.StdEncoding.EncodeToString(buf.Bytes())

			img, _, err := image.Decode(buf)
			if err != nil {
				log.Printf("Error decoding the image: %v\n", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error decoding image"})
			}

			var sim float32
			if isColor {
				var compareData [9][72]float32 = color.ColorProcessing(img)
				sim = color.ArrayOfVectorCosineWeighting(colorVector, compareData)
			} else {
				var compareData texture.VectorCHE = texture.TextureProcessing(img)
				sim = texture.TextureSimilarity(textureVector, compareData)
			}

			if sim >= 60 {

				fileData := fiber.Map{
					"fileName":nameperfile,
					"base64": temp,
					"Similarity": sim,
				}
				dataArray = append(dataArray, fileData)
			}
		}

		response["data"] = dataArray
	
		log.Println("Sending response")
		return c.JSON(response)
	})
	
	app.Post("/api/scrape", func(c *fiber.Ctx) error {
		log.Println("Scrape endpoint hit")
	
		// Retrieve process type
		proccesstype := c.FormValue("proccesstype")
		if proccesstype == "" {
			log.Printf("Error detecting process type: not provided\n")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Process type not found"})
		}
	
		var isColor bool
		if proccesstype == "true" {
			isColor = true
		} else if proccesstype == "false" {
			isColor = false
		} else {
			log.Printf("Error: Invalid process type value\n")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid process type"})
		}
	
		// Retrieve the image file
		imageFileHeader, err := c.FormFile("imageFile")
		if err != nil {
			log.Printf("Error retrieving the image file: %v\n", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "image file not found"})
		}
	
		imageFile, err := imageFileHeader.Open()
		if err != nil {
			log.Printf("Error opening the image file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error opening image file"})
		}
		defer imageFile.Close()
	
		buf := new(bytes.Buffer)
		buf.ReadFrom(imageFile)
		var temp string = base64.StdEncoding.EncodeToString(buf.Bytes())
	
		img, _, err := image.Decode(buf)
		if err != nil {
			log.Printf("Error decoding the image: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error decoding image"})
		}

		response := fiber.Map{}
		var dataArray []fiber.Map
		var textureVector texture.VectorCHE
		var colorVector [9][72]float32

		if isColor {
			colorVector = color.ColorProcessing(img)
			response["imageFile"] = fiber.Map{
				"base64": temp,
			}
			// log.Println("color:",colorVector)
		} else {
			textureVector = texture.TextureProcessing(img)
			response["imageFile"] = fiber.Map{
				"base64": temp,
			}
			log.Println("texture:",textureVector)
		}

		var scrapUrl string= c.FormValue("Scrapurl")
		if scrapUrl == "" {
			log.Printf("Scrapurl not provided\n")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Scrapurl not found"})
		}

		imageUrls := imagescraping.ScrappingToUrlArray(scrapUrl)
		
		for _, imageUrl := range imageUrls {
			resp, err := http.Get(imageUrl)
			if err != nil {
				log.Println("Error downloading image:", err)
				continue // skip to next image
			}
		
			if !strings.HasPrefix(resp.Header.Get("Content-Type"), "image/") {
				log.Println("URL is not an image:", imageUrl)
				resp.Body.Close()
				continue
			}
		
			if resp.StatusCode != http.StatusOK {
				log.Println("Error: Non-OK status code received:", resp.Status)
				resp.Body.Close()
				continue
			}
		
			imgData, err := io.ReadAll(resp.Body)
			resp.Body.Close() // Close the response body immediately after reading
			if err != nil {
				log.Println("Error reading image data:", err)
				continue
			}
		
			imgReader := bytes.NewReader(imgData)
			decodedImg, _, err := image.Decode(imgReader)
			if err != nil {
				log.Println("Error decoding image:", err)
				continue
			}
		
			var sim float32
			if isColor {
				compareData := color.ColorProcessing(decodedImg)
				sim = color.ArrayOfVectorCosineWeighting(colorVector, compareData)
			} else {
				compareData := texture.TextureProcessing(decodedImg)
				sim = texture.TextureSimilarity(textureVector, compareData)
			}
		
			temp := base64.StdEncoding.EncodeToString(imgData)
			if sim >= 60 {
				fileData := fiber.Map{
					"fileName":   imageUrl,
					"base64":     temp,
					"Similarity": sim,
				}
				dataArray = append(dataArray, fileData)
			}
		}
		response["data"] = dataArray

		log.Println("Sending response")
		return c.JSON(response)
		
	})


	app.Get("/api/upload", func(c *fiber.Ctx) error {
		data := map[string]interface{}{
			"message": "GET request to /api/upload handled successfully",
		}
	
		return c.JSON(data)
	})

	app.Get("/api/scraping", func(c *fiber.Ctx) error {
		data := map[string]interface{}{
			"message": "GET request to /api/upload handled successfully",
		}
	
		return c.JSON(data)
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}