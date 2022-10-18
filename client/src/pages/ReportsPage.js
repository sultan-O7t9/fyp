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
  CircularProgress,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Select from "../components/Select";
import Toast from "../components/Toast";
import TabsPanel from "./TabsPanel";
import Semester7Report from "./Semester7Report";
import FinalMarksReport from "./FinalMarksReport";
import Semester8Report from "./Semester8Report";
import FinalResultPerforma from "./FinalResultPerforma";
import CoverLetterReport from "./CoverLetterReport";
import { USER_ID, USER_ROLE } from "../utils/keys";

const ReportsPage = () => {
  const history = useHistory();
  const reportItems = [
    {
      text: "Final Year Project Evaluation Form (7th Semester)",
      value: 1,
      id: 1,
    },
    {
      text: "Final Year Project Evaluation Form (8th Semester)",
      value: 2,
      id: 2,
    },
    { text: "FYP Final Marks", value: 3, id: 3 },
    { text: "FYP Final Result Performa", value: 4, id: 4 },
    { text: "Cover_Letter_FYP_Submission", value: 5, id: 5 },
  ];
  const [semesters, setSemesters] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [withMarks, setWithMarks] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");
  const [finalReport, setFinalReport] = useState(false);
  const [coverReport, setCoverReport] = useState(false);
  const [report7, setReport7] = useState(false);
  const [report8, setReport8] = useState(false);
  const [finalPerforma, setFinalPerforma] = useState(false);
  const [rptData, setRptData] = useState([]);
  const [pmoDept, setPmoDept] = useState("");
  const [selectedReportType, setSelectedReportType] = useState(
    reportItems[0].value
  );
  const btnRef = React.useRef(null);
  const [fileUrl, setFileUrl] = useState("");

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

  const selectSemesterHandler = sem => {
    console.log(sem);
    setSelectedSemester(sem);
  };
  const selectReportTypeHandler = type => {
    setSelectedReportType(type);
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

  const generateReportHandler = async () => {
    const grps = [];
    if (selectedGroups.includes("all")) {
      const semGrps = selectedSemester
        ? semesters.find(s => s.id == selectedSemester).groups.map(g => g.id)
        : [];
      console.log(semGrps);
      for (let i = 0; i < semGrps.length; i++) {
        grps.push(semGrps[i]);
      }
    } else {
      for (let i = 0; i < selectedGroups.length; i++) {
        grps.push(selectedGroups[i]);
      }
    }
    console.log(selectedReportType, grps);

    if (selectedReportType == 1) {
      try {
        setDisabled(true);

        const res = await axios.post("/api/evaluation/7th-eval", {
          groups: grps,
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        setPmoDept(res.data.pmoDept);
        setRptData(res.data.students);
        setReport7(true);
      } catch (err) {
        setDisabled(false);

        console.log(err);
      }
    } else if (selectedReportType == 2) {
      try {
        setDisabled(true);
        const res = await axios.post("/api/evaluation/8th-eval", {
          groups: grps,
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        setRptData(res.data.students);
        setPmoDept(res.data.pmoDept);

        setReport8(true);
      } catch (err) {
        setDisabled(false);

        console.log(err);
      }
    } else if (selectedReportType == 3) {
      try {
        setDisabled(true);

        const res = await axios.post("/api/evaluation/all-eval", {
          groups: grps,
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        setRptData(res.data.studetns);
        setFinalReport(true);
      } catch (err) {
        setDisabled(false);

        console.log(err);
      }
    } else if (selectedReportType == 4) {
      try {
        setDisabled(true);

        const res = await axios.post("/api/evaluation/final-stu-eval", {
          groups: grps,
        });
        console.log(res.data);
        // var output = res.data;
        // const blob = new Blob([output]);
        // const fileDownloadUrl = URL.createObjectURL(blob);

        // setRptData(res.data.students);
        // setFinalPerforma(true);
        setFileUrl(res.data.file);
        btnRef.current.click();
        setDisabled(false);
      } catch (err) {
        setDisabled(false);

        console.log(err);
      }
    } else if (selectedReportType == 5) {
      try {
        setDisabled(true);

        const res = await axios.post("/api/evaluation/cover", {
          groups: grps,
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        // setRptData(res.data.students);
        // setFinalReport(true);
        setFileUrl(res.data.file);
        btnRef.current.click();
        // setCoverReport(true);
        setDisabled(false);
      } catch (err) {
        setDisabled(false);

        console.log(err);
      }
    }
    // history.push("/7-rep", { groupId: 65 });
    // console.log("REPORT");
    // setGenerateReportModal(true);

    // const data = {
    //   subject,
    //   message,
    //   groups: selectedGroups.includes("all")
    //     ? semesters.find(s => s.id == selectedSemester).groups.map(g => g.id)
    //     : selectedGroups,
    //   semester: selectedSemester,
    //   userId: localStorage.getItem(USER_ID),
    // };
    // console.log(data);
    // try {
    //   const res = await axios.post(
    //      "/api/sem/send-mail",
    //     data
    //   );
    //   console.log(res.data.mail);
    //   if (res.data.mail) {
    //     setToast(true);
    //     setTMsg("Mail sent successfully");
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  if (!isEligible) return <Redirect to="/404" />;

  return (
    <div>
      <Button
        ref={btnRef}
        style={{ display: "none" }}
        onClick={() => {
          let url = " /" + fileUrl;
          let win = window.open(url, "_blank");
          win.focus();
        }}
      >
        Download
      </Button>
      {coverReport ? (
        <CoverLetterReport
          setDisabled={setDisabled}
          data={rptData}
          setDisplay={setCoverReport}
        />
      ) : null}
      {finalReport ? (
        <FinalMarksReport
          setDisabled={setDisabled}
          data={rptData}
          setDisplay={setFinalReport}
        />
      ) : null}
      {report7 ? (
        <Semester7Report
          pmoDept={pmoDept}
          setDisabled={setDisabled}
          withMarks={withMarks}
          data={rptData}
          setDisplay={setReport7}
        />
      ) : null}
      {report8 ? (
        <Semester8Report
          pmoDept={pmoDept}
          setDisabled={setDisabled}
          withMarks={withMarks}
          data={rptData}
          setDisplay={setReport8}
        />
      ) : null}
      {finalPerforma ? (
        <FinalResultPerforma
          setDisabled={setDisabled}
          data={rptData}
          setDisplay={setFinalPerforma}
        />
      ) : null}

      {toast ? <Toast open={toast} setOpen={setToast} message={tMsg} /> : null}
      <ContainerFluid title="Reports" maxWidth="xl">
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
                Select Report Type
              </Typography>
              <Select
                required
                // style={{ width: "100%" }}

                label="Report Type"
                // multiple={true}
                value={selectedReportType}
                setValue={selectReportTypeHandler}
                items={reportItems}
              />
              {selectedReportType == 1 || selectedReportType == 2 ? (
                <Box style={{ display: "flex", marginTop: "6px" }}>
                  <Typography style={{ fontSize: "14px" }}>
                    With Marks?
                  </Typography>

                  <Switch
                    size="small"
                    checked={withMarks}
                    onChange={e => {
                      console.log(e.target.checked);
                      setWithMarks(e.target.checked);
                    }}
                  />
                </Box>
              ) : null}
            </Box>
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

            <Box style={{ marginBottom: "2rem" }}>
              {disabled ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  disabled={!selectedGroups.length || disabled}
                  style={{ display: "block" }}
                  onClick={() => {
                    generateReportHandler();
                  }}
                >
                  Generate Report
                </Button>
              )}
            </Box>
          </Box>
        </Main>
      </ContainerFluid>
      {/* )} */}
    </div>
  );
};

export default ReportsPage;
