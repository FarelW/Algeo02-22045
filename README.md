<h1 align="center">Tugas Besar 2 IF2121 Aljabar Linear dan Geometri</h1>
<h1 align="center">Kelompok 8 - JUN HOK 88</h3>
<h3 align="center"></p>
<h3 align="center">CONTENT-BASED INFORMATION RETRIEVAL (CBIR)</p>
<h3 align="center">Semester ganjil Tahun 2023/2024</p>

## Table of Contents

- [Overview](#overview)
- [Abstraction](#abstraction)
- [Built With](#built-with)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Features](#features)
- [File Structures](#file-structures)
- [About](#about)


## Overview

Our Team members :
- 13522045 - Elbert Chailes [@ChaiGans](https://github.com/ChaiGans)
- 13522047 - Farel Winalda [FarelW](https://github.com/FarelW)
- 13522111 - Ivan Hendrawan Tan [@Bodleh](https://github.com/Bodleh)

Our mentors:
- Dr. Ir. Rinaldi Munir, M.T.
- 13521031 - Fahrian Afdholi

Here is the purpose of making this project :
- To fulfill the requirements of the final assignment for the course IF2123 Linear Algebra and Geometry.
- To implement Euclidean vectors and cosine similarity in an _image retrieval system_, aimed at determining the similarity between two objects.
- To serve as a medium for the developer to delve into website development, encompassing the creation of algorithms and logic using the Go programming language.
- To contribute to technological advancement, particularly in the field of information retrieval.

## Abstraction

In this project, the realization of CBIR (Content-Based Image Retrieval) will feature two key components: color feature analysis and texture feature analysis. Additionally, several extended functionalities will enhance the user's experience with the program. These include the capability to upload images directly using a personal webcam and the option to insert datasets through web scraping methods (limited to websites that permit scraping access). Furthermore, the program offers a feature to export PDF reports detailing the results of CBIR analyses conducted with each method. These reports will be automatically downloaded to the user's local folder. As for performance, the program is designed to execute picture similarity calculations within a time range of 50-120 milliseconds per picture comparison.

### Built With
- [React](https://react.dev/)
- [GO Lang](https://go.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Fiber](https://docs.gofiber.io/)

## Prerequisites

If you want to run this project you will need to do some installation, such as :
- HTML 5 version
- Node.js
- npm (Package manager for the JavaScript programming language)
- GO Language version 18 or higher

## Installation

If you want to run this program you will need to do these steps

1. Clone this repository :
```shell
git clone https://github.com/FarelW/Algeo02-22045
```

2. Package Download :
```shell
npm install
```

3. Run on your localhost server :
```shell
npm run start
```

## Features

Here is the purpose of making this project :
* The program contains of menu options (SPL, Determinant, Inverse, Interpolation Polynomial,Bicubic Spline Interpolation, and Regression)
* The program can receive input either from the keyboard (terminal) or read input from text files.
* Step by step how to get the answer
* File output (file.txt)
* Each menu contains various problem solving methods
* Each function contains multiple error handling method to ensure greatest experience for the user.

## File Structures
```
.
│   go.mod
│   go.sum
│   index.css
│   index.js
│
├───api
│       main.go
│
├───components
│       FolderDropzone.js
│       Form.js
│       Header.js
│       MyDocument.js
│       ResultCard.js
│       Toast.js
│       UploadCard.js
│
├───pages
│       App.js
│       Application.js
│       Developers.js
│       Guides.js
│       Home.js
│       Technology.js
│
└───program
        color.go
        imagescraping.go
        texture.go
```

## About

Hello there, 
if you curious about our other project you can check our github by click the link below


- [@ChaiGans](https://github.com/ChaiGans)
- [@FarelW](https://github.com/FarelW)
- [@Bodleh](https://github.com/Bodleh)
