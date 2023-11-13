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

const BATCH_SIZE = 100;

const Application = () => {
  const [dummyData, setDummyData] = React.useState([]);
  console.log(dummyData);
  // data yang bisa diambil adalah imageFile dan dataset untuk dipass ke backend
  const [imageFile, setImageFile] = React.useState(null); //base64-encoded string
  const [selectedFiles, setSelectedFiles] = React.useState([]); // array of file
  const [fileName, setFileName] = React.useState(null); // just to print filename, igonre it for backend
  // isColor===true berarti pemrosesan dilakukan dengan metode Colors, sedangkan isColor===false pemrosesan dilakukan dengan metode Texture
  const [imageBase64, setImageBase64] = React.useState(null);
  const [isColor, setisColor] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [scrapUrl, setScrapUrl] = React.useState("");

  const maxFileSize = 4 * 1024 * 1024 * 1024;
  const toggleSwitch = () => setisColor(!isColor);

  const handleFilesAdded = (newFiles) => {
    setSelectedFiles(newFiles);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // if (!imageFile || selectedFiles.length === 0) {
    //   alert("Please select both an image file and dataset files.");
    //   return;
    // }

    for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
      const batch = selectedFiles.slice(i, i + BATCH_SIZE);
      handleSubmitBatch(batch);
    }

    // Pake tiga ini buat di post ke backend ya ler
    // console.log(formData.get("proccesstype")); // Log the "proccesstype" value (true maka color processing, false maka texture)
    // console.log(formData.get("image")); // Log the "image" value (base-64 string)
    // console.log(formData.getAll("selectedFiles[]")); // Log array of selectedFiles
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

    formData.append("imageFile", imageFile);
    formData.append("proccesstype", isColor);
    console.log(isColor);

    // Upload the batch
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const dataArray = Object.keys(data).map((key) => {
          return {
            fileName: key,
            ...data[key],
          };
        });

        setDummyData((prevData) => [...prevData, ...dataArray]);
      } else {
        console.error("Batch upload failed", response.status);
      }
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
        // Handle successful image upload here if needed.
        console.log(`Uploaded ${selectedImages.length} images.`);
      }
    }
  };

  const handleScrapButtonClick = () => {
    const answer = prompt("What is the website url that you gonna scrap?");
    if (answer !== null) {
      setScrapUrl(answer);
    } else {
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
      const blob = await pdf(<MyDocument arrayItems={dummyData}/>).toBlob();
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
                  >
                    <CiExport></CiExport>
                    Export to PDF
                  </button>
                </div>
              </div>

              <div
                className={`relative w-auto max-h-[300px] ${
                  imageFile ? "" : "min-h-[300px]"
                } border-white border`}
              >
                {imageBase64 && (
                  <img
                    src={imageBase64}
                    alt="Uploaded"
                    className="max-h-[298px] mx-auto"
                  />
                )}
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

                    {/* {dataset ? (
                      <button
                        onClick={() => {
                          setDataSetFilename(null);
                          setDataset(null);
                        }}
                        className="w-5 h-5 rounded-full flex justify-center items-center bg-red-800 absolute right-[-7px] top-[-7px] font-aenonikbold"
                      >
                        X
                      </button>
                    ) : (
                      ""
                    )} */}
                  </div>
                  {/* {dataset ? (
                    <p className="text-white font-aenoniklight">
                      {dataSetFilename}
                    </p>
                  ) : (
                    <p className="text-white font-aenoniklight">
                      No dataset uploaded.
                    </p>
                  )} */}

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
                    onClick={handleScrapButtonClick}
                    className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                  >
                    Image Scraping
                  </button>
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
              <p className="text-white">
                {dummyData.length !== 0 ? (
                  <>{dummyData.length} Results in 0.57 seconds</>
                ) : (
                  <>0 Results in 0.57 seconds</>
                )}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-6 justify-center">
                {itemsToDisplay.map((item, key) => {
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