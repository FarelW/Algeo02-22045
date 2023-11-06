package program

import (
    "fmt"
    "image"
    "os"
    _ "image/jpeg"
    _ "image/png"
    "math"
)

type TexturePixel struct {
	Y int
}

type ImageTexture struct {
	Value [][] TexturePixel
    col, row int
}

type Vector struct {
    C float32
    H float32
    E float32
}

func printMatrix(image ImageTexture) {
    for y := 0; y < image.row; y++ {
        for x := 0; x < image.col; x++ {
            pixel := image.Value[y][x]
            // fmt.Printf("Pixel at (%d, %d) - R: %.2f, G: %.2f, B: %.2f\n", x, y, pixel.R,pixel.G,pixel.B)
            fmt.Printf("Pixel at (%d, %d) - Y: %d\n", x, y, pixel.Y)
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

func getTextureValues(img image.Image) ImageTexture {
    bounds := img.Bounds()
    width, height := bounds.Max.X-bounds.Min.X, bounds.Max.Y-bounds.Min.Y
    pixelMatrix := make([][]TexturePixel, height)

    for i := bounds.Min.Y; i < bounds.Max.Y; i++ {
        pixelMatrix[i] = make([]TexturePixel, width)
        for j := bounds.Min.X; j < bounds.Max.X; j++ {
            r, g, b, _ := img.At(i, j).RGBA()
            var yf float32 = float32(r>>8)*0.29 + float32(g>>8)*0.587 + float32(b>>8)*0.114
            var y int = int(yf+0.5)
            
            var pixel = TexturePixel{
                Y: y,
            }
            pixelMatrix[i][j] = pixel
        }
    }

    return ImageTexture{
        Value: pixelMatrix,
        col:      width,
        row:      height,
    }
}

func occurence(pixel ImageTexture)[256][256]float32{
    var matriks [256][256]float32
    var total int =0

    for i := 0; i < pixel.row; i++ {
        for j := 0; j < pixel.col-1; j++ {
            var nrow int=pixel.Value[i][j].Y
            var ncol int=pixel.Value[i][j+1].Y
            matriks[nrow][ncol]++
            matriks[ncol][nrow]++
            total+=2
        }
    }

    for i := 0; i < len(matriks); i++ {
        for j := 0; j < len(matriks); j++ {
            matriks[i][j]/=float32(total)
        }
    }

    return matriks
}

func CHE(matrix [256][256]float32)Vector{
    var totalC float32 =0
    var totalH float32 =0
    var totalE float32 =0

    var vektor Vector

    for i := 0; i < len(matrix); i++ {
        for j := 0; j < len(matrix[i]); j++ {
            totalC+=float32((i-j)*(i-j))*matrix[i][j]
            totalH+=matrix[i][j]/float32(1+(i-j)*(i-j))
            if matrix[i][j]!=0 {
                totalE+=(matrix[i][j]*float32(math.Log2(float64(matrix[i][j]))))*(-1)
            }
        }
    }

    vektor.C=totalC
    vektor.H=totalH
    vektor.E=totalE

    return vektor
}

func TextureProcessing() {
    var occ [256][256]float32



    var imageFile string= "../../public/backgroundCamera.jpg"

    img, err := loadImage(imageFile)
    if err != nil {
        fmt.Println("Error loading the image:", err)
        return
    }

    imgTexture := getTextureValues(img)

	// imgTexture := ImageTexture{
	// 	Value: [][]TexturePixel{
	// 		{{Y: 0.0}, {Y: 0.0}, {Y: 1.0}},
	// 		{{Y: 1.0}, {Y: 2.0}, {Y: 3.0}},
	// 		{{Y: 2.0}, {Y: 3.0}, {Y: 2.0}},
	// 	},
	// 	col: 3,
	// 	row: 3,
	// }

	// for _, row := range imgTexture.Value {
	// 	for _, pixel := range row {
	// 		fmt.Printf("%d ", pixel.Y)
	// 	}
	// 	fmt.Println()
	// }
    // fmt.Println()

    occ= occurence(imgTexture)
    // n := len(occ)
	// for i := 0; i < n; i++ {
	// 	for j := 0; j < n; j++ {
	// 		fmt.Printf("%f ", occ[i][j])
	// 	}
	// 	fmt.Println()
	// }

    var thevector Vector

    thevector = CHE(occ)
    fmt.Println()
    fmt.Printf("Vector : [%.2f, %.2f, %.2f]\n",thevector.C,thevector.H,thevector.E)
}