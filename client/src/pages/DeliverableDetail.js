import { useState } from "react";
import { Button, Card, TableCell, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import Select from "../components/Select";
import UploadFile from "../components/UploadFile";
import axios from "axios";

const DATA = {
  heads: [
    "Group ID",
    "Project Title",
    "Submission Date",
    "Verification Status",
    " ",
  ],
  data: [
    {
      id: "SE_18_1",
      title: "Project 1",
      submitted_on: new Date().toISOString(),
      status: "Verified",
    },
    {
      id: "SE_18_1",
      title: "Project 1",
      submitted_on: new Date().toISOString(),
      status: "Verified",
    },
    {
      id: "SE_18_1",
      title: "Project 1",
      submitted_on: new Date().toISOString(),
      status: "Verified",
    },
  ],
};

const DataHead = () => {
  return DATA.heads.map(head => <TableCell key={head}>{head}</TableCell>);
};

const DataBody = () => {
  const [filter, setFilter] = useState(null);
  const filters = [
    { text: "Submitted", id: 1 },
    { text: "Verified", id: 2 },
    { text: "Rejected", id: 3 },
    { text: "Revised", id: 4 },
  ];
  return (
    <>
      <TableRow>
        <TableCell>Filter</TableCell>
        <TableCell colSpan={4}>
          <Select
            label="Filter"
            value={filter}
            setValue={setFilter}
            items={filters}
          />
        </TableCell>
      </TableRow>
      {DATA.data.map((row, index) => (
        <TableRow key={index}>
          <TableCell>{row.id}</TableCell>
          {/* <TableCell>{row.members}</TableCell> */}
          <TableCell>{row.title}</TableCell>
          <TableCell>{row.submitted_on}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>
            <MenuButton />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const DeliverableDetail = () => {
  const [file, setFile] = useState({});
  const [name, setName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", 1);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/template-file",
        data
      );
      console.log(res.data);
      if (res.data.upload) setShowUploadModal(false);
      setName(res.data.file);
    } catch (err) {
      console.log(err);
    }
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

  const uploadTemplateFile = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };

  return (
    <>
      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}

      <ContainerFluid title="Deliverable 1">
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">Project Proposal</Typography>
              <Typography variant="subtitle1">
                Project Idea & Proposal
              </Typography>
            </Box>
            <Box>
              <Button variant="contained" color="primary">
                Settings
              </Button>
            </Box>
          </Box>
          <Card
            variant="outlined"
            style={{
              marginBottom: "2rem",
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">Template File</Typography>
              <Button variant="text">{name}</Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={uploadTemplateFile}
              >
                Upload
              </Button>
            </Box>
          </Card>
          <DataTable DataHead={DataHead} DataBody={DataBody} />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default DeliverableDetail;
