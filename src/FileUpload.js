import React, { useState } from "react";
import Header from "./Header";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (event) => {
    const uploadedFiles = event.target.files;
    for (let file of uploadedFiles) {
      const formData = new FormData();
      formData.append("image_file", file);

      try {
        const response = await fetch("http://127.0.0.1:8000/image_upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.Success) {
          setFiles((prevFiles) => [
            ...prevFiles,
            { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} mb`, status: "uploaded" },
          ]);
          setMessage("File uploaded successfully!");
        } else if (result.Error) {
          setMessage(result.Error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessage("Failed to upload the file.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-800">
      <Header showNav={true} />
      <div className="bg-blue-900 p-8 rounded-lg text-white w-96">
        <h1 className="text-2xl font-bold mb-4">Upload Your Images</h1>
        <div className="border-2 border-dashed border-white rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-sm">
              Drag and drop or{" "}
              <span className="text-blue-300 underline">browse</span>
            </div>
          </label>
        </div>
        <div
          className="mt-4 max-h-40 overflow-y-auto bg-blue-700 rounded-lg p-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "gray" }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-blue-800 rounded-lg p-2 mb-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-md"></div>
                <div className="max-w-xs">
                  {/* Truncate and wrap file name */}
                  <p className="font-semibold truncate break-words">
                    {file.name}
                  </p>
                  <p className="text-sm text-blue-300">{file.size}</p>
                </div>
              </div>
              <div className="text-green-400 font-bold self-start">✔</div>
            </div>
          ))}
        </div>
        {message && (
          <div
            className={`mt-4 p-2 rounded-lg ${
              message === "File uploaded successfully!"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default FileUpload;
