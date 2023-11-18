import React from "react";
import Toast from "../components/Toast";
import ResultCard from "../components/ResultCard";
import FolderDropzone from "../components/FolderDropzone";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { pdf } from "@react-pdf/renderer";
import { CiExport } from "react-icons/ci";
import MyDocument from "../components/MyDocument";
import { FaVideo, FaVideoSlash } from 'react-icons/fa';

const BATCH_SIZE = 100;

const Application = () => {
  const [dummyData, setDummyData] = React.useState([]);
  // data yang bisa diambil adalah imageFile dan dataset untuk dipass ke backend
  const [imageFile, setImageFile] = React.useState(null); //base64-encoded string
  const [selectedFiles, setSelectedFiles] = React.useState([]); // array of file
  const [fileName, setFileName] = React.useState(null); // just to print filename, igonre it for backend
  // isColor===true berarti pemrosesan dilakukan dengan metode Colors, sedangkan isColor===false pemrosesan dilakukan dengan metode Texture
  const [imageBase64, setImageBase64] = React.useState(null);
  const [isColor, setisColor] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [scrapUrl, setScrapUrl] = React.useState(null);
  const [second,setsecond] = React.useState(0);
  const [submitImage, setsubmitImage] = React.useState(null);

  const maxFileSize = 4 * 1024 * 1024 * 1024;
  const toggleSwitch = () => setisColor(!isColor);

  const handleFilesAdded = (newFiles) => {
    setSelectedFiles(newFiles);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const startTime = performance.now()
    if (scrapUrl) {
      handleSubmitScraping()
        .then(() => {
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000;
            setsecond(elapsedTime.toFixed(2));
            console.log(`Url submission completed in ${elapsedTime} seconds.`);
        })
        .catch((error) => {
            console.error("Error in single submission:", error);
        })
    } else {
      const promises = []

      for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
        const batch = selectedFiles.slice(i, i + BATCH_SIZE)
        promises.push(
        handleSubmitBatch(batch)
          .then(() => {
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000;
            setsecond(elapsedTime.toFixed(2));
            console.log(`Batch submissions completed in ${elapsedTime} seconds.`);
          })
          .catch((error) => {
            console.error("Error in batch submissions:", error);
          })
        );
      }
    }
    // Pake tiga ini buat di post ke backend ya ler
    // console.log(formData.get("proccesstype")); // Log the "proccesstype" value (true maka color processing, false maka texture)
    // console.log(formData.get("image")); // Log the "image" value (base-64 string)
    // console.log(formData.getAll("selectedFiles[]")); // Log array of selectedFiles
  };

  const handleSubmitScraping = async () => {
    if (!imageFile) {
      console.error("Image file is missing.");
      return;
    }
  
    const formData = new FormData();
    formData.append("Scrapurl", scrapUrl); // Make sure this matches the form field name expected by your Go server
    formData.append("imageFile", imageFile);
    formData.append("proccesstype", isColor ? "true" : "false"); // Convert boolean to string
  
    try {
      const response = await fetch('http://localhost:8080/api/scrape', { 
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setsubmitImage(data.imageFile.base64)

        const dataArray = (data.data).map((item, index) => ({
          fileName: index.toString(),
          ...item,
        }));

        setDummyData((prevData) => {
          const combinedData = [...prevData, ...dataArray];
          return combinedData.sort((a, b) => b.Similarity - a.Similarity);
        });
        console.log("Scraping response:", data);
      } else {
        console.error("Failed to scrape:", response.statusText);
      }
    } catch (error) {
      console.error("Error while sending API request:", error);
    }
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file && file.type.match("image.*") && file.size <= maxFileSize) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update the state immediately when the file is loaded
        setImageBase64(e.target.result);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  }

  const [toast, setToast] = React.useState({ message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmitBatch = async (batch) => {
    const formData = new FormData();
    batch.forEach((file) => formData.append("selectedFiles", file));    
    if (!scrapUrl) {
      formData.append("imageFile", imageFile);
      formData.append("proccesstype", isColor);
    }

    // Upload the batch
    try {
      let response;
      response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("data:",data)
        setsubmitImage(data.imageFile.base64)

        const dataArray = (data.data).map((item, index) => ({
          fileName: index.toString(), // You can use the index as a fileName or provide a meaningful name
          ...item,
        }));

        setDummyData((prevData) => {
          const combinedData = [...prevData, ...dataArray];
          return combinedData.sort((a, b) => b.Similarity - a.Similarity);
        });
      } else {
        console.error("Batch upload failed", response.status);
      }
      setScrapUrl(null);
      console.log(scrapUrl);
    } catch (error) {
      console.error("Error during batch upload:", error);
    }
  };

  const handleMultipleUploadChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const validImageExtensions = ["jpg", "jpeg", "png"];
      const selectedImages = [];
      let totalSize = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (validImageExtensions.includes(fileExtension)) {
          totalSize += file.size;
          if (totalSize <= maxFileSize) {
            selectedImages.push(file);
          } else {
            alert("The total size of the selected images exceeds the limit.");
            break;
          }
        } else {
          console.log(`Invalid file type: ${file.name}`);
        }
      }

      setSelectedFiles(selectedImages);

      if (selectedImages.length > 0) {
        console.log(`Uploaded ${selectedImages.length} images.`);
      }
    }
  };

  // Constants
  const itemsPerPage = 4;
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  // Handle page change
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = dummyData.slice(startIndex, endIndex);

  // Function to generate pagination range
  const getPaginationRange = (currentPage, totalPages) => {
    const delta = 2; 
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const generatePDFDocument = async () => {
    try {
      console.log(dummyData)
      const blob = await pdf(<MyDocument compareFile={submitImage} arrayItems={dummyData}/>).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "MatchLens Report.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);
  const paginationButtons = paginationRange.map((page, index) => {
    if (page === "...") {
      return <span key={index}>...</span>;
    } else {
      return (
        <div
          key={index}
          className={`cursor-pointer ${
            currentPage === page ? "text-blue-500" : ""
          }`}
          onClick={() => goToPage(page)}
        >
          {page}
        </div>
      );
    }
  });
  React.useEffect(() => {
    let timeout;

    if (toast.message) {
      timeout = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [toast.message]);

  React.useEffect(() => {
    if (selectedFiles.length !== 0) {
      showToast(`Uploaded ${selectedFiles.length} images.`, "success");
    }
  }, [selectedFiles]);

  const webcamRef = React.useRef(null);
  const [webcamActive, setWebcamActive] = React.useState(false);

  const captureFromWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject && webcamRef.current.videoWidth > 0) {
      const video = webcamRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      canvas.toBlob((blob) => {
        setImageBase64(URL.createObjectURL(blob));
        const capturedImageFile = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        setImageFile(capturedImageFile);
        setFileName("captured.jpg");
      }, 'image/jpeg');
    } else {
      console.log("Webcam not ready for capture.");
    }
  };

  const startWebcam = () => {
    if (webcamActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.log("Error accessing the webcam:", error);
        });
    }
  };

  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };


  React.useEffect(() => {
    startWebcam();

    const captureInterval = setInterval(() => {
      if (webcamActive) {
        captureFromWebcam();
      }
    }, 10000); // Capture every 10 seconds

    return () => {
      clearInterval(captureInterval);
      stopWebcam();
    };
  }, [webcamActive]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [scrapUrlInput, setScrapUrlInput] = React.useState("");

  const handleScrapUrlChange = (event) => {
    setScrapUrlInput(event.target.value);
  };

  const clearScrapUrl = () => {
      setScrapUrl(null);
      setScrapUrlInput("");
  };

  const openModal = () => {
      setIsModalOpen(true);
  };

  const closeModal = () => {
    setScrapUrl(scrapUrlInput)
    setIsModalOpen(false);
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <main className="flex-1 relative">
        <img
          src="jokerWallpaper.jpg"
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="bg-black bg-opacity-60 absolute inset-0"></div>
        <div className="relative z-[2] pt-32 flex items-start text-white flex-row px-6">
          {/* leftside */}
          <div className="w-[50%] px-8 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-row items-center justify-between px-0">
                <div className="flex-row flex items-center gap-x-5">
                  <button
                    type="button"
                    className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                    onClick={() => document.getElementById("imageFile").click()}
                  >
                    Insert an Image
                  </button>
                  <input
                    type="file"
                    id="imageFile"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {imageFile ? (
                    <p className="text-white font-aenoniklight text-[15px] text-center">
                      {fileName}
                    </p>
                  ) : (
                    <p className="text-white font-aenoniklight text-[15px] text-center">
                      No file read.
                    </p>
                  )}
                </div>
                <div>
                  <button
                    className="w-fit place-self-center flex items-center gap-x-2 border-2 px-2 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                    onClick={generatePDFDocument}
                    type="button"
                  >
                    <CiExport></CiExport>
                    Export to PDF
                  </button>
                </div>
              </div>

              <div className={`relative w-auto h-[300px] border-white border p-4`}>
                {imageBase64 && (
                    <img
                      src={imageBase64}
                      alt="Captured"
                      className="absolute top-0 left-0 w-full h-full object-contain mx-auto" // Set a fixed height for the preview
                    />
                  )}
                <button 
                  onClick={() => setWebcamActive(!webcamActive)}
                  className="absolute bg-gray-500 hover:bg-gray-600 p-3 rounded-full inline-flex items-center justify-center"
                  type="button">
                  {webcamActive ? <FaVideo /> : <FaVideoSlash />}
                </button>

                <div className="absolute bottom-0 left-0 m-4 border border-white p-1">
                  <video ref={webcamRef} autoPlay muted className="object-contain h-16"></video>
                </div>
                <div className="absolute right-4 bottom-4">
                  <div
                    className={`w-20 h-8 flex items-center border-white border bg-gray-300 rounded-full p-1 cursor-pointer ${
                      isColor ? "bg-red-600" : "bg-yellow-500"
                    }`}
                    onClick={toggleSwitch}
                  >
                    {isColor ? (
                      <p className="absolute text-white left-4 font-aenoniklight text-[12px]">
                        Color
                      </p>
                    ) : (
                      <p className="absolute text-black right-2 font-aenoniklight text-[12px]">
                        Texture
                      </p>
                    )}

                    <div
                      className={`bg-black w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                        isColor ? "translate-x-12" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4 items-center">
                <div className="flex flex-row justify-center items-center space-x-4">
                  <button
                    onClick={() => {
                      setDummyData([]);
                    }}
                    type="submit"
                    className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                  >
                    Search
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("getDataset").click()
                      }
                      className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                    >
                      Upload Dataset
                    </button>
                  </div>
                  <input
                    type="file"
                    id="getDataset"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleUploadChange}
                  ></input>
                  {/* dataset bakal dipass ke backend */}
                  {toast.message && (
                    <Toast message={toast.message} type={toast.type} />
                  )}
                  <button
                    type="button"
                    className=" text-white bg-red-500 border-2 font-aenonikbold px-3 border-black py-1 rounded-lg"
                    onClick={() => {
                      setSelectedFiles([]);
                      showToast("Dropzone has been cleared.", "errors");
                    }}
                  >
                    CLEAR ALL
                  </button>
                  <button
                    id="scrapbutton"
                    onClick={openModal}
                    type="button"
                    className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                  >
                    Image Scraping
                  </button>
                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                      <div className="bg-white p-8 rounded-lg shadow-lg">
                        <input
                            type="text"
                            placeholder="Enter URL for image scraping"
                            value={scrapUrlInput}
                            onChange={handleScrapUrlChange}
                            className="p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-lg"
                        />
                        <div className="flex justify-end space-x-4 mt-6">
                          <button
                              onClick={clearScrapUrl}
                              className="px-6 py-3 bg-red-500 text-white rounded-md text-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                              type="button"
                          >
                            Clear
                          </button>
                          <button
                              onClick={closeModal}
                              type="button"
                              className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    </div>
                )}
                </div>
                <div className="w-full h-[80px]">
                  <FolderDropzone
                    currentState={selectedFiles}
                    onFilesAdded={handleFilesAdded}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* rightside */}
          <div className="w-[50%] px-4 border-l-white border-l-2 ">
            <div className="flex flex-1 flex-col justify-center h-[500px] items-center font-aenonikregular text-[18px] gap-y-4">
            {submitImage && (<div className="border-white w-[150px] border-2 flex flex-col">
              <div className="border-white w-full order-2 h-[100px] border-b-1">
                <img
                  src={`data:image/jpeg;base64,${submitImage}`}
                  className="w-full h-full object-cover object-center"
                  alt="result"
                ></img>
              </div>
            </div>)}
              <p className="text-white">
                {(dummyData.length !== 0 || second !== 0) ? (
                  <>{dummyData.length} Results in {second} seconds</>
                ) : (
                  <>0 Results in 0 seconds</>
                )}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-6 justify-center">
                {itemsToDisplay
                .map((item, key) => {
                  const name = item.fileName;
                  const parts = name.split(".");
                  const extension = parts[parts.length - 1].toLowerCase();

                  return (
                    <ResultCard
                      key={key}
                      imageResult={item.base64}
                      similarity={item.Similarity}
                      imageFormat={extension}
                    />
                  );
                })}
              </div>
              {/* pagination */}
              <div className="mt-5 flex flex-row space-x-3 justify-center items-center">
                {dummyData.length !== 0 && (
                  <>
                    {currentPage !== 1 && (
                      <MdOutlineArrowBackIosNew
                        onClick={() => goToPage(currentPage - 1)}
                        className="cursor-pointer text-red-600"
                      />
                    )}
                    {paginationButtons}
                    {currentPage !== totalPages && (
                      <MdOutlineArrowForwardIos
                        onClick={() => goToPage(currentPage + 1)}
                        className="cursor-pointer text-red-600"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Application;