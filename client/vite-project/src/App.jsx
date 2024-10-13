import React, { useState } from "react";
import "./app.css";

function App() {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [fetchedSingleFiles, setFetchedSingleFiles] = useState(null);
  const [fetchedFiles, setFetchedFiles] = useState(null);
  const [dogImageUrl, setDogImageUrl] = useState(null);
  const [dogImageBlob, setDogImageBlob] = useState(null);

  const handleSingleFileChange = (e) => setSingleFile(e.target.files[0]);

  const handleMultipleFilesChange = (e) => setMultipleFiles(e.target.files);

  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append("file", singleFile);
    try {
      const response = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading single file:", error);
    }
  };

  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("files", multipleFiles[i]);
    }
    try {
      const response = await fetch("http://localhost:8000/save/multiple", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
    }
  };

  const fetchSingleFile = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/single");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFetchedSingleFiles(url);
    } catch (error) {
      console.error("Error fetching single file:", error);
    }
  };

  const fetchMultipleFiles = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/multiple");
      const data = await response.json();
      const fileData = data.files.map((file) => ({
        filename: file.filename,
        url: `data:application/octet-stream;base64,${file.data}`,
      }));
      setFetchedFiles(fileData);
    } catch (error) {
      console.error("Error fetching multiple files:", error);
    }
  };

  const fetchRandomDogImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setDogImageUrl(data.message);

      const dogImageResponse = await fetch(data.message);
      const dogImageFile = await dogImageResponse.blob();
      setDogImageBlob(dogImageFile);
    } catch (error) {
      console.error("Error fetching dog image:", error);
    }
  };

  const submitDogImageToServer = async () => {
    if (!dogImageBlob) {
      alert("Please fetch a dog image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", dogImageBlob, "dogImage.jpg");

    try {
      const response = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert("Dog image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading dog image:", error);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: "20px" }}>
        <h1>File Upload and Fetch App</h1>

        <div className="file-upload-container">
          <h2>Upload Single File</h2>
          <input type="file" onChange={handleSingleFileChange} />
          <button onClick={uploadSingleFile}>Upload Single File</button>
        </div>

        <div className="file-upload-container">
          <h2>Upload Multiple Files</h2>
          <input type="file" multiple onChange={handleMultipleFilesChange} />
          <button onClick={uploadMultipleFiles}>Upload Multiple Files</button>
        </div>

        <div>
          <h2>Fetch Single File</h2>
          <div className="fetch-container">
            <button onClick={fetchSingleFile}>Fetch Single File</button>
            {fetchedSingleFiles && (
              <div>
                <h3>Single File</h3>
                <img src={fetchedSingleFiles} alt="Fetched Single" />
              </div>
            )}
          </div>
        </div>

        <div>
          <h2>Fetch Multiple Files</h2>
          <div className="fetch-container">
            <button onClick={fetchMultipleFiles}>Fetch Multiple Files</button>
            {fetchedFiles && (
              <div className="fetch-multiple-files">
                <h3>Multiple Files</h3>
                {fetchedFiles.map((file, index) => (
                  <div key={index}>
                    <p>{file.filename}</p>
                    <img src={file.url} alt={file.filename} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button onClick={fetchRandomDogImage}>Fetch Dog Image</button>
        {dogImageUrl && (
          <div>
            <img src={dogImageUrl} alt="Random Dog" />
            <button onClick={submitDogImageToServer}>Submit Dog Image</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
