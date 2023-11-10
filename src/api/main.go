package main

import (
	"bytes"
	"encoding/base64"
	"image"
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	texture "github.com/FarelW/Algeo02-22045/program"
	color "github.com/FarelW/Algeo02-22045/program"
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
		// var temp string= base64.StdEncoding.EncodeToString(buf.Bytes())

		img, _, err := image.Decode(buf)
		if err != nil {
			log.Printf("Error decoding the image: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error decoding image"})
		}

		response := fiber.Map{}
		var textureVector texture.VectorCHE
		var colorVector [9][72] float32

		if isColor {
			colorVector = color.ColorProcessing(img)
			// response = fiber.Map{
			// 	"imageFile": temp,
			// 	"textureVector": colorVector,
			// }
		} else {
			textureVector = texture.TextureProcessing(img)
			// log.Println("ini\n",base64.StdEncoding.EncodeToString(buf.Bytes()))

			// response = fiber.Map{
			// 	"imageFile": temp,
			// 	"textureVector": textureVector,
			// }
		}

		// log.Printf("%s\n",response["imageFile"])
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
				continue // Skip files that can't be opened
			}
			defer file.Close()

			buf := new(bytes.Buffer)
			buf.ReadFrom(file)
			var halo string=fileHeader.Filename
			var temp string= base64.StdEncoding.EncodeToString(buf.Bytes())

			img, _, err := image.Decode(buf)
			if err != nil {
				log.Printf("Error decoding the image: %v\n", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error decoding image"})
			}

			fileData := fiber.Map{}

			if isColor {
				var compareData [9][72]float32 = color.ColorProcessing(img)
				var sim float32 = color.ArrayOfVectorCosineWeighting(colorVector, compareData)
	
				log.Println(halo,textureVector,compareData)
	
				fileData = fiber.Map{
					"base64": temp,
					"Similarity": sim,
				}
			} else {
				var compareData texture.VectorCHE = texture.TextureProcessing(img)
				var sim float32 = texture.TextureSimilarity(textureVector,compareData)
	
				// log.Println(halo,textureVector,compareData)
	
				fileData = fiber.Map{
					"base64": temp,
					"Similarity": sim,
				}
			}

			response[fileHeader.Filename] = fileData
		}
	
		log.Println("Sending response")
		return c.JSON(response)
	})
	

	app.Get("/api/upload", func(c *fiber.Ctx) error {
		data := map[string]interface{}{
			"message": "GET request to /api/upload handled successfully",
		}
	
		return c.JSON(data)
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}