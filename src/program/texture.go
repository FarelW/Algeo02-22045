package program

import (
    // "fmt"
    "image"
    // "os"
    // "image/jpeg"
    // "image/png"
    // "log"
    "math"
    // "image/color"
)

type TexturePixel struct {
	Y int
}

type ImageTexture struct {
	Value [][] TexturePixel
    col, row int
}

type VectorCHE struct {
    C float32
    H float32
    E float32
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

func CHE(matrix [256][256]float32)VectorCHE{
    var totalC float32 =0
    var totalH float32 =0
    var totalE float32 =0

    var vektor VectorCHE

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

func TextureProcessing(img image.Image) VectorCHE {
    var occ [256][256]float32

    var thevector VectorCHE

    // var imageFile string= thefile

    // img, err := loadImage(imageFile)
    // if err != nil {
    //     fmt.Println("Error loading the image:", err)
    //     return thevector
    // }

    imgTexture := getTextureValues(img)
    occ= occurence(imgTexture)
    thevector = CHE(occ)

    return thevector
}

func TextureSimilarity(vector1,vector2 VectorCHE) float32{

    var dotProduct float32 = vector1.C*vector2.C + vector1.H*vector2.H + vector1.E*vector2.E
    var lengthproduct1 float32 = float32(math.Sqrt(float64(vector1.C*vector1.C+vector1.H*vector1.H + vector1.E*vector1.E)))
    var lengthproduct2 float32 = float32(math.Sqrt(float64(vector2.C*vector2.C+vector2.H*vector2.H + vector2.E*vector2.E)))

    var cos float32 = dotProduct/(lengthproduct1*lengthproduct2)

    return cos
}
