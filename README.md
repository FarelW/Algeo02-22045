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
- [File Structures Overview](#file-structures-overview)
- [Links](#links)


## Overview

Our Team members :
- 13522045 - Elbert Chailes
- 13522047 - Farel Winalda
- 13522111 - Ivan Hendrawan Tan

Our Guide Assitant : Fahrian Afdholi (13521031)
Our Lecturer: Dr. Ir. Rinaldi Munir, M.T.

Here is the purpose of making this project :
- To fulfill the requirements of the final assignment for the course IF2123 Linear Algebra and Geometry.
- To implement Euclidean vectors and cosine similarity in an _image retrieval system_, aimed at determining the similarity between two objects.
- To serve as a medium for the developer to delve into website development, encompassing the creation of algorithms and logic using the Go programming language.
- To contribute to technological advancement, particularly in the field of information retrieval.

## Abstraction

In this project, the realization of CBIR (_Content-Based Image Retrieval_) will feature two key components: **color feature analysis** and **texture feature analysis**. Additionally, several extended functionalities will enhance the user's experience with the program. These include the capability to upload images directly using a **personal webcam** and the option to insert datasets through **web scraping methods** (limited to websites that permit scraping access). Furthermore, the program offers a feature to **export PDF reports** detailing the results of CBIR analyses conducted with each method. These reports will be automatically downloaded to the user's local folder. As for performance, the program is designed to execute picture similarity calculations within a time range of `50-120 milliseconds` per picture comparison.

## Built With

- [React](https://react.dev/)
- [GO Lang](https://go.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Fiber](https://docs.gofiber.io/)

## Prerequisites

To run this project, you will need to perform several installations, including:
- `HTML5` : This is the markup language used for structuring the content of web pages. It's a fundamental part of web development and is typically assumed to be available in web development environments.
- `Node.js` : Node.js is essential for running JavaScript on the server-side and for managing JavaScript-based build processes, including those used in React applications.
- `npm` (Node package manager) : npm is indeed the package manager for JavaScript and is used to install and manage JavaScript packages and libraries, including those required for React development.
- `Go language version 1.18 or higher` : This is necessary if your project involves server-side development using the Go programming language. Go is used for building the backend of web applications.

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
- `Toggle Button`: This feature enables users to choose between image retrieval methods, either by color or texture, giving them the flexibility to decide the search method they prefer.
- `Dropzone Feature`: The Dropzone feature simplifies the process of uploading large-sized image collections. Users can conveniently drop an entire folder into the Dropzone, allowing the web application to read and process multiple images simultaneously.
- `Batch Uploading`: This functionality allows users to upload a substantial number of pictures, extending beyond the usual limit. Users can upload folders containing over 999 images, making it possible to handle batch uploads of 4000+ images in a single operation.
- `CBIR Color Feature`: This feature calculates the similarity between two images using the color joint histogram method. For more information, refer to this source: Link to Source.
- `CBIR Texture Feature`: This feature measures image similarity using the texture method, incorporating the occurrence matrix method. You can find further details in this source: Link to Source.
- `Webcam Feature`: Users have the option to utilize their webcam to capture live images of themselves. Images are captured at 10-second intervals when the camera is active. Users can choose whether or not to use this feature.
- `Image Scraping Feature`: This feature allows users to scrape images from websites they specify. Please note that this feature may not be perfect, as certain websites may still block access to image scraping, and some images may not be accessible through web scraping.
- `Export PDF Feature`: Users can download a report summarizing the results of their search queries. This feature facilitates easy viewing and analysis of the executed search results and serves as documentation for the outcomes.

## File Structures Overview
```
Algeo02-22045
│   .gitattributes
│   .gitignore
│   package-lock.json
│   package.json
│   README.md
│   tailwind.config.js
│
├───doc
│
├───img
│
├───public
│   │   backgroundCamera.jpg
│   │   modalBackgroundType4.png
│   │   react.png
│   │   tailwind.png
│   │
│   └───fonts
│
├───src
│   │   go.mod
│   │   go.sum
│   │   index.css
│   │   index.js
│   │
│   ├───api
│   │       main.go
│   │
│   ├───components
│   │       FolderDropzone.js
│   │       Form.js
│   │       Header.js
│   │       MyDocument.js
│   │       ResultCard.js
│   │       Toast.js
│   │       UploadCard.js
│   │
│   ├───pages
│   │       App.js
│   │       Application.js
│   │       Developers.js
│   │       Guides.js
│   │       Home.js
│   │       Technology.js
│   │
│   └───program
│           color.go
│           imagescraping.go
│           texture.go
│
└───test
        kodoksad.jpg
```

This repository contains main folder structure such as _doc_, _img_, _src_, and _test_.
- `doc`: This folder contains documents that provide accountability for the development of this website, as part of a major assignment. In other words, the "doc" folder will contain reports created for this project.
- `img`: The "img" folder houses images used for local testing purposes, related to the efficiency and output results of the program's similarity analysis. This folder comprises datasets and sample images that can be utilized for low-fidelity testing of the website's functionality.
- `src`: The "src" folder contains the primary codebase for building this website, consisting of Go and JavaScript programming languages. Here's a breakdown of the contents:
   - `go.mod` and `go.sum`: These files contain essential project configurations and the modules used in this project. They play a crucial role in dependency management.
   - `index.css` and `index.js`: These files form the foundation for developing the React JS application, centralizing programming and website appearance. The same principle applies to "index.css" for styling purposes.
   - `api`: The "api" folder includes files for creating the Application Programming Interface (API), which serves as a communication medium between the frontend and backend. Here's a detailed breakdown:
     - `main.go`: This code is responsible for creating the API and handling all backend-related features. To run the website's backend, you need to compile this code and then execute it on the specified port.
   - `components`: The "components" folder houses small components used to build the frontend user interface of the website.
   - `pages`: In the "pages" folder, you'll find program code for the website's page views. This includes all the pages that will be displayed and serves as the routing hub to connect all website components when running the React app.
   - `program`: The "program" folder contains Go programming code related to the color and texture implementation of the Content-Based Image Retrieval (CBIR) algorithm, as well as the algorithm for image scraping. These are combined into a single package called "program," which is used in the "main.go" code to run the website's logic on the backend.
- `test`: The "test" folder contains the results of similarity testing conducted on the website application. The files in this folder are in PDF format, each containing a report on the testing results.

## Links
- Repository : https://github.com/FarelW/Algeo02-22045/
- Issue tracker :
   - If you encounter any issues with the program, come across any disruptive bugs, or have any suggestions for improvement, please don't hesitate to reach out by sending an email to elbertchailes888@gmail.com. Your feedback is greatly appreciated.
- Github main contributor :
   - Contributor 1 (Elbert Chailes) - https://github.com/ChaiGans
   - Contributor 2 (Farel Winalda) - https://github.com/FarelW
   - Contributor 3 (Ivan Hendrawan Tan) - https://github.com/Bodleh
   - Guide Assistant (Fahrian Afdholi) - 
