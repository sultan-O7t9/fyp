import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";
import jwt_decode from "jwt-decode";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { Button, TextareaAutosize, TextField, Typography } from "@mui/material";
import Select from "../components/Select";
import Toast from "../components/Toast";

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
const CommunicationPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");

  useEffect(() => {
    const getSemesters = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/sem/get-all-grp"
        );
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
    const data = {
      subject,
      message,
      groups: selectedGroups.includes("all")
        ? semesters.find(s => s.id == selectedSemester).groups.map(g => g.id)
        : selectedGroups,
      semester: selectedSemester,
      userId: localStorage.getItem("USER_ID"),
    };
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/sem/send-mail",
        data
      );
      console.log(res.data.mail);
      if (res.data.mail) {
        setToast(true);
        setTMsg("Mail sent successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {toast ? <Toast open={toast} setOpen={setToast} message={tMsg} /> : null}
      <ContainerFluid title="Communication">
        <Main>
          <Box
            sx={{
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
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
            <Box style={{ marginBottom: "1rem" }}>
              <Typography style={{ marginBottom: "0.5rem" }}>
                Mail Subject
              </Typography>
              <TextField
                style={{ width: "100%" }}
                value={subject}
                placeholder="Subject"
                onChange={e => {
                  setSubject(e.target.value);
                }}
              />
            </Box>
            <Box style={{ marginBottom: "1rem" }}>
              <Typography style={{ marginBottom: "0.5rem" }}>
                Mail Body
              </Typography>
              <TextareaAutosize
                style={{ width: "100%", fontFamily: "sans-serif" }}
                minRows={10}
                value={message}
                placeholder="Message"
                onChange={e => {
                  setMessage(e.target.value);
                }}
              />
            </Box>
            <Box style={{ marginBottom: "2rem" }}>
              <Button
                variant="contained"
                size="large"
                disabled={!selectedGroups.length || !subject || !message}
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
      </ContainerFluid>
      {/* )} */}
    </div>
  );
  // return <Redirect to="/register-group" />;
};

export default CommunicationPage;
