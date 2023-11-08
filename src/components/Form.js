import React, { useState } from "react";

const Form =() => {
    const [imageFile, setImageFile] = useState(null);
    const [zipFile, setZipFile] = useState(null);
    const [uploadedData, setUploadedData] = useState({});

    const maxFileSize = 2 * 1024 * 1024 * 1024;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fileType = e.target.name;

        if (fileType === 'imageFile' && file && file.type.match('image.*')) {
            // Check if the image file size is within the allowed limit
            if (file.size <= maxFileSize) {
                setImageFile(file);
            } else {
                alert(`Image file size exceeds the allowed limit (${maxFileSize / (1024 * 1024 * 1024)}GB).`);
            }
        } else if (fileType === 'zipFile' && file && (file.type === 'application/zip' || file.type === 'application/x-zip-compressed')) {
            // Check if the ZIP file size is within the allowed limit
            if (file.size <= maxFileSize) {
                setZipFile(file);
            } else {
                alert(`ZIP file size exceeds the allowed limit (${maxFileSize / (1024 * 1024 * 1024)}GB).`);
            }
        } else {
            alert(`Please upload a valid ${fileType} file.`);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile || !zipFile) {
            alert('Please select both an image file and a ZIP file.');
            return;
        }

        const formData = new FormData();
        formData.append("imageFile", imageFile);
        formData.append("zipFile", zipFile);

        try {
            const response = await fetch("http://localhost:8080/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedData(data); // Store the response data
                console.log("Files uploaded successfully", data);
            } else {
                console.error("File upload failed, server responded with status: ", response.status);
            }
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    }

    return (
        <div>
            <h2>Simple Form</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center p-4">
                <input 
                    type="file"
                    name="imageFile"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    className="mb-3 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-transparent"
                />
                <input 
                    type="file"
                    name="zipFile"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="mb-3 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-transparent"
                />
                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Upload
                </button>
            </form>
            {/* {uploadedImagePath && <img src={uploadedImagePath} alt="Processed" />} */}
            <div>
                {Object.entries(uploadedData).map(([fileName, base64String]) => (
                    <div key={fileName}>
                        <p>{fileName}</p>
                        <img src={`data:image/png;base64,${base64String}`} alt={`Uploaded ${fileName}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Form;
