import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadCard from "./UploadCard";

function FolderDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    props.onFilesAdded(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", 
  });


  const currentState = props.currentState || [];

  return (
    <div
      {...getRootProps()}
      className="dropzone flex flex-wrap justify-center items-center border-white border-2 border-dashed rounded-xl w-full h-full space-x-2 space-y-2 overflow-y-scroll"
    >
      <input {...getInputProps()} />
      {currentState.length > 0 ? (
        currentState.map((file, index) => (
          <UploadCard key={index} filename={file.name} />
        ))
      ) : (
        <p>Drag & drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default FolderDropzone;
