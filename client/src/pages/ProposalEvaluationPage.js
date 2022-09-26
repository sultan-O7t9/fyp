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

const DATA = {
  // heads: ["Group ID", "Project Title", "Submitted On", "Submission"],
  heads: [""],
  data: [
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
  ],
};

const DataHead = () => {
  return null;
};

const DataBody = props => {
  const { groupId, committeeId, setToast, setTMsg, deliverableId, evalDate } =
    props;
  console.log(groupId);
  const [remarks, setRemarks] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reviewInfo, setReviewInfo] = useState({});
  const [file, setFile] = useState({});
  const [inputError, setInputError] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [totalError, setTotalError] = useState(false);
  const [existingSystemMarks, setExistingSystemMarks] = useState({});
  const [architectureMarks, setArchitectureMarks] = useState({});
  const [pptSkillsMarks, setPptSkillsMarks] = useState({});
  const [goalsMarks, setGoalsMarks] = useState({});
  const [totalFieldMarks, setTotalFieldMarks] = useState({});

  // const [showDateField,s]

  const [evalData, setEvalData] = useState({});

  const [committeeReview, setCommitteeReview] = useState("");
  const [revisionDate, setRevisionDate] = useState("");
  const [currVersion, setCurrVersion] = useState([]);
  // const [reviewData, setReviewData] = useState({});

  useEffect(() => {
    const getDeliverableData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/deliverable/get-grp-submission`,
          { groupId: groupId, deliverableId: 1 }
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

  // useEffect(() => {

  // }, [evalDate]);

  useEffect(() => {
    if (!evalData.remarks) return;
    setRemarks(evalData.remarks);
  }, [evalData, refresh]);
  useEffect(() => {
    setCommitteeReview(currVersion.eval_status);
    if (currVersion.revision_date) {
      const date = new Date(currVersion.revision_date);

      console.log(date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const dd = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
      console.log(dd);

      setRevisionDate(dd);
    }
    // console.log(currVersion);
  }, [currVersion]);

  useEffect(() => {
    const getReviewData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/evaluation/get-review-status",
          {
            groupId,
            deliverableId,
            committeeId,
          }
        );
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
    const esMarks = {};
    const archMarks = {};
    const pptMarks = {};
    const gMarks = {};
    const tMarks = {};
    students.forEach(student => {
      esMarks[student.rollNo] = student.existingSystem;
      archMarks[student.rollNo] = student.architecture;
      pptMarks[student.rollNo] = student.pptSkills;
      gMarks[student.rollNo] = student.goals;
      tMarks[student.rollNo] =
        student.existingSystem +
        student.architecture +
        student.pptSkills +
        student.goals;
    });
    setExistingSystemMarks(esMarks);
    setArchitectureMarks(archMarks);
    setPptSkillsMarks(pptMarks);
    setGoalsMarks(gMarks);
    setTotalFieldMarks(tMarks);
  }, [evalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/evaluation/proposal-evaluation",
          { groupId: groupId }
        );
        console.log(response.data);
        setEvalData(response.data.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  const changeMarks = (rollNo, marks, type, prevMarks) => {
    console.log(marks < 0, parseFloat(marks));
    console.log(inputError);
    // setInputError({});

    switch (type) {
      case "existingSystem":
        if (marks > 5 || marks < 0) {
          setInputError({ ...inputError, existingSystem: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, existingSystem: false });
        }
        setExistingSystemMarks({ ...existingSystemMarks, [rollNo]: marks });
        break;
      case "architecture":
        if (marks > 5 || marks < 0) {
          setInputError({ ...inputError, architecture: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, architecture: false });
        }
        setArchitectureMarks({ ...architectureMarks, [rollNo]: marks });
        break;
      case "pptSkills":
        if (marks > 5 || marks < 0) {
          setInputError({ ...inputError, pptSkills: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, pptSkills: false });
        }
        setPptSkillsMarks({ ...pptSkillsMarks, [rollNo]: marks });
        break;
      case "goals":
        if (marks > 5 || marks < 0) {
          setInputError({ ...inputError, goals: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, goals: false });
        }

        setGoalsMarks({ ...goalsMarks, [rollNo]: marks });
        break;
      default:
        break;
    }
  };
  const changeRemarks = remarks => {
    setRemarks(remarks);
  };

  const handleSubmit = async () => {
    const facultyRes = await axios.post(
      "http://localhost:5000/api/faculty/get-sup-id",
      {
        id: localStorage.getItem(USER_ID),
      }
    );
    console.log(facultyRes.data.faculty);
    const LOGS = [];
    const students = evalData.students;
    students.forEach(student => {
      if (student.existingSystem != existingSystemMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Existing System Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.existingSystem} to ${
            existingSystemMarks[student.rollNo]
          }`,
        };
        LOGS.push(log);
      }
      if (student.architecture != architectureMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Architecture Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.architecture} to ${
            architectureMarks[student.rollNo]
          }`,
        };
        LOGS.push(log);
      }
      if (student.pptSkills != pptSkillsMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Presentation Skills Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.pptSkills} to ${pptSkillsMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.goals != goalsMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Goals Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.goals} to ${goalsMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
    });
    console.log(LOGS);
    // return;
    const data = {
      groupId: evalData.groupId,
      remarks: remarks,
      students: evalData.students.map(student => {
        return {
          rollNo: student.rollNo,
          existingSystem: existingSystemMarks[student.rollNo]
            ? existingSystemMarks[student.rollNo]
            : 0,
          architecture: architectureMarks[student.rollNo]
            ? architectureMarks[student.rollNo]
            : 0,
          pptSkills: pptSkillsMarks[student.rollNo]
            ? pptSkillsMarks[student.rollNo]
            : 0,
          goals: goalsMarks[student.rollNo] ? goalsMarks[student.rollNo] : 0,
        };
      }),
    };
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-proposal-evaluation",
        data
      );
      console.log(res.data);
      setTMsg("Marks Updated Successfully");
      setToast(true);

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

      const res2 = await axios.post(
        `http://localhost:5000/api/deliverable/set-logs`,
        { logs: LOGS }
      );
      console.log(res2.data);
      setRefresh(refresh => !refresh);
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   setReview(reviewInfo);
  // }, [reviewInfo]);

  const handleSubmitFile = async () => {
    console.log("Working");
    const data = new FormData();
    data.append("file", file);
    data.append("reviewId", currVersion.id);
    console.log(file);
    console.log(reviewInfo.id);
    // return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-commented-doc",
        data
      );
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
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/update-review-status",
        {
          groupId,
          versionId: currVersion.id,
          deliverableId,
          committeeId,
          status: committeeReview,
          date: revisionDate,
        }
      );
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
            // defaultValue={null}
            value={committeeReview}
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
            onChange={e => {
              console.log(e.target.value);
              setRevisionDate(e.target.value);
            }}
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
          {currVersion.eval_status == "Revised" ? (
            <Typography variant="body1">
              Revision Date:{" "}
              {new Date(currVersion.revision_date).toDateString()}
            </Typography>
          ) : null}
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
                let url = "http://localhost:5000/" + reviewInfo.commented_doc;
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
        <TableCell>Understanding of existing system</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = existingSystemMarks[student.rollNo]
                  ? existingSystemMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.existingSystem}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(
                        student.rollNo,
                        e.target.value,
                        "existingSystem",
                        evalData.students.find(s => s.rollNo == student.rollNo)
                          .existingSystem
                      )
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={4}>
          <TextareaAutosize
            minRows={8}
            value={remarks}
            onChange={e => changeRemarks(e.target.value)}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Well defined goal & objective</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.goals}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={goalsMarks[student.rollNo]}
                  onChange={e => {
                    changeMarks(student.rollNo, e.target.value, "goals");
                  }}
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Conceptual Application/ Architecture</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.architecture}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={architectureMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "architecture")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Presentation Skills</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.pptSkills}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={pptSkillsMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "pptSkills")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography style={{ fontWeight: "bold" }}>Total</Typography>
        </TableCell>
        <TableCell style={{ fontWeight: "bold" }}>20</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={
                    totalFieldMarks[student.rollNo] > 20 ||
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
                      setTotalError(e.target.value > 20 || e.target.value < 0);
                      const total = e.target.value;
                      const eS = total / 4;
                      const g = total / 4;
                      const a = total / 4;
                      const p = total / 4;
                      setExistingSystemMarks({
                        ...existingSystemMarks,
                        [student.rollNo]: eS,
                      });
                      setGoalsMarks({
                        ...goalsMarks,
                        [student.rollNo]: g,
                      });
                      setArchitectureMarks({
                        ...architectureMarks,
                        [student.rollNo]: a,
                      });
                      setPptSkillsMarks({
                        ...pptSkillsMarks,
                        [student.rollNo]: p,
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
              inputError.pptSkills ||
              inputError.architecture ||
              inputError.goals ||
              inputError.existingSystem
            }
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProposalEvaluationPage = props => {
  // const roles = localStorage.getItem(USER_ROLE);
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  // const [deliverableData, setDeliverableData] = useState({
  //   title: "",
  //   template: "",
  // });
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    !localStorage.getItem(USER_ROLE).includes("SUPERVISOR");
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [subFile, setSubFile] = useState();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();
  const data = history.location.state;
  console.log(data);
  const groupId = data.group.id;
  const evalDate = data.date;
  const deliverableId = data.deliverableId;
  console.log(groupId);

  // const params = useParams();
  // const deliverableId = params.id;

  useEffect(() => {
    const getDeliverableData = async () => {
      const response = await axios.post(
        `http://localhost:5000/api/deliverable/get-grp-submission`,
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
        const res = await axios.post(
          `http://localhost:5000/api/deliverable/get-logs`,
          data
        );
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
    let url = "http://localhost:5000/" + subFile;
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
                  Proposal Evaluation: {data.group.name}
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
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
            className="form"
          >
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
          </form>
        </Main>
      </ContainerFluid>
    </>
  );
};

export default ProposalEvaluationPage;
