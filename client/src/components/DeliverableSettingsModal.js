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
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useState } from "react";
import Select from "./Select";
// import axios from "axios";
// import React, { useState } from "react";

const DeliverableSettingsModal = props => {
  const { deliverable, setDisplay } = props;
  const [deadlineInput, setDeadlineInput] = useState("");
  const [deliverableDeadline, setDeliverableDeadline] = useState(
    deliverable.deadline
  );
  const [emailBody, setEmailBody] = useState(deliverable.email.body);
  const [emailRecipients, setEmailRecipients] = useState();
  const [emailSubject, setEmailSubject] = useState(deliverable.email.subject);
  const handleDateChange = e => {
    const dd = new Date(e.target.value);
    if (dd < new Date()) return;
    else {
      setDeadlineInput(e.target.value);
      setDeliverableDeadline(dd);
    }
    console.log(e.target.value);
  };

  const submitDeliverable = async e => {
    const data = {
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
  return (
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
            <Box style={{ margin: "2rem 0.5rem" }}>
              <Typography variant="h6">Mail Settings</Typography>
              <Box style={{ margin: "1rem" }}>
                {/* <Select
                  required
                  // style={{ width: "100%" }}
                  multiple={true}
                  label="Recipients"
                  // value={groups}
                  // setValue={selectGroupsHandler}
                  // items={selectGroupItems}
                /> */}
              </Box>
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
  );
};

export default DeliverableSettingsModal;
