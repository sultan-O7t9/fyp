import axios from "axios";
import React, { useState } from "react";

const UploadFile = () => {
  const [file, setFile] = useState({});
  const [name, setName] = useState("");

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/group/upload-file",
        data
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileInputChange = e => {
    const value = e.target.files[0];
    setFile(value);
    console.log(value);
  };

  const handleDownloadFile = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/group/download-file/",
        { name: name }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleSubmitFile} className="form">
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          value={file.hasOwnProperty("name") ? file.name : ""}
        />
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleDownloadFile} className="form">
        <input
          onChange={e => {
            setName(e.target.value);
          }}
          value={name}
        />
        <button type="submit">Download</button>
      </form>
      {/* {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )} */}
    </div>
  );
};

export default UploadFile;
