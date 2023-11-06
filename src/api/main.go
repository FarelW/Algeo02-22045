package main

import (
	"fmt"
	"os"
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
	app := fiber.New()
	bios:=[]Uploaded{}

	app.Static("/uploads", "./uploads")

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Get("/healthcheck", func(c *fiber.Ctx)error{
		return c.SendString("OK")
	})

	app.Post("/api/upload", func(c *fiber.Ctx) error {

        fileHeader, err := c.FormFile("file")
        if err != nil {
            log.Printf("Error retrieving the file: %v\n", err)
            return err
        }

        // Open the file
        file, err := fileHeader.Open()
        if err != nil {
            log.Printf("Error opening the file: %v\n", err)
            return err
        }
        defer file.Close()

		uploadDir := "./uploads"

		// Empty the directory before saving the new file
		dir, err := os.Open(uploadDir)
		if err != nil {
			log.Printf("Error opening the directory: %v\n", err)
			return err
		}
		defer dir.Close()
	
		files, err := dir.Readdirnames(-1)
		if err != nil {
			log.Printf("Error reading the directory: %v\n", err)
			return err
		}
	
		for _, d := range files {
			err := os.RemoveAll(filepath.Join(uploadDir, d))
			if err != nil {
				log.Printf("Error removing file: %v\n", err)
				return err
			}
		}

		imagePathUp := fmt.Sprintf("/uploads/%s", fileHeader.Filename)

		filePath := fmt.Sprintf("./uploads/%s", fileHeader.Filename)
		if err := c.SaveFile(fileHeader, filePath); err != nil {
			log.Printf("Error saving file: %v\n", err)
			return err
		}

		var tes texture.Vector

 		// Pass the file to the ProcessFile function
		tes  = texture.TextureProcessing(filePath)
		//  if err != nil {
		// 	 log.Printf("Error processing the file: %v\n", err)
		// 	 return err
		//  }		

        bio := Uploaded{
            FileName:      fileHeader.Filename,
            TextureValue: tes,
			ImagePath: imagePathUp,
        }

        // Append the new Biodata entry to bios
		if len(bios)==0 {
			bios = append(bios, bio)	
		} else {
			bios[0] = bio
		}

        // Return the updated bios
        return c.JSON(bios)

	})

	app.Get("/api/upload", func(c *fiber.Ctx)error{
		return c.JSON(bios)
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}