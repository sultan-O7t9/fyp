import {
  Backdrop,
  Box,
  Button,
  Container,
  Paper,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useState } from "react";
import Select from "./Select";
import UploadFile from "./UploadFile";
import UploadFileInput from "./UploadFileInput";
// import axios from "axios";
// import React, { useState } from "react";

const DeliverableSettingsModal = props => {
  const { deliverable, setDisplay, setToastMessage, setShowToast } = props;
  const [file, setFile] = useState({});
  const [name, setName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [deadlineInput, setDeadlineInput] = useState("");
  const [evaluationDate, setEvaluationDate] = useState("");
  const [evaluationInput, setEvaluationInput] = useState("");
  const [deliverableDeadline, setDeliverableDeadline] = useState(
    deliverable.deadline
  );
  const [emailBody, setEmailBody] = useState(deliverable.email.body);
  const [emailRecipients, setEmailRecipients] = useState();
  const [emailSubject, setEmailSubject] = useState(deliverable.email.subject);
  console.log(deliverable);

  useEffect(() => {
    let dd = null;
    if (deliverable.deadline) {
      const date = new Date(deliverable.deadline);
      const month = date.getMonth() + 1;
      dd = `${date.getFullYear()}-${
        month < 10 ? "0" + month : month
      }-${date.getDate()}`;
    }
    console.log(dd);
    setDeadlineInput(dd);
  }, [deliverable]);

  useEffect(() => {
    const dd = new Date(deadlineInput);
    const ed = new Date(evaluationInput);
    if (dd <= ed) return;

    setEvaluationDate("");
    setEvaluationInput("");
  }, [deadlineInput]);

  const handleDateChange = e => {
    console.log(e.target.value);
    const dd = new Date(e.target.value);
    if (dd < new Date()) return;
    else {
      setDeadlineInput(e.target.value);
      setDeliverableDeadline(dd);
    }
    console.log(e.target.value);
  };
  const handleEvalDateChange = e => {
    const dd = new Date(deadlineInput);
    const ed = new Date(e.target.value);
    if (ed <= dd || ed.getDay() === 6 || ed.getDay() === 0) return;

    setEvaluationInput(e.target.value);
    setEvaluationDate(ed);
    console.log(e.target.value);
  };

  const submitDeliverable = async e => {
    const data = {
      userId: localStorage.getItem("USER_ID"),
      deliverableId: deliverable.id,
      deadline: deliverableDeadline
        ? deliverableDeadline
        : deliverable.deadline,
      title: deliverable.title,
      email: {
        body: emailBody ? emailBody : deliverable.email.body,
        recipients: null,
        subject: emailSubject ? emailSubject : deliverable.email.subject,
      },
    };
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/deliverable/update-deliverable`,
        data
      );
      console.log(res.data);
      if (res.data.update) setDisplay(false);
      else alert("Error updating deliverable");
    } catch (err) {
      console.log(err);
    }
  };

  const uploadTemplateFile = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };
  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", deliverable.id);
    console.log(file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/template-file",
        data
      );
      console.log(res.data);
      if (res.data.upload) {
        setShowUploadModal(false);
        setToastMessage("Template uploaded successfully");
        setShowToast(true);
      }
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
        { deliverableId: deliverable.id }
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
      <Backdrop
        sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Container
          maxWidth="md"
          style={{ maxHeight: "60vh", overflowY: "scroll" }}
        >
          <Paper style={{ padding: "3.5rem 2rem" }}>
            <Box style={{ margin: "2rem 0.5rem", marginTop: "0rem" }}>
              <Typography variant="h4"> Settings</Typography>
              <Box style={{ margin: "2rem 0.5rem" }}>
                <Typography variant="h6">Deadline</Typography>
                <Box style={{ margin: "1rem" }}>
                  <TextField
                    style={{ width: "100%" }}
                    type="date"
                    //   label="Date&Time picker"
                    value={deadlineInput}
                    onChange={handleDateChange}
                  />
                </Box>
              </Box>
              {/* <Box style={{ margin: "2rem 0.5rem" }}>
                <Typography variant="h6">Template File</Typography>
                <Box>
                  <Typography variant="body1">
                    {deliverable.templateFile ? (
                      <a target={"_blank"} href={deliverable.templateFile}>
                        {deliverable.templateFile}
                      </a>
                    ) : (
                      "No template file uploaded"
                    )}
                  </Typography>
                  <Button variant="contained" onClick={uploadTemplateFile}>
                    Upload
                  </Button>
                </Box>
              </Box> */}
              <Box
                variant="outlined"
                style={{
                  margin: "1rem",
                  // padding: "1rem",
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
                  {deliverable.template ? (
                    <form onSubmit={downloadTemplateFile} className="form">
                      <Button variant="text" type="submit">
                        {deliverable.template}
                      </Button>
                    </form>
                  ) : file.name ? (
                    <form onSubmit={downloadTemplateFile} className="form">
                      <Button variant="text" type="submit">
                        {file.name}
                      </Button>
                    </form>
                  ) : (
                    <Typography variant="body">None</Typography>
                  )}
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={uploadTemplateFile}
                  >
                    Upload
                  </Button>
                </Box>
              </Box>

              <Box style={{ margin: "2rem 0.5rem" }}>
                <Typography variant="h6">Mail Settings</Typography>

                <Box style={{ margin: "1rem" }}>
                  <TextField
                    label="Subject"
                    value={emailSubject}
                    defaultValue={deliverable.email.subject}
                    onChange={e => setEmailSubject(e.target.value)}
                    placeholder="Email Subject"
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box style={{ margin: "1rem" }}>
                  <TextareaAutosize
                    maxRows={4}
                    aria-label="maximum height"
                    label="Message"
                    value={emailBody}
                    defaultValue={deliverable.email.body}
                    onChange={e => setEmailBody(e.target.value)}
                    placeholder="Email Body"
                    style={{ width: "100%", minHeight: "10vh" }}
                  />
                </Box>
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                margin: "2rem 0.5rem",
                marginBottom: 0,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={submitDeliverable}
                //   disabled={groups.length == 0 || evaluators.length == 0}
                //   onClick={manageCommitteeHandler}
              >
                Save
              </Button>
              <Button
                variant="contained"
                style={{ marginLeft: "2rem" }}
                color="error"
                onClick={() => setDisplay(false)}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Container>
      </Backdrop>
    </>
  );
};

export default DeliverableSettingsModal;
