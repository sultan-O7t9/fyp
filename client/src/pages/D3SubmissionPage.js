import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Switch,
  Table,
  TableCell,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UploadFile from "../components/UploadFile";
import Toast from "../components/Toast";

const DataHead = () => null;

const DataBody = () => {
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();

  const [deliverableData, setDeliverableData] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState({ name: "" });
  const [submissionData, setSubmissionData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const deliverableRes = await axios.post(
          "http://localhost:5000/api/deliverable/get-grp-submission",
          {
            deliverableId: 3,
            groupId: localStorage.getItem("USER_ID"),
          }
        );
        console.log(deliverableRes.data.deliverable);
        if (deliverableRes.data.get)
          setSubmissionData(deliverableRes.data.versions.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [showUploadModal, showToast]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/deliverable/get/3"
        );
        console.log(res.data.deliverable);
        setDeliverableData(res.data.deliverable);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [showUploadModal]);

  const downloadTemplateFile = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/get-template-file",
        { deliverableId: 3 }
      );
      console.log(res.data);
      let url = "http://localhost:5000/" + res.data.file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const submitProposal = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", 3);
    data.append("groupId", localStorage.getItem("USER_ID"));
    data.append("projectId", localStorage.getItem("PROJECT_ID"));
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/submit-grp-submission",
        data
      );
      console.log("file:", res.data);
      if (res.data.upload) setShowUploadModal(false);
      setFile({ name: "" });
      // setName(res.data.file);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadVersionFile = async (e, file) => {
    e.preventDefault();
    try {
      let url = "http://localhost:5000/" + file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteVersion = async file => {
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/deliverable/del-grp-submission/" + file
      );
      if (res.data.delete) {
        setShowToast(true);
        setToastMessage(file + " deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}
      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}

      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h4">{deliverableData.title}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Deadline</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">
            {deliverableData.deadline
              ? new Date(deliverableData.deadline).toUTCString()
              : "None"}
          </Typography>
        </TableCell>
      </TableRow>
      {deliverableData.template ? (
        <TableRow>
          <TableCell>
            <Typography variant="h6">Template</Typography>
          </TableCell>
          <TableCell>
            <form onSubmit={downloadTemplateFile} className="form">
              <Button variant="text" type="submit">
                {deliverableData.template}
              </Button>
            </form>
          </TableCell>
        </TableRow>
      ) : null}
      {deliverableData.template && deliverableData.deadline ? (
        <TableRow>
          <TableCell>
            {submissionData.length > 0 ? (
              <form
                onSubmit={e => {
                  downloadVersionFile(e, submissionData[0].name);
                }}
                className="form"
              >
                <Button variant="text" type="submit">
                  {submissionData[0].name}
                </Button>
              </form>
            ) : (
              <Typography variant="body">No submission</Typography>
            )}
          </TableCell>
          <TableCell>
            <Button
              color="primary"
              variant="contained"
              onClick={submitProposal}
            >
              Upload Deliverable
            </Button>
          </TableCell>
        </TableRow>
      ) : null}
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Version History</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          {submissionData.length > 0 ? (
            <ul>
              {submissionData.map((submission, index) => (
                <li key={index}>
                  <form
                    onSubmit={e => {
                      downloadVersionFile(e, submission.name);
                    }}
                    className="form"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button variant="text" type="submit">
                        {submission.name}
                      </Button>
                      <IconButton
                        onClick={() => {
                          console.log("deleting " + submission.name);
                          deleteVersion(submission.name);
                        }}
                        color="error"
                        variant="outlined"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body">No submissions</Typography>
          )}
          {/* <DataTable>
            {submissionData.length > 0 ? (
              submissionData.map((submission, index) => (
                <TableRow key={index}>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="body">No submissions</Typography>
                </TableCell>
              </TableRow>
            )}
          </DataTable> */}
        </TableCell>
      </TableRow>
    </>
  );
};

const D3SubmissionPage = () => {
  const groupName = localStorage.getItem("GROUP_NAME");
  return (
    <ContainerFluid title={groupName}>
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Box>
            <Typography variant="h3">SE_18_1 Proposal</Typography>
          </Box> */}
          {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
        </Box>

        <DataTable DataHead={DataHead} DataBody={DataBody} />
      </Main>
    </ContainerFluid>
  );
};

export default D3SubmissionPage;
