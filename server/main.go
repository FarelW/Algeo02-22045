package main

import (
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Biodata struct {
	ID int `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
}

func main ()  {
	fmt.Println("Hello world")

	app := fiber.New()
	bios:=[]Biodata{}

	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://algeo02-22045.vercel.app/",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Get("/healthcheck", func(c *fiber.Ctx)error{
		return c.SendString("OK")
	})

	app.Post("/api/bio", func(c *fiber.Ctx)error{
		bio := &Biodata{}

		if err := c.BodyParser(bio); err !=nil{
			return err
		}

		bio.ID = len(bios)+1

		bios = append(bios,*bio)

		return c.JSON(bios)
	})

	app.Get("/api/bio", func(c *fiber.Ctx)error{
		return c.JSON(bios)
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}