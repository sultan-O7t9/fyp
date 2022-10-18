import { Box } from "@mui/system";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";
import jwt_decode from "jwt-decode";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Select from "../components/Select";
import Toast from "../components/Toast";
import TabsPanel from "./TabsPanel";
import { useRef } from "react";
import MailItem from "../components/MailItem";
import ImportFromExcel from "../components/ImportFromExcel";
import { USER_ID, USER_ROLE } from "../utils/keys";

const Deliverables = [
  {
    id: 1,
    title: "Project Proposal",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 2,
    title: "Documentation and 30% Code",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 3,
    title: "Working System",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
];
const to = [
  "18094198-079@uog.edu.pk",
  "18094198-089@uog.edu.pk",
  "18094198-099@uog.edu.pk",
  "18094198-109@uog.edu.pk",
  "18094198-119@uog.edu.pk",
  "18094198-129@uog.edu.pk",
  "18094198-139@uog.edu.pk",
  "18094198-149@uog.edu.pk",
  "18094198-159@uog.edu.pk",
  "18094198-169@uog.edu.pk",
  "18094198-179@uog.edu.pk",
];
const msg =
  "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.";
const sub = "Deliverable 3 Evaluation Schedule";
const SentMailItem = ({ mail }) => {
  const [showMail, setShowMail] = useState(false);
  return (
    <>
      {showMail ? <MailItem setDisplay={setShowMail} mail={mail} /> : null}

      <Button
        onClick={() => {
          setShowMail(true);
        }}
      >
        <Card
          style={{
            padding: "1rem",
            textAlign: "left",
            textTransform: "none",
            // marginBottom: "0.2rem",
            border: "1px solid #ccc",
          }}
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{
                textOverflow: "ellipsis",
                display: "flex",
                marginBottom: "0.5rem",
              }}
            >
              <Typography style={{ fontWeight: "bold", marginRight: "0.3rem" }}>
                To:{" "}
              </Typography>
              <Typography variant="body2" style={{ textOverflow: "ellipsis" }}>
                {mail.recipiants.join(", ").slice(mail.recipiants.length > 70)
                  ? mail.recipiants.join(", ").slice(0, 70) + " ..."
                  : mail.recipiants.join(", ")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                {new Date(mail.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box
            style={{
              textOverflow: "ellipsis",
              display: "flex",

              marginBottom: "0.5rem",
            }}
          >
            <Typography style={{ fontWeight: "bold", marginRight: "0.3rem" }}>
              Subject:{" "}
            </Typography>
            <Typography style={{ textOverflow: "ellipsis" }}>
              {mail.subject.length > 100
                ? mail.subject.slice(0, 100) + " ..."
                : mail.subject}
            </Typography>
          </Box>
          <Box style={{ textOverflow: "ellipsis" }}>
            <Typography style={{ textOverflow: "ellipsis", color: "#888" }}>
              {mail.body.length > 100
                ? mail.body.slice(0, 100) + " ..."
                : mail.body}
            </Typography>
          </Box>
        </Card>
      </Button>
    </>
  );
};

const Inputs = ({
  mailSubject,
  setMailSubject,
  mailMessage,
  setMailMessage,
}) => {
  return (
    <>
      <Box style={{ marginBottom: "1rem" }}>
        <Typography style={{ marginBottom: "0.5rem" }}>Mail Subject</Typography>
        <TextField
          // ref={subRef}
          onBlur={e => {
            console.log(e.target.value);
            setMailSubject(e.target.value);
          }}
          defaultValue={mailSubject}
          style={{ width: "100%" }}
          placeholder="Subject"
        />
      </Box>
      <Box style={{ marginBottom: "1rem" }}>
        <Typography style={{ marginBottom: "0.5rem" }}>Mail Body</Typography>
        <TextField
          // ref={msgRef}
          onBlur={e => {
            console.log(e.target.value);
            setMailMessage(e.target.value);
          }}
          defaultValue={mailMessage}
          style={{ width: "100%" }}
          placeholder="Message"
          multiline={true}
          minRows={4}
        />
        {/* <Typo
                      style={{ width: "100%", fontFamily: "sans-serif" }}
                      minRows={10}
                      // value={message}
                      placeholder="Message"
                      onBlur={e => {
                        setMessage(e.target.value);
                      }}
                      // onChange={e => {
                      //   setMessage(e.target.value);
                      // }}
                    /> */}
      </Box>
    </>
  );
};

const CommunicationPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");
  const [mails, setMails] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [importedMails, setImportedMails] = useState([]);

  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    localStorage.getItem(USER_ROLE).includes("PMO");
  console.log(isEligible);

  useEffect(() => {
    const getSemesters = async () => {
      try {
        const res = await axios.get("/api/sem/get-all-grp");
        setSemesters(res.data.semesters);
        setSelectedSemester(res.data.semesters.find(s => s.current).id);
      } catch (err) {
        console.log(err);
      }
    };
    getSemesters();
  }, []);
  useEffect(() => {
    setSelectedGroups([]);
    const ss = selectedSemester
      ? semesters.find(s => s.id == selectedSemester).groups
      : [];
    // console.log();
    setGroups(ss.concat([{ id: "all", name: "All" }]));
    setSelectedGroups(["all"]);
  }, [selectedSemester, semesters]);

  useEffect(() => {
    const getMails = async () => {
      try {
        const res = await axios.post("/api/sem/get-mails", {
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        setMails(res.data.mails);
      } catch (err) {
        console.log(err);
      }
    };
    getMails();
  }, [refresh]);

  const selectSemesterHandler = sem => {
    console.log(sem);
    setSelectedSemester(sem);
  };
  const selectGroupsHandler = sem => {
    console.log(sem);
    let ss = [];
    if (
      (sem.includes("all") && sem.length == 1) ||
      sem[sem.length - 1] == "all"
    )
      ss = ["all"];
    else {
      ss = sem.filter(s => s !== "all");
    }
    setSelectedGroups(ss);
  };

  const sendMailHandler = async () => {
    // if (!sub || !msg) {
    //   setToast(true);
    //   setTMsg("Subject and Message cannot be empty, Mail not Sent");
    //   return;
    // }
    const data = {
      subject: mailSubject,
      message: mailMessage,
      groups: selectedGroups.includes("all")
        ? semesters.find(s => s.id == selectedSemester).groups.map(g => g.id)
        : selectedGroups,
      semester: selectedSemester,
      mails: importedMails,
      userId: localStorage.getItem(USER_ID),
    };
    console.log(data);
    try {
      const res = await axios.post("/api/sem/send-mail", data);
      console.log(res.data.mail);
      if (res.data.mail) {
        setToast(true);
        setTMsg("Mail sent successfully");
        setRefresh(state => !state);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteMails = async () => {
    try {
      const res = await axios.post("/api/sem/send-mail", {
        userId: localStorage.getItem(USER_ID),
      });
      console.log(res.data.delete);

      setMails([]);
      setToast(true);
      setTMsg("Mails deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  if (!isEligible) return <Redirect to="/404" />;

  const importDataHandler = async importedData => {
    console.log(importedData);
    // return;

    setIsLoading(true);

    //ok
    //now find roll no and name is on which index
    const indexOfMail = importedData.heads.findIndex(item =>
      item.includes("ail")
    );
    console.log(importedData.data[0][indexOfMail]);

    // console.log(indexOfRoll, indexOfName);
    // //this will show us which column contains roll no and name
    // console.log(indexOfRoll, indexOfName);
    const dataHeads = [importedData.heads[indexOfMail]];
    const mails = importedData.data.map(item => item[indexOfMail]);
    console.log(mails);
    setImportedMails(mails);
  };

  return (
    <div>
      {toast ? <Toast open={toast} setOpen={setToast} message={tMsg} /> : null}
      <ContainerFluid title="Communication" maxWidth="xl">
        <TabsPanel
          Panel1={() => {
            return (
              <Main>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "1rem",
                    marginBottom: 0,
                  }}
                >
                  <ImportFromExcel
                    label="Import Mails"
                    importData={importDataHandler}
                    // disabled={body.length > 0}
                  />
                </Box>
                <Box
                  sx={{
                    padding: "3rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {importedMails.length > 0 ? (
                    <Box style={{ marginBottom: "1rem" }}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <Typography style={{ marginBottom: "1rem" }}>
                          Recipients
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => {
                            setImportedMails([]);
                          }}
                        >
                          Clear Imported Mails
                        </Button>
                      </Box>
                      <Typography
                        variant="body2"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        {importedMails.join(", ")}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box style={{ marginBottom: "1rem" }}>
                        <Typography style={{ marginBottom: "0.5rem" }}>
                          Select Semester
                        </Typography>
                        <Select
                          required
                          // style={{ width: "100%" }}

                          label="Semester"
                          value={selectedSemester}
                          setValue={selectSemesterHandler}
                          items={semesters.map(semester => ({
                            value: semester.id,
                            text: semester.current
                              ? semester.title + " (Current)"
                              : semester.title,
                            id: semester.id,
                          }))}
                        />
                      </Box>
                      <Box style={{ marginBottom: "1rem" }}>
                        <Typography style={{ marginBottom: "0.5rem" }}>
                          Select Groups
                        </Typography>
                        <Select
                          required
                          // style={{ width: "100%" }}

                          label="Groups"
                          multiple={true}
                          value={selectedGroups}
                          setValue={selectGroupsHandler}
                          items={
                            groups && groups.length
                              ? groups.map(group => ({
                                  value: group.id,
                                  text: group.name,
                                  id: group.id,
                                }))
                              : []
                          }
                        />
                      </Box>
                    </>
                  )}
                  <Inputs
                    mailSubject={mailSubject}
                    setMailSubject={setMailSubject}
                    mailMessage={mailMessage}
                    setMailMessage={setMailMessage}
                  />

                  <Box style={{ marginBottom: "2rem" }}>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={
                        !selectedGroups.length || !mailSubject || !mailMessage
                      }
                      style={{ display: "block" }}
                      onClick={() => {
                        sendMailHandler();
                      }}
                    >
                      Send Mail
                    </Button>
                  </Box>
                </Box>
              </Main>
            );
          }}
          Panel2={() => {
            return (
              <Main>
                <Box
                  style={{
                    padding: "3rem",
                    paddingBottom: "0",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button variatn="text" onClick={handleDeleteMails}>
                    Clear All
                  </Button>
                </Box>
                <Box
                  sx={{
                    padding: "3rem",
                    paddingTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {mails.length ? (
                    mails.map(mail => {
                      return <SentMailItem key={mail.id} mail={mail} />;
                    })
                  ) : (
                    <Typography>No mails</Typography>
                  )}
                </Box>
              </Main>
            );
          }}
        />
      </ContainerFluid>
      {/* )} */}
    </div>
  );
};

export default CommunicationPage;
