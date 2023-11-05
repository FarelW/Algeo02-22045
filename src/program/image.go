package main

import (
    "fmt"
    "image"
    "os"
    _ "image/jpeg"
    _ "image/png"
)

type Pixel struct {
	R,G,B float32
	cmax, cmin, delta float32
	maxtype string
}

type ImageRGB struct {
	ValueRGB [][] Pixel
    col, row int
}

func printMatrix(image ImageRGB) {
    for y := 0; y < image.row; y++ {
        for x := 0; x < image.col; x++ {
            pixel := image.ValueRGB[y][x]
            fmt.Printf("Pixel at (%d, %d) - R: %.2f, G: %.2f, B:%.2f\n", x, y, pixel.R, pixel.G, pixel.B)
			fmt.Printf("Pixel at (%d, %d) - cmax: %.2f, cmin: %.2f\n", x, y, pixel.cmax, pixel.cmin)
        }
        fmt.Println()
    }
}

func loadImage(filename string) (image.Image, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    img, _, err := image.Decode(file)
    if err != nil {
        return nil, err
    }

    return img, nil
}

func MaxC(R,G,B float32) float32 {
	if R>G {
		if R>B {
			return R
		} else {
			return B
		}
	} else {
		if G>B {
			return G
		} else {
			return B	
		}
	}
}

func MinC(R,G,B float32) float32 {
	if R<G {
		if R<B {
			return R
		} else {
			return B
		}
	} else {
		if G<B {
			return G
		} else {
			return B	
		}
	}
}

func getNormalizedRGBValues(img image.Image) ImageRGB {
    bounds := img.Bounds()
    width, height := bounds.Max.X-bounds.Min.X, bounds.Max.Y-bounds.Min.Y
    pixelMatrix := make([][]Pixel, height)

    for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
        pixelMatrix[y] = make([]Pixel, width)
        for x := bounds.Min.X; x < bounds.Max.X; x++ {
            r, g, b, _ := img.At(x, y).RGBA()
            rNorm := float32(r>>8) / 255.0
            gNorm := float32(g>>8) / 255.0
            bNorm := float32(b>>8) / 255.0
            cmaxNorm := MaxC(rNorm, gNorm, bNorm)
            cminNorm := MinC(rNorm, gNorm, bNorm)
            pixel := Pixel{
                R:    rNorm,
                G:    gNorm,
                B:    bNorm,
                cmax: cmaxNorm,
                cmin: cminNorm,
                delta: cmaxNorm - cminNorm,
            }
            pixelMatrix[y][x] = pixel
        }
    }

    return ImageRGB{
        ValueRGB: pixelMatrix,
        col:      width,
        row:      height,
    }
}


func main() {
    imageFile := "../../img/kodoksad.jpg"

    img, err := loadImage(imageFile)
    if err != nil {
        fmt.Println("Error loading the image:", err)
        return
    }

    imgRGB := getNormalizedRGBValues(img)
    printMatrix(imgRGB)
}