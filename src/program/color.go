package program

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"math"
	"os"
	"time"
)

type PixelRGB struct {
	R,G,B float32
	cmax, cmin, delta float32
	maxtype string
}

type ImageRGB struct {
	ValueRGB [][] PixelRGB
    col, row int
}

type PixelHSV struct {
	H,S,V float32
}

type ImageHSV struct {
	ValueHSV [][] PixelHSV
	col, row int
}

func printMatrix(image ImageRGB) {
    for y := 0; y < image.row; y++ {
        for x := 0; x < image.col; x++ {
            PixelRGB := image.ValueRGB[y][x]
            fmt.Printf("PixelRGB at (%d, %d) - R: %.2f, G: %.2f, B:%.2f\n", x, y, PixelRGB.R, PixelRGB.G, PixelRGB.B)
			fmt.Printf("PixelRGB at (%d, %d) - cmax: %.2f, cmin: %.2f\n", x, y, PixelRGB.cmax, PixelRGB.cmin)
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

func getNormalizedRGBValues(img image.Image) ImageRGB {
    bounds := img.Bounds()
    width, height := bounds.Dx(), bounds.Dy()
    PixelRGBMatrix := make([][]PixelRGB, height)

    for y := 0; y < height; y++ {
        PixelRGBMatrix[y] = make([]PixelRGB, width)
        for x := 0; x < width; x++ {
            r, g, b, _ := img.At(x+bounds.Min.X, y+bounds.Min.Y).RGBA()
            rNorm := float32(r >> 8) / 255.0
            gNorm := float32(g >> 8) / 255.0
            bNorm := float32(b >> 8) / 255.0
            cmaxNorm := rNorm
            if gNorm > cmaxNorm {
                cmaxNorm = gNorm
            }
            if bNorm > cmaxNorm {
                cmaxNorm = bNorm
            }
            cminNorm := rNorm
            if gNorm < cminNorm {
                cminNorm = gNorm
            }
            if bNorm < cminNorm {
                cminNorm = bNorm
            }
            PixelRGBMatrix[y][x] = PixelRGB{
                R:    rNorm,
                G:    gNorm,
                B:    bNorm,
                cmax: cmaxNorm,
                cmin: cminNorm,
                delta: cmaxNorm - cminNorm,
            }
        }
    }

    return ImageRGB{
        ValueRGB: PixelRGBMatrix,
        col:      width,
        row:      height,
    }
}

func convertRGBToHSVValues(imgRGB ImageRGB, imgHSV *ImageHSV) {
    imgHSV.col = imgRGB.col 
    imgHSV.row = imgRGB.row
    imgHSV.ValueHSV = make([][]PixelHSV, imgRGB.row) 
    for i := 0; i < imgRGB.row; i++ {
        imgHSV.ValueHSV[i] = make([]PixelHSV, imgRGB.col)
        for j := 0; j < imgRGB.col; j++ {
            pixelRGB := imgRGB.ValueRGB[i][j]
            cmax := pixelRGB.cmax
            delta := pixelRGB.delta

            if (delta == 0) {
                imgHSV.ValueHSV[i][j].H = 0
            } else if (cmax == pixelRGB.R) {
                imgHSV.ValueHSV[i][j].H = float32(60 * math.Mod(float64((pixelRGB.G-pixelRGB.B)/delta), 6))
            } else if (cmax == pixelRGB.G) {
                imgHSV.ValueHSV[i][j].H = 60*((pixelRGB.B-pixelRGB.R)/delta + 2)
            } else if (cmax == pixelRGB.B) {
                imgHSV.ValueHSV[i][j].H = 60*((pixelRGB.R-pixelRGB.G)/delta + 4)
            }

            if (cmax == 0) {
                imgHSV.ValueHSV[i][j].S = 0 
            } else {
                imgHSV.ValueHSV[i][j].S = delta / cmax
            }

            imgHSV.ValueHSV[i][j].V = cmax 
        }
    }
}

func initializeImageHSV(width, height int) ImageHSV {
    valueHSV := make([][]PixelHSV, height)
    for i := range valueHSV {
        valueHSV[i] = make([]PixelHSV, width)
    }

    return ImageHSV{
        ValueHSV: valueHSV,
        col:      width,
        row:      height,
    }
}

func divideHSVMatrixTo9Vectors (hsvMatrix ImageHSV, vector *[9][72]float32)  {
    rowLength := hsvMatrix.row
    rowLengthBin := hsvMatrix.row/3
    columnLength := hsvMatrix.col
    columnLengthBin := hsvMatrix.col/3
    topLeftPic := initializeImageHSV(columnLengthBin, rowLengthBin)
    middleLeftPic := initializeImageHSV(columnLengthBin, rowLengthBin)
    bottomLeftPic := initializeImageHSV(columnLengthBin, rowLength-2*rowLengthBin)
    topMiddlePic := initializeImageHSV(columnLengthBin, rowLengthBin)
    middleMiddlePic := initializeImageHSV(columnLengthBin, rowLengthBin)
    bottomMiddlePic := initializeImageHSV(columnLengthBin, rowLength-2*rowLengthBin)
    topRightPic := initializeImageHSV(columnLength-2*columnLengthBin, rowLengthBin)
    middleRightPic := initializeImageHSV(columnLength-2*columnLengthBin, rowLengthBin)
    bottomRightPic := initializeImageHSV(columnLength-2*columnLengthBin, rowLength-2*rowLengthBin)
    var i,j int
    // Top Left Pic
    for i=0;i<rowLengthBin;i++ {
        for j=0;j<columnLengthBin;j++ {
            topLeftPic.ValueHSV[i][j] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Middle Left Pic
    for i=rowLengthBin;i<2*rowLengthBin;i++ {
        for j=0;j<columnLengthBin;j++ {
            middleLeftPic.ValueHSV[i-rowLengthBin][j] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Bottom Left Pic
    for i=2*rowLengthBin;i<rowLength;i++ {
        for j=0;j<columnLengthBin;j++ {
            bottomLeftPic.ValueHSV[i-2*rowLengthBin][j] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Top Middle Pic
    for i=0;i<rowLengthBin;i++ {
        for j=columnLengthBin;j<2*columnLengthBin;j++ {
            topMiddlePic.ValueHSV[i][j-columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Middle Middle Pic
    for i=rowLengthBin;i<2*rowLengthBin;i++ {
        for j=columnLengthBin;j<2*columnLengthBin;j++ {
            middleMiddlePic.ValueHSV[i-rowLengthBin][j-columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Bottom Middle Pic
    for i=2*rowLengthBin;i<rowLength;i++ {
        for j=columnLengthBin;j<2*columnLengthBin;j++ {
            bottomMiddlePic.ValueHSV[i-2*rowLengthBin][j-columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Top Right Pic
    for i=0;i<rowLengthBin;i++ {
        for j=2*columnLengthBin;j<columnLength;j++ {
            topRightPic.ValueHSV[i][j-2*columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Middle Right Pic
    for i=rowLengthBin;i<2*rowLengthBin;i++ {
        for j=2*columnLengthBin;j<columnLength;j++ {
            middleRightPic.ValueHSV[i-rowLengthBin][j-2*columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    // Bottom Right Pic
    for i=2*rowLengthBin;i<rowLength;i++ {
        for j=2*columnLengthBin;j<columnLength;j++ {
            bottomRightPic.ValueHSV[i-2*rowLengthBin][j-2*columnLengthBin] = hsvMatrix.ValueHSV[i][j]
        }
    }
    convertHSVToVector(topLeftPic, &vector[0])
    convertHSVToVector(topMiddlePic, &vector[1])
    convertHSVToVector(topRightPic, &vector[2])
    convertHSVToVector(middleLeftPic, &vector[3])
    convertHSVToVector(middleMiddlePic, &vector[4])
    convertHSVToVector(middleRightPic, &vector[5])
    convertHSVToVector(bottomLeftPic, &vector[6])
    convertHSVToVector(bottomMiddlePic, &vector[7])
    convertHSVToVector(bottomRightPic, &vector[8])
}

func ArrayOfVectorCosineWeighting(vector1[9][72]float32, vector2[9][72]float32) float32{
    topLeftCosine := cosineSimilarity(vector1[0], vector2[0])
    topMiddleCosine := cosineSimilarity(vector1[1], vector2[1])
    topRightCosine := cosineSimilarity(vector1[2], vector2[2])
    middleLeftCosine := cosineSimilarity(vector1[3], vector2[3])
    middleMiddleCosine := cosineSimilarity(vector1[4], vector2[4])
    middleRightCosine := cosineSimilarity(vector1[5], vector2[5])
    bottomLeftCosine := cosineSimilarity(vector1[6], vector2[6])
    bottomMiddleCosine := cosineSimilarity(vector1[7], vector2[7])
    bottomRightCosine := cosineSimilarity(vector1[8], vector2[8])
    return (topLeftCosine + bottomLeftCosine + bottomRightCosine + topRightCosine + 3*topMiddleCosine + 3*bottomMiddleCosine + 2*middleLeftCosine + 2*middleRightCosine + 4*middleMiddleCosine)/18
}

func normalizeHistogram(histogram []int, totalPixels int) []float32 {
    normalizedHistogram := make([]float32, len(histogram))
    for i, freq := range histogram {
        normalizedHistogram[i] = float32(freq) / float32(totalPixels)
    }
    return normalizedHistogram
}

func printHistogram(histogram []float32, title string) {
    fmt.Println(title)
    for i, value := range histogram {
        fmt.Printf("Bin %d: %f\n", i, value)
    }
}

func printHSVMatrix(image ImageHSV) {
    for y := 0; y < len(image.ValueHSV); y++ {
        for x := 0; x < len(image.ValueHSV[y]); x++ {
            pixelHSV := image.ValueHSV[y][x]
            fmt.Printf("PixelHSV at (%d, %d) - H: %.2f, S: %.2f, V:%.2f\n", x, y, pixelHSV.H, pixelHSV.S, pixelHSV.V)
        }
        fmt.Println()
    }
}

func convertHSVToVector(imgHSV ImageHSV, vector *[72]float32) {
    var indexH, indexS, indexV int

    for i := range imgHSV.ValueHSV {
        for j := range imgHSV.ValueHSV[i] {
            h := imgHSV.ValueHSV[i][j].H
            s := imgHSV.ValueHSV[i][j].S
            v := imgHSV.ValueHSV[i][j].V

            if h == 360 {
                h = 0
            } else if h < 0 {
                h += 360
            }

            if h > 315.5 && h <= 360 {
                indexH = 0
            } else if h >= 1 && h <= 25.5 {
                indexH = 1
            } else if h > 25.5 && h <= 40.5 {
                indexH = 2
            } else if h > 40.5 && h <= 120.5 {
                indexH = 3
            } else if h > 120.5 && h <= 190.5 {
                indexH = 4
            } else if h > 190.5 && h <= 270.5 {
                indexH = 5
            } else if h > 270.5 && h <= 295.5 {
                indexH = 6
            } else if h > 295.5 && h <= 315.5 {
                indexH = 7
            }

            if s >= 0 && s < 0.2 {
                indexS = 0
            } else if s >= 0.2 && s < 0.7 {
                indexS = 1
            } else if s >= 0.7 && s <= 1 {
                indexS = 2
            }

            if v >= 0 && v < 0.2 {
                indexV = 0
            } else if v >= 0.2 && v < 0.7 {
                indexV = 1
            } else if v >= 0.7 && v <= 1 {
                indexV = 2
            }

            // fmt.Printf("%d %d %d\n", indexH, indexS, indexV)
            index := (indexH * 9) + (indexS * 3) + indexV
            vector[index]++
        }
    }
}


func cosineSimilarity(vecA, vecB [72]float32) float32 {
    var dotProduct, normA, normB float32
    for i := range vecA {
        dotProduct += vecA[i] * vecB[i]
        normA += vecA[i] * vecA[i]
        normB += vecB[i] * vecB[i]
    }
    normA = float32(math.Sqrt(float64(normA)))
    normB = float32(math.Sqrt(float64(normB)))

    return (dotProduct / (normA * normB))*100
}

func timer(name string) func() {
    start := time.Now()
    return func() {
        fmt.Printf("%s took %v\n", name, time.Since(start))
    }
}

func main() {
    defer timer("main")()  
    imageFile1 := "../../img/beda1.png"
    imageFile2 := "../../img/beda2.png"
    img1, err := loadImage(imageFile1)
    img2, err := loadImage(imageFile2)
    if err != nil {
        fmt.Println("Error loading the image:", err)
        return
    }

    imgRGB1 := getNormalizedRGBValues(img1)
    imgRGB2 := getNormalizedRGBValues(img2)
	var imgHSV1 ImageHSV
	var imgHSV2 ImageHSV
    var vector1 [9][72]float32
    var vector2 [9][72]float32
	convertRGBToHSVValues(imgRGB1, &imgHSV1)
	convertRGBToHSVValues(imgRGB2, &imgHSV2)
    divideHSVMatrixTo9Vectors(imgHSV1, &vector1)
    divideHSVMatrixTo9Vectors(imgHSV2, &vector2)
    fmt.Printf("%.2f%%", 100*ArrayOfVectorCosineWeighting(vector1, vector2))
}

func ColorProcessing(img image.Image) [9][72]float32 {
    imgRGB :=getNormalizedRGBValues(img)
    var imgHSV ImageHSV
    var vector [9][72]float32
    convertRGBToHSVValues(imgRGB, &imgHSV)
    divideHSVMatrixTo9Vectors(imgHSV, &vector)

    return vector
}