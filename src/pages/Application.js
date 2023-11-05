import React from "react";
import Toast from "../components/Toast";
import ResultCard from "../components/ResultCard";

const Application = () => {
    // data yang bisa diambil adalah imageFile dan dataset untuk dipass ke backend
    const [image, setImage] = React.useState(null);
    const [imageFile, setImageFile] = React.useState(null); 
    const [dataset, setDataset] = React.useState(null);
    const [fileName, setFileName] = React.useState(null);
    // isOn===true berarti pemrosesan dilakukan dengan metode Colors, sedangkan isOn===false pemrosesan dilakukan dengan metode Texture
      const [isOn, setIsOn] = React.useState(true);

      const toggleSwitch = () => setIsOn(!isOn);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
            setFileName(file.name);
            setImageFile(file);
        };
        reader.readAsDataURL(file);
        }
    }

  const [toast, setToast] = React.useState({ message: "", type: "" });

  const handleZipChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension === "zip") {
        setDataset(file);
        setToast({ message: "Dataset uploaded successfully!", type: "success" });
      } else {
        setToast({ message: "Only ZIP files are allowed!", type: "error" });
      }
    }
  };
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
            <div className="w-[50%] px-8 gap-y-4 flex flex-col">
              <button
                className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                onClick={() => document.getElementById("getFile").click()}
              >
                Insert an Image
              </button>
              <input
                type="file"
                id="getFile"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {image ? (
                <p className="text-white font-aenoniklight text-[15px] text-center">
                  {fileName}
                </p>
              ) : (
                <p className="text-white font-aenoniklight text-[15px] text-center">
                  No file read.
                </p>
              )}
              <div
                className={`relative w-auto max-h-[360px] ${
                  image ? "" : "min-h-[360px]"
                } border-white border`}
              >
                {image && (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="max-h-[360px] mx-auto"
                  />
                )}
                <div className="absolute right-4 bottom-4">
                  <div
                    className={`w-20 h-8 flex items-center border-white border bg-gray-300 rounded-full p-1 cursor-pointer ${
                      isOn ? "bg-red-600" : "bg-yellow-500"
                    }`}
                    onClick={toggleSwitch}
                  >
                    {isOn ? (
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
                        isOn ? "translate-x-12" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-7 justify-center">
                <button className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300">
                  Search
                </button>
                <button
                  onClick={() => document.getElementById("getDataset").click()}
                  className="w-fit place-self-center flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-slate-600 hover:border-black hover:text-white transition-all duration-300"
                >
                  Upload Dataset
                </button>
                <input
                  type="file"
                  id="getDataset"
                  className="hidden"
                  accept=".zip"
                  onChange={handleZipChange}
                ></input>
                {/* dataset bakal dipass ke backend */}
                {toast.message && (
                  <Toast message={toast.message} type={toast.type} />
                )}
              </div>
            </div>

            {/* rightside */}
            <div className="w-[50%] px-4 border-l-white border-l-2 ">
              <div className="flex flex-1 flex-col justify-center h-[500px] items-center font-aenonikregular text-[18px] gap-y-4">
                <p className="text-white">54 Results in 0.57 seconds</p>
                <div className="flex flex-wrap gap-x-5 gap-y-6 justify-center">
                  <ResultCard imageResult="modalBackgroundType4.png" similarity="10"></ResultCard>
                  <ResultCard imageResult="modalBackgroundType4.png" similarity="20"></ResultCard>
                  <ResultCard imageResult="modalBackgroundType4.png" similarity="30"></ResultCard>
                  <ResultCard imageResult="modalBackgroundType4.png" similarity="40"></ResultCard>
                </div>
                {/* pagination */}
                <div className="mt-5">
                  ________________
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}

export default Application;