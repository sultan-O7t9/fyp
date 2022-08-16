import {
  Backdrop,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
// import axios from "axios";
// import React, { useState } from "react";

const UploadFile = props => {
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const { handleSubmitFile, setDisplay, setFile, file } = props;

  const handleFileInputChange = e => {
    const value = e.target.files[0];
    setFile(value);
    // setName(value.name);
    console.log(value);
  };

  // const handleDownloadFile = async e => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/group/download-file/",
  //       { name: name }
  //     );
  //     console.log(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container
        maxWidth="md"
        style={{ maxHeight: "80vh", overflowY: "scroll" }}
      >
        <Paper style={{ padding: "3.5rem 2rem" }}>
          <Box style={{ margin: "2rem 0.5rem", marginTop: "0rem" }}>
            <div>
              <Typography variant="h4">Upload File</Typography>
              <form
                onSubmit={e => {
                  handleSubmitFile(e);
                }}
                className="form"
              >
                <div style={{ margin: "1rem 0" }}>
                  {!file.name ? (
                    <input
                      id="fileInput"
                      type="file"
                      onChange={handleFileInputChange}
                    />
                  ) : (
                    <Typography variant="body1">{file.name}</Typography>
                  )}
                </div>

                <Button
                  variant="contained"
                  style={{ marginRight: "1rem" }}
                  type="submit"
                  disabled={!file.name}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setDisplay(false);
                  }}
                >
                  Cancel
                </Button>
              </form>
              {/* <form onSubmit={handleDownloadFile} className="form">
        <input
          onChange={e => {
            setName(e.target.value);
          }}
          value={name}
        />
        <button type="submit">Download</button> 
      </form> */}
              {/* {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )} */}
            </div>
          </Box>
        </Paper>
      </Container>
    </Backdrop>
  );
};

export default UploadFile;
