import { useState } from "react";
import {
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import Select from "../components/Select";
import UploadFile from "../components/UploadFile";
import axios from "axios";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import DeliverableSettingsModal from "../components/DeliverableSettingsModal";

import Toast from "../components/Toast";
import AddSchedule from "../components/AddSchedule";
import EditSchedule from "../components/EditSchedule";
import RadioButtonGroup from "../components/RadioButtonGroup";
import LogsModal from "../components/LogsModal";
import { USER_ID, USER_ROLE } from "../utils/keys";

//     codeRemarks
//     testRemarks
//     overallRemarks
//     runProject
//     codeModify
//     testPlan
//     testCase
//     projectPpt
//     userMan
//     stdTemp
//     skill

const DATA = {
  group: {
    id: 1,
    name: "Group 1",
    remarks: {
      codeRemarks: "good",
      testRemarks: "bad",
      overallRemarks: "worst",
    },
    students: [
      {
        rollNo: "18094198-079",
        runProject: 0,
        codeModify: 0,
        testPlan: 0,
        testCase: 0,
        projectPpt: 0,
        userMan: 0,
        stdTemp: 0,
        skill: 0,
      },
    ],
  },
};

const DataHead = () => {
  return (
    <>
      <TableCell>Sub-Section</TableCell>
      <TableCell>Marks Distribution</TableCell>
      <TableCell>Marks Obtained</TableCell>
      <TableCell>Remarks</TableCell>
    </>
  );
};

const DataBody = props => {
  const { groupId, committeeId, setToast, setTMsg, deliverableId, evalDate } =
    props;

  const [inputError, setInputError] = useState({});
  const [totalError, setTotalError] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reviewInfo, setReviewInfo] = useState({});
  const [file, setFile] = useState({});
  const [committeeReview, setCommitteeReview] = useState("");
  const [revisionDate, setRevisionDate] = useState("");
  const [currVersion, setCurrVersion] = useState([]);

  const [runProjectMarks, setRunProjectMarks] = useState({});
  const [codeModifyMarks, setCodeModifyMarks] = useState({});
  const [testPlanMarks, setTestPlanMarks] = useState({});
  const [testCaseMarks, setTestCaseMarks] = useState({});
  const [projectPptMarks, setProjectPptMarks] = useState({});
  const [userManMarks, setUserManMarks] = useState({});
  const [stdTempMarks, setStdTempMarks] = useState({});
  const [skillMarks, setSkillMarks] = useState({});

  const [codeRemarks, setCodeRemarks] = useState("");
  const [testRemarks, setTestRemarks] = useState("");
  const [overallRemarks, setOverallRemarks] = useState("");

  const [evalData, setEvalData] = useState({});
  const [totalFieldMarks, setTotalFieldMarks] = useState({});

  useEffect(() => {
    const date = new Date(evalDate);
    const month = date.getMonth() + 1;
    const dd = `${date.getFullYear()}-${
      month < 10 ? "0" + month : month
    }-${date.getDate()}`;

    setRevisionDate(dd);
  }, [evalDate]);

  useEffect(() => {
    const getDeliverableData = async () => {
      try {
        const response = await axios.post(
          ` /api/deliverable/get-grp-submission`,
          { groupId: groupId, deliverableId: 3 }
        );
        // setSubFile(response.data.versions.pop().name);
        console.log(response.data);
        setCurrVersion(response.data.versions.pop());
      } catch (err) {
        console.log(err);
      }
      // setDeliverableData({
      //   title: response.data.versions.pop().name,
      //   template: response.data.versions.pop().name,
      // });
    };
    getDeliverableData();
  }, [deliverableId, groupId, committeeId, showUploadModal, refresh]);

  useEffect(() => {
    if (!evalData.remarks) return;

    setCodeRemarks(evalData.remarks.codeRemarks);
    setTestRemarks(evalData.remarks.testRemarks);
    setOverallRemarks(evalData.remarks.overallRemarks);
  }, [evalData]);

  useEffect(() => {
    const getReviewData = async () => {
      try {
        const res = await axios.post("/api/evaluation/get-review-status", {
          groupId,
          deliverableId,
          committeeId,
        });
        console.log("REVIEW", res.data);
        setReviewInfo(res.data.review);
        // setReview(res.data.review);
      } catch (err) {
        console.log(err);
      }
    };
    getReviewData();
  }, [deliverableId, groupId, committeeId, showUploadModal, refresh]);

  useEffect(() => {
    if (!evalData.students) return;
    const students = evalData.students;

    const rPMarks = {};
    const cMMarks = {};
    const tPMarks = {};
    const tCMarks = {};
    const pPMarks = {};
    const uMMarks = {};
    const sTMarks = {};
    const sMarks = {};
    const tMarks = {};

    students.forEach(student => {
      rPMarks[student.rollNo] = student.runProject;
      cMMarks[student.rollNo] = student.codeModify;
      tPMarks[student.rollNo] = student.testPlan;
      tCMarks[student.rollNo] = student.testCase;
      pPMarks[student.rollNo] = student.projectPpt;
      uMMarks[student.rollNo] = student.userMan;
      sTMarks[student.rollNo] = student.stdTemp;
      sMarks[student.rollNo] = student.skill;
      tMarks[student.rollNo] =
        student.runProject +
        student.codeModify +
        student.testPlan +
        student.testCase +
        student.projectPpt +
        student.userMan +
        student.stdTemp +
        student.skill;
    });
    setRunProjectMarks(rPMarks);
    setCodeModifyMarks(cMMarks);
    setTestPlanMarks(tPMarks);
    setTestCaseMarks(tCMarks);
    setProjectPptMarks(pPMarks);
    setUserManMarks(uMMarks);
    setStdTempMarks(sTMarks);
    setSkillMarks(sMarks);
    setTotalFieldMarks(tMarks);
  }, [evalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post("/api/evaluation/d3-evaluation", {
          groupId: groupId,
        });
        console.log(response.data);
        setEvalData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  const changeMarks = (rollNo, marks, type) => {
    console.log(marks < 0, parseFloat(marks));

    // setBtnDisabled(false);
    // setInputError({});

    switch (type) {
      case "runProject":
        if (marks < 0 || marks > 15) {
          setInputError({ ...inputError, runProject: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, runProject: false });
          setBtnDisabled(false);
        }
        setRunProjectMarks({ ...runProjectMarks, [rollNo]: marks });
        break;
      case "codeModify":
        if (marks < 0 || marks > 15) {
          setInputError({ ...inputError, codeModify: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, codeModify: false });
          setBtnDisabled(false);
        }
        setCodeModifyMarks({ ...codeModifyMarks, [rollNo]: marks });
        break;
      case "testPlan":
        if (marks < 0 || marks > 5) {
          setInputError({ ...inputError, testPlan: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, testPlan: false });
          setBtnDisabled(false);
        }
        setTestPlanMarks({ ...testPlanMarks, [rollNo]: marks });
        break;
      case "testCase":
        if (marks < 0 || marks > 15) {
          setInputError({ ...inputError, testCase: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, testCase: false });
          setBtnDisabled(false);
        }

        setTestCaseMarks({ ...testCaseMarks, [rollNo]: marks });
        break;
      case "projectPpt":
        if (marks < 0 || marks > 15) {
          setInputError({ ...inputError, projectPpt: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, projectPpt: false });
          setBtnDisabled(false);
        }

        setProjectPptMarks({ ...projectPptMarks, [rollNo]: marks });
        break;
      case "userMan":
        if (marks < 0 || marks > 10) {
          setInputError({ ...inputError, userMan: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, userMan: false });
          setBtnDisabled(false);
        }
        setUserManMarks({ ...userManMarks, [rollNo]: marks });
        break;
      case "stdTemp":
        if (marks < 0 || marks > 5) {
          setInputError({ ...inputError, stdTemp: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, stdTemp: false });
          setBtnDisabled(false);
        }
        setStdTempMarks({ ...stdTempMarks, [rollNo]: marks });
        break;
      case "skill":
        if (marks < 0 || marks > 10) {
          setInputError({ ...inputError, skill: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, skill: false });
          setBtnDisabled(false);
        }
        setSkillMarks({ ...skillMarks, [rollNo]: marks });
        break;

      default:
        break;
    }
    // setTotalFieldMarks({
    //   ...totalFieldMarks,
    //   [rollNo]:
    //     runProjectMarks[rollNo] +
    //     codeModifyMarks[rollNo] +
    //     testPlanMarks[rollNo] +
    //     testCaseMarks[rollNo] +
    //     projectPptMarks[rollNo] +
    //     userManMarks[rollNo] +
    //     stdTempMarks[rollNo] +
    //     skillMarks[rollNo],
    // });
  };
  const changeRemarks = (remarks, type) => {
    switch (type) {
      case "codeRemarks":
        setCodeRemarks(remarks);
        break;
      case "testRemarks":
        setTestRemarks(remarks);
        break;
      case "overallRemarks":
        setOverallRemarks(remarks);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const facultyRes = await axios.post("/api/faculty/get-sup-id", {
      id: localStorage.getItem(USER_ID),
    });
    console.log(facultyRes.data.faculty);
    const LOGS = [];
    const students = evalData.students;

    students.forEach(student => {
      if (student.runProject != runProjectMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Complete running project Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.runProject} to ${runProjectMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.codeModify != codeModifyMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Code Modification Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.codeModify} to ${codeModifyMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.testPlan != testPlanMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Test Plan Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.testPlan} to ${testPlanMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.testCase != testCaseMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Test Case Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.testCase} to ${testCaseMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }

      if (student.projectPpt != projectPptMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Project Presentation Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.projectPpt} to ${projectPptMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }

      if (student.userMan != userManMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `User Manual Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.userMan} to ${userManMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }

      if (student.stdTemp != stdTempMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Standard Template Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.stdTemp} to ${stdTempMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }

      if (student.skill != skillMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Overall Skillset Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.skill} to ${skillMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
    });
    console.log(LOGS);
    // return;

    const data = {
      groupId: groupId,
      remarks: {
        codeRemarks: codeRemarks,
        testRemarks: testRemarks,
        overallRemarks: overallRemarks,
      },
      students: evalData.students.map(student => {
        return {
          rollNo: student.rollNo,
          runProject: runProjectMarks[student.rollNo]
            ? runProjectMarks[student.rollNo]
            : 0,
          codeModify: codeModifyMarks[student.rollNo]
            ? codeModifyMarks[student.rollNo]
            : 0,
          testPlan: testPlanMarks[student.rollNo]
            ? testPlanMarks[student.rollNo]
            : 0,
          testCase: testCaseMarks[student.rollNo]
            ? testCaseMarks[student.rollNo]
            : 0,
          projectPpt: projectPptMarks[student.rollNo]
            ? projectPptMarks[student.rollNo]
            : 0,
          userMan: userManMarks[student.rollNo]
            ? userManMarks[student.rollNo]
            : 0,
          stdTemp: stdTempMarks[student.rollNo]
            ? stdTempMarks[student.rollNo]
            : 0,
          skill: skillMarks[student.rollNo] ? skillMarks[student.rollNo] : 0,
        };
      }),
    };
    console.log(data);
    try {
      const res = await axios.post("/api/evaluation/add-d3-evaluation", data);
      console.log(res.data);
      setTMsg("Marks has been updated successfully");
      setToast(true);

      // const facultyRes = await axios.post(
      //    "/api/faculty/get-sup-id",
      //   {
      //     id: localStorage.getItem(USER_ID),
      //   }
      // );
      // console.log(facultyRes.data.faculty);

      // const log = {
      //   deliverableId: deliverableId,
      //   groupId: groupId,
      //   text: `Marks Changed By ${localStorage.getItem(USER_ROLE)}: ${
      //     facultyRes.data.faculty.hasOwnProperty("name")
      //       ? facultyRes.data.faculty.name
      //       : null
      //   }`,
      // };
      // console.log(log);

      const res2 = await axios.post(` /api/deliverable/set-logs`, {
        logs: LOGS,
      });
      console.log(res2.data);
      setRefresh(refresh => !refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitFile = async () => {
    console.log("Working");
    const data = new FormData();
    data.append("file", file);
    data.append("reviewId", currVersion.id);
    console.log(file);
    console.log(reviewInfo.id);
    // return;
    try {
      const res = await axios.post("/api/evaluation/add-commented-doc", data);
      console.log("file:", res.data);
      if (res.data.upload) setShowUploadModal(false);
      setFile({ name: "" });
      // setName(res.data.file);
    } catch (err) {
      console.log(err);
      setShowUploadModal(false);
    }
  };

  const handleUpdateReview = async () => {
    console.log(committeeReview, revisionDate);
    try {
      const res = await axios.post("/api/evaluation//update-review-status", {
        groupId,
        userId: localStorage.getItem(USER_ID),
        deliverableId,
        versionId: currVersion.id,

        committeeId,
        status: committeeReview,
        date: revisionDate,
      });
      console.log(res.data);
      setToast(true);
      setTMsg("Review Updated Successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setRefresh(refresh => !refresh);
    }
  };

  return (
    <>
      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          notSubmit={true}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}
      <TableRow>
        <TableCell colSpan={1}>
          <Typography variant="h6">Committee Review</Typography>
        </TableCell>
        <TableCell colSpan={2}>
          <RadioButtonGroup
            label=""
            defaultValue={null}
            onChange={e => {
              setCommitteeReview(e.target.value);
              console.log(e.target.value);
            }}
            items={[
              { label: "Approved", value: "Approved" },
              { label: "Revised", value: "Revised" },
            ]}
          />
          <TextField
            style={{ display: committeeReview == "Revised" ? "block" : "none" }}
            type="date"
            value={revisionDate}
            onChange={e => setRevisionDate(e.target.value)}
          />
        </TableCell>
        <TableCell colSpan={1}>
          <Button
            variant="contained"
            onClick={handleUpdateReview}
            disabled={
              !committeeReview ||
              (committeeReview == "Revised" &&
                new Date(revisionDate) <= new Date(evalDate))
            }
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={1}>
          <Typography variant="h6">Current Review</Typography>
        </TableCell>
        <TableCell colSpan={3}>
          <Typography
            variant="body1"
            style={{
              color: currVersion.eval_status == "Approved" ? "green" : "red",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {currVersion ? currVersion.eval_status : "Pending"}
          </Typography>
          {currVersion.eval_status == "Revised" ? (
            <Typography variant="body1">
              Revision Date:{" "}
              {new Date(currVersion.revision_date).toDateString()}
            </Typography>
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={1}>
          <Typography variant="body1">
            Commented Document by committee
          </Typography>
        </TableCell>
        <TableCell colSpan={2}>
          {currVersion.eval_commented_doc ? (
            <Button
              onClick={() => {
                let url = " /" + reviewInfo.commented_doc;
                let win = window.open(url, "_blank");
                win.focus();
              }}
            >
              {currVersion.eval_commented_doc}
            </Button>
          ) : (
            <Typography variant="body1">None </Typography>
          )}
        </TableCell>
        <TableCell colSpan={1}>
          <Button
            variant="contained"
            onClick={() => {
              setShowUploadModal(true);
            }}
          >
            Upload
          </Button>
        </TableCell>
      </TableRow>
      {/* Headers */}
      <TableRow>
        <TableCell
          style={{
            fontWeight: "bold",
          }}
        >
          Sub-Section
        </TableCell>
        <TableCell
          style={{
            fontWeight: "bold",
          }}
        >
          Marks Distribution
        </TableCell>
        <TableCell
          style={{
            fontWeight: "bold",
          }}
        >
          Marks Obtained
        </TableCell>
        <TableCell
          style={{
            fontWeight: "bold",
          }}
        >
          Remarks
        </TableCell>
      </TableRow>
      {/* Body */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Code</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>{""}</TableCell>
        <TableCell style={{ display: "flex" }}>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <div
                  key={student.rollNo}
                  style={{
                    fontWeight: "bold",
                    width: "6rem",
                    marginRight: "1rem",
                  }}
                >
                  {student.rollNo}
                </div>
              ))
            : null}
        </TableCell>
        <TableCell colSpan={1}>{""}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Complete Running Project</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = runProjectMarks[student.rollNo]
                  ? runProjectMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.runProject}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(student.rollNo, e.target.value, "runProject")
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={2}>
          <TextareaAutosize
            minRows={8}
            value={codeRemarks}
            onChange={e => changeRemarks(e.target.value, "codeRemarks")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Run time code Modification</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.codeModify}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={codeModifyMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "codeModify")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>

      {/* Next Section */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Testing</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>{""}</TableCell>
        <TableCell style={{ display: "flex" }}>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <div
                  key={student.rollNo}
                  style={{
                    fontWeight: "bold",
                    width: "6rem",
                    marginRight: "1rem",
                  }}
                >
                  {student.rollNo}
                </div>
              ))
            : null}
        </TableCell>
        <TableCell colSpan={1}>{""}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Test Plan</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = testPlanMarks[student.rollNo]
                  ? testPlanMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.testPlan}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(student.rollNo, e.target.value, "testPlan")
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={2}>
          <TextareaAutosize
            minRows={8}
            value={testRemarks}
            onChange={e => changeRemarks(e.target.value, "testRemarks")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Test Case Design</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.testCase}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={testCaseMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "testCase")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>

      {/* Next Section */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Overall System and Documentation</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>{""}</TableCell>
        <TableCell style={{ display: "flex" }}>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <div
                  key={student.rollNo}
                  style={{
                    fontWeight: "bold",
                    width: "6rem",
                    marginRight: "1rem",
                  }}
                >
                  {student.rollNo}
                </div>
              ))
            : null}
        </TableCell>
        <TableCell colSpan={1}>{""}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Project Presentation</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = projectPptMarks[student.rollNo]
                  ? projectPptMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.projectPpt}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(student.rollNo, e.target.value, "projectPpt")
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={4}>
          <TextareaAutosize
            minRows={24}
            value={overallRemarks}
            onChange={e => changeRemarks(e.target.value, "overallRemarks")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>User Manual</TableCell>
        <TableCell>10</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.userMan}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={userManMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "userMan")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Standard Template</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.stdTemp}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={stdTempMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "stdTemp")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Overall Skill Set</TableCell>
        <TableCell>10</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.skill}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={skillMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "skill")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      {/* Total */}
      <TableRow>
        <TableCell>
          <Typography style={{ fontWeight: "bold" }}>Total</Typography>
        </TableCell>
        <TableCell style={{ fontWeight: "bold" }}>90</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={
                    totalFieldMarks[student.rollNo] > 90 ||
                    totalFieldMarks[student.rollNo] < 0
                  }
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={totalFieldMarks[student.rollNo]}
                  onChange={e =>
                    // changeMarks(student.rollNo, e.target.value, "pptSkills")
                    {
                      setTotalFieldMarks({
                        ...totalFieldMarks,
                        [student.rollNo]: e.target.value,
                      });
                      setTotalError(e.target.value > 90 || e.target.value < 0);
                      const total = e.target.value;
                      // const fs = total / ;
                      // const g = total / 4;
                      // const a = total / 4;
                      // const p = total / 4;
                      const m_10 = total / 9;
                      const m_15 = total / 6;
                      const m_5 = total / 18;

                      setRunProjectMarks({
                        ...runProjectMarks,
                        [student.rollNo]: m_15,
                      });
                      setCodeModifyMarks({
                        ...codeModifyMarks,
                        [student.rollNo]: m_15,
                      });
                      setTestPlanMarks({
                        ...testPlanMarks,
                        [student.rollNo]: m_5,
                      });
                      setTestCaseMarks({
                        ...testCaseMarks,
                        [student.rollNo]: m_15,
                      });
                      setProjectPptMarks({
                        ...projectPptMarks,
                        [student.rollNo]: m_15,
                      });
                      setUserManMarks({
                        ...userManMarks,
                        [student.rollNo]: m_10,
                      });
                      setStdTempMarks({
                        ...stdTempMarks,
                        [student.rollNo]: m_5,
                      });
                      setSkillMarks({
                        ...skillMarks,
                        [student.rollNo]: m_10,
                      });
                    }
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>

      {/* <TableRow>
        <TableCell>Total</TableCell>
        <TableCell>20</TableCell>
        {evalData.students && evalData.students.length
          ? evalData.students.map(student => (
              <TableCell key={student.rollNo}>
                {(
                  existingSystemMarks[student.rollNo] +
                  architectureMarks[student.rollNo] +
                  pptSkillsMarks[student.rollNo] +
                  goalsMarks[student.rollNo]
                ).toFixed(2)}
              </TableCell>
            ))
          : null}
        <TableCell>{""}</TableCell>
      </TableRow> */}
      <TableRow>
        <TableCell>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              totalError ||
              inputError.skill ||
              inputError.stdTemp ||
              inputError.userMan ||
              inputError.projectPpt ||
              inputError.testCase ||
              inputError.testPlan ||
              inputError.codeModify ||
              inputError.codeModify ||
              inputError.runProject
            }
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const D3EvaluationPage = props => {
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    !localStorage.getItem(USER_ROLE).includes("SUPERVISOR");
  // const roles = localStorage.getItem(USER_ROLE);
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [subFile, setSubFile] = useState();
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();
  console.log(history);
  const data = history.location.state;
  console.log(data);
  const groupId = data.group.id;
  const evalDate = data.date;
  const deliverableId = data.deliverableId;
  console.log(groupId);
  // return <div></div>;
  // const params = useParams();
  // const deliverableId = params.id;

  useEffect(() => {
    const getDeliverableData = async () => {
      const response = await axios.post(
        ` /api/deliverable/get-grp-submission`,
        { groupId: groupId, deliverableId: 1 }
      );
      setSubFile(response.data.versions.pop().name);

      // setDeliverableData({
      //   title: response.data.versions.pop().name,
      //   template: response.data.versions.pop().name,
      // });
    };
    getDeliverableData();
  }, [data, groupId]);

  useEffect(() => {
    const getLogsData = async () => {
      const data = { deliverableId: deliverableId, groupId: groupId };
      try {
        const res = await axios.post(` /api/deliverable/get-logs`, data);
        console.log(res.data);
        setLogsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getLogsData();
  }, [data, groupId, deliverableId, showToast, showLogsModal]);

  const downloadTemplateFile = async e => {
    e.preventDefault();
    let url = " /" + subFile;
    console.log(url);
    let win = window.open(url, "_blank");
    win.focus();
  };

  if (!isEligible) return <Redirect to="/404" />;

  return (
    <>
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}
      {showLogsModal ? (
        <LogsModal setDisplay={setShowLogsModal} data={logsData} />
      ) : null}

      <ContainerFluid maxWidth="lg">
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="h4">
                  D3 Evaluation: {data.group.name}
                </Typography>

                <Typography variant="h6">
                  Evaluation Date: {new Date(evalDate).toDateString()}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Logs">
                  <IconButton
                    onClick={() => {
                      setShowLogsModal(true);
                    }}
                  >
                    <HistoryIcon
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        color: "rgb(25,118,210)",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
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
              <Typography variant="h6">Submission File</Typography>
              {/* <Button variant="text" onClick={downloadTemplateFile}>
                {name}
              </Button> */}
              {subFile ? (
                <form onSubmit={downloadTemplateFile} className="form">
                  <Button variant="text" type="submit">
                    {subFile}
                  </Button>
                </form>
              ) : (
                <Typography variant="body">None</Typography>
              )}
            </Box>
          </Card>
          <DataTable
            DataHead={DataHead}
            DataBody={() => (
              <DataBody
                groupId={groupId}
                setToast={setShowToast}
                setTMsg={setToastMessage}
                deliverableId={deliverableId}
                committeeId={data.committee.id}
                evalDate={evalDate}
              />
            )}
          />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default D3EvaluationPage;
