package main

import (
	// "fmt"
	// "os"
	"archive/zip"
	"bytes"
	"encoding/base64"
	// "io"
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"path/filepath"
	texture "github.com/FarelW/Algeo02-22045/program"
	image "github.com/FarelW/Algeo02-22045/program"
)

type Uploaded struct {
    FileName string `json:"fileName"`
	RGBValue image.Pixel `json:"RGBValue"`
    TextureValue texture.Vector `json:"TextureValue"`
	ImagePath string `json:"imagePath"`
}

func main ()  {
	// app := fiber.New()

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
	
		response := make(map[string]string)
	
		// Handle Image File Upload
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
		response["imageFile"] = base64.StdEncoding.EncodeToString(buf.Bytes())
		log.Println("Image file processed")
	
		// Handle ZIP File Upload
		zipFileHeader, err := c.FormFile("zipFile")
		if err != nil {
			log.Printf("Error retrieving the ZIP file: %v\n", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "zip file not found"})
		}
	
		zipFile, err := zipFileHeader.Open()
		if err != nil {
			log.Printf("Error opening the ZIP file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error opening zip file"})
		}
		defer zipFile.Close()
	
		zipReader, err := zip.NewReader(zipFile, zipFileHeader.Size)
		if err != nil {
			log.Printf("Error reading the ZIP file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error reading zip file"})
		}
	
		for _, file := range zipReader.File {
			if filepath.Ext(file.Name) == ".png" || filepath.Ext(file.Name) == ".jpg" {
				// log.Printf("Opening %s", file.Name)
				f, err := file.Open()
				if err != nil {
					log.Printf("Error opening file inside the ZIP: %s, %v\n", file.Name, err)
					continue
				}
	
				buf := new(bytes.Buffer)
				buf.ReadFrom(f)
				f.Close()
	
				response[file.Name] = base64.StdEncoding.EncodeToString(buf.Bytes())
				// log.Printf("Processed file from ZIP: %s\n", file.Name)
			}
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