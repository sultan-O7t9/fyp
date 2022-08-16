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
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import DeliverableSettingsModal from "../components/DeliverableSettingsModal";

const DATA = {
  heads: ["Group ID", "Project Title", "Submitted On", "Submission"],
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
  const roles = localStorage.getItem("USER_ROLE");
  const [submissionsData, setSubmissionsData] = useState([]);
  const params = useParams();
  const deliverableId = params.id;
  // const [filter, setFilter] = useState(null);
  // const filters = [
  //   { text: "Submitted", id: 1 },
  //   { text: "Verified", id: 2 },
  //   { text: "Rejected", id: 3 },
  //   { text: "Revised", id: 4 },
  // ];
  const userId = localStorage.getItem("USER_ID");
  //Get all submissions of the deliverabale

  useEffect(() => {
    console.log(userId);
    console.log(deliverableId);
    const getSubmissions = async () => {
      try {
        let newData = [];
        if (roles.includes("PMO")) {
          const res = await axios.post(
            "http://localhost:5000/api/deliverable/get-grp-submission-dept",
            {
              deliverableId,
              userId,
            }
          );
          console.log(res.data);
          newData = res.data.submissions;
          // if (!roles.includes("PMO")) {
          //   newData = res.data.submissions.filter(submission => {
          //     return submission.supervisorId == userId;
          //   });
          // }
        }
        if (roles.includes("SUPERVISOR")) {
          const res = await axios.post(
            "http://localhost:5000/api/deliverable/get-grp-submission-sup",
            {
              deliverableId,
              userId,
            }
          );
          console.log(res.data);
          newData = res.data.submissions;
        }
        setSubmissionsData(newData);
      } catch (error) {
        console.log(error);
      }
    };
    getSubmissions();
  }, [userId, deliverableId, roles]);

  const downloadSubmission = async (e, file) => {
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

  const sendMailToStudents = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/send-mail",
        { deliverableId, userId }
      );
      console.log(res.data.get);
      if (res.data.get) {
        alert("Mail sent successfully");
      } else {
        alert("Mail not sent");
      }
    } catch (err) {
      console.log(err);
      alert("Error sending mail");
    }
  };

  return (
    <>
      <TableRow>
        <TableCell colSpan={3}>
          <Box>
            {/* <Button
              variant="contained"
              type="submit"
              onClick={sendMailToStudents}
            >
              Send Mail
            </Button> */}
          </Box>
        </TableCell>
      </TableRow>
      {submissionsData.map((row, index) => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          {/* <TableCell>{row.members}</TableCell> */}
          <TableCell>
            {row.project.hasOwnProperty("title") ? row.project.title : "None"}
          </TableCell>
          <TableCell>
            {row.submission.createdAt
              ? new Date(row.submission.createdAt).toLocaleString()
              : "-"}
          </TableCell>
          <TableCell>
            {row.hasOwnProperty("submission") && row.submission.name ? (
              <form
                onSubmit={e => {
                  downloadSubmission(e, row.submission.name);
                }}
                className="form"
              >
                <Button variant="text" type="submit">
                  {row.submission.name}
                </Button>
              </form>
            ) : (
              <Typography variant="body">None</Typography>
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const DeliverableDetail = props => {
  const roles = localStorage.getItem("USER_ROLE");
  const [file, setFile] = useState({});
  const [name, setName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // const history=useHistory();
  const params = useParams();
  const deliverableId = params.id;

  useEffect(() => {
    const getDeliverableData = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/deliverable/get/${deliverableId}`
      );
      console.log(response.data);
      setDeliverableData(response.data.deliverable);
    };
    getDeliverableData();
  }, [deliverableId, showUploadModal, showSettingsModal]);

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", deliverableId);

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

  const downloadTemplateFile = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/get-template-file",
        { deliverableId: deliverableId }
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

  const uploadTemplateFile = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
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
      {showSettingsModal ? (
        <DeliverableSettingsModal
          deliverable={deliverableData}
          setDisplay={setShowSettingsModal}
        />
      ) : null}

      <ContainerFluid>
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">{deliverableData.title}</Typography>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Deadline:{" "}
                  {deliverableData.deadline
                    ? new Date(deliverableData.deadline).toLocaleDateString()
                    : "None"}
                  {/* {deliverableData.deadline} */}
                </Typography>
                {/* <Typography variant="body">
                  {" ( "}
                  {deliverableData.deadline
                    ? new Date(
                        new Date(deliverableData.deadline) - new Date()
                      ).getDay()
                    : ""}
                  {")"}
                </Typography> */}
              </Box>
            </Box>
            <Box>
              {roles.includes("PMO") ? (
                <Button
                  variant="contained"
                  onClick={handleSettings}
                  color="primary"
                >
                  Settings
                </Button>
              ) : null}
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
              {/* <Button variant="text" onClick={downloadTemplateFile}>
                {name}
              </Button> */}
              {deliverableData.template ? (
                <form onSubmit={downloadTemplateFile} className="form">
                  <Button variant="text" type="submit">
                    {deliverableData.template}
                  </Button>
                </form>
              ) : (
                <Typography variant="body">None</Typography>
              )}
            </Box>
            <Box>
              {roles.includes("PMO") ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={uploadTemplateFile}
                >
                  Upload
                </Button>
              ) : null}
            </Box>
          </Card>
          <DataTable DataHead={DataHead} DataBody={DataBody} />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default DeliverableDetail;
