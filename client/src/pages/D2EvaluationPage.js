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

// funcReqs
//   interfaces
//   usecaseDesc
//   usecaseDia
//   nonFuncReqs
//   projectType
//   domainDia
//   classDia
//   sequenceDia
//   stateChartDia
//   collabDia
//   sysPrototype

const DATA = {
  group: {
    id: 1,
    name: "Group 1",
    remarks: {
      reqRemarks: "",
      designRemarks: "",
      sysRemarks: "",
    },
    students: [
      {
        rollNo: "18094198-079",
        funcReqs: 0,
        interfaces: 0,
        usecaseDesc: 0,
        usecaseDia: 0,
        nonFuncReqs: 0,
        projectType: 0,
        domainDia: 0,
        classDia: 0,
        sequenceDia: 0,
        stateChartDia: 0,
        collabDia: 0,
        sysPrototype: 0,
      },
    ],
  },
};

const DataHead = () => {
  return null;
};

const DataBody = props => {
  const { groupId, committeeId, setToast, setTMsg, deliverableId, evalDate } =
    props;
  const [projectInfo, setProjectInfo] = useState({});

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

  const [funcReqsMarks, setFuncReqsMarks] = useState({});
  const [interfacesMarks, setInterfacesMarks] = useState({});
  const [usecaseDescMarks, setUsecaseDescMarks] = useState({});
  const [usecaseDiaMarks, setUsecaseDiaMarks] = useState({});
  const [nonFuncReqsMarks, setNonFuncReqsMarks] = useState({});
  const [domainDiaMarks, setDomainDiaMarks] = useState({});
  const [classDiaMarks, setClassDiaMarks] = useState({});
  const [sequenceDiaMarks, setSequenceDiaMarks] = useState({});
  const [stateChartDiaMarks, setStateChartDiaMarks] = useState({});
  const [collabDiaMarks, setCollabDiaMarks] = useState({});
  const [sysPrototypeMarks, setSysPrototypeMarks] = useState({});

  const [reqRemarks, setReqRemarks] = useState("");
  const [designRemarks, setDesignRemarks] = useState("");
  const [sysRemarks, setSysRemarks] = useState("");

  const [evalData, setEvalData] = useState({});
  const [totalFieldMarks, setTotalFieldMarks] = useState({});

  useEffect(() => {
    const getDeliverableData = async () => {
      try {
        const response = await axios.post(
          ` /api/deliverable/get-grp-submission`,
          { groupId: groupId, deliverableId: 2 }
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
    const getProjectInfo = async () => {
      try {
        const res = await axios.get(` /api/project/get-grp/${groupId}`);
        // setProjectInfo(res.data);
        setProjectInfo(res.data.project);
      } catch (err) {
        console.log(err);
      }
    };
    getProjectInfo();
  }, [evalData, groupId]);

  useEffect(() => {
    if (!evalData.remarks) return;
    setReqRemarks(evalData.remarks.reqRemarks);
    setDesignRemarks(evalData.remarks.designRemarks);
    setSysRemarks(evalData.remarks.sysRemarks);
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
    const date = new Date(evalDate);
    const month = date.getMonth() + 1;
    const dd = `${date.getFullYear()}-${
      month < 10 ? "0" + month : month
    }-${date.getDate()}`;

    setRevisionDate(dd);
  }, [evalDate]);

  useEffect(() => {
    if (!evalData.students) return;
    const students = evalData.students;
    const fMarks = {};
    const iMarks = {};
    const uDescMarks = {};
    const uDiaMarks = {};
    const nfMarks = {};
    const dDiaMarks = {};
    const cDiaMarks = {};
    const seqDiaMarks = {};
    const stateDiaMarks = {};
    const colDiaMarks = {};
    const sPMarks = {};
    const tMarks = {};
    students.forEach(student => {
      fMarks[student.rollNo] = student.funcReqs;
      iMarks[student.rollNo] = student.interfaces;
      uDescMarks[student.rollNo] = student.usecaseDesc;
      uDiaMarks[student.rollNo] = student.usecaseDia;
      nfMarks[student.rollNo] = student.nonFuncReqs;
      dDiaMarks[student.rollNo] = student.domainDia;
      cDiaMarks[student.rollNo] = student.classDia;
      seqDiaMarks[student.rollNo] = student.sequenceDia;
      stateDiaMarks[student.rollNo] = student.stateChartDia;
      colDiaMarks[student.rollNo] = student.collabDia;
      sPMarks[student.rollNo] = student.sysPrototype;
      tMarks[student.rollNo] =
        student.funcReqs +
        student.interfaces +
        student.usecaseDesc +
        student.usecaseDia +
        student.nonFuncReqs +
        student.domainDia +
        student.classDia +
        student.sequenceDia +
        student.stateChartDia +
        student.collabDia +
        student.sysPrototype;
    });
    setFuncReqsMarks(fMarks);
    setInterfacesMarks(iMarks);
    setUsecaseDescMarks(uDescMarks);
    setUsecaseDiaMarks(uDiaMarks);
    setNonFuncReqsMarks(nfMarks);
    setDomainDiaMarks(dDiaMarks);
    setClassDiaMarks(cDiaMarks);
    setSequenceDiaMarks(seqDiaMarks);
    setStateChartDiaMarks(stateDiaMarks);
    setCollabDiaMarks(colDiaMarks);
    setSysPrototypeMarks(sPMarks);
    setTotalFieldMarks(tMarks);
  }, [evalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post("/api/evaluation/d2-evaluation", {
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
    // if (marks < 0) return;
    setBtnDisabled(false);
    // setInputError({});
    console.log(rollNo, marks, type);
    switch (type) {
      case "funcReqs":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, funcReqs: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, funcReqs: false });
        }
        setFuncReqsMarks({ ...funcReqsMarks, [rollNo]: marks });
        break;
      case "interfaces":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, interfaces: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, interfaces: false });
        }
        setInterfacesMarks({ ...interfacesMarks, [rollNo]: marks });
        break;
      case "usecaseDesc":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, usecaseDesc: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, usecaseDesc: false });
        }
        setUsecaseDescMarks({ ...usecaseDescMarks, [rollNo]: marks });
        break;
      case "usecaseDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, usecaseDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, usecaseDia: false });
        }
        setUsecaseDiaMarks({ ...usecaseDiaMarks, [rollNo]: marks });
        break;
      case "nonFuncReqs":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, nonFuncReqs: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, nonFuncReqs: false });
        }
        setNonFuncReqsMarks({ ...nonFuncReqsMarks, [rollNo]: marks });
        break;
      case "domainDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, domainDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, domainDia: false });
        }
        setDomainDiaMarks({ ...domainDiaMarks, [rollNo]: marks });
        break;
      case "classDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, classDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, classDia: false });
        }
        setClassDiaMarks({ ...classDiaMarks, [rollNo]: marks });

        break;
      case "sequenceDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, sequenceDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, sequenceDia: false });
        }
        setSequenceDiaMarks({ ...sequenceDiaMarks, [rollNo]: marks });
        break;
      case "stateChartDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, stateChartDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, stateChartDia: false });
        }
        setStateChartDiaMarks({ ...stateChartDiaMarks, [rollNo]: marks });
        break;
      case "collabDia":
        if (marks > 2 || marks < 0) {
          setInputError({ ...inputError, collabDia: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, collabDia: false });
        }
        setCollabDiaMarks({ ...collabDiaMarks, [rollNo]: marks });
        break;
      case "sysPrototype":
        if (marks > 10 || marks < 0) {
          setInputError({ ...inputError, sysPrototype: true });
          setBtnDisabled(true);
        } else {
          setInputError({ ...inputError, sysPrototype: false });
        }
        setSysPrototypeMarks({ ...sysPrototypeMarks, [rollNo]: marks });
        break;

      default:
        break;
    }
  };
  const changeRemarks = (remarks, type) => {
    switch (type) {
      case "reqRemarks":
        setReqRemarks(remarks);
        break;
      case "designRemarks":
        setDesignRemarks(remarks);
        break;
      case "sysRemarks":
        setSysRemarks(remarks);
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
      if (student.funcReqs != funcReqsMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Functional Requirements Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.funcReqs} to ${funcReqsMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.interfaces != interfacesMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Interfaces Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.interfaces} to ${interfacesMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.usecaseDesc != usecaseDescMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Usecase Description Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.usecaseDesc} to ${usecaseDescMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.usecaseDia != usecaseDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Usecase Diagram Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.usecaseDia} to ${usecaseDiaMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.nonFuncReqs != nonFuncReqsMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Non-Functional Requirements Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.nonFuncReqs} to ${nonFuncReqsMarks[student.rollNo]}`,
        };
        LOGS.push(log);
      }
      if (student.domainDia != domainDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `${
            projectInfo.hasOwnProperty("dev_tech") &&
            projectInfo.dev_tech == "object oriented"
              ? "Domain Model"
              : "ERD"
          } Marks of ${student.rollNo} was changed by ${localStorage.getItem(
            USER_ROLE
          )}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.domainDia} to ${domainDiaMarks[student.rollNo]}`,
        };

        LOGS.push(log);
      }

      if (student.classDia != classDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `${
            projectInfo.hasOwnProperty("dev_tech") &&
            projectInfo.dev_tech == "object oriented"
              ? "Class Diagram"
              : "Data Flow Diagram"
          } Marks of ${student.rollNo} was changed by ${localStorage.getItem(
            USER_ROLE
          )}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.classDia} to ${classDiaMarks[student.rollNo]}`,
        };

        LOGS.push(log);
      }

      if (student.sequenceDia != sequenceDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `${
            projectInfo.hasOwnProperty("dev_tech") &&
            projectInfo.dev_tech == "object oriented"
              ? "Sequence Diagram"
              : "State Transition Diagram"
          } Marks of ${student.rollNo} was changed by ${localStorage.getItem(
            USER_ROLE
          )}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.sequenceDia} to ${sequenceDiaMarks[student.rollNo]}`,
        };

        LOGS.push(log);
      }

      if (student.stateChartDia != stateChartDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `${
            projectInfo.hasOwnProperty("dev_tech") &&
            projectInfo.dev_tech == "object oriented"
              ? "State Chart Diagram"
              : "Architectural Diagram"
          } Marks of ${student.rollNo} was changed by ${localStorage.getItem(
            USER_ROLE
          )}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.stateChartDia} to ${
            stateChartDiaMarks[student.rollNo]
          }`,
        };

        LOGS.push(log);
      }

      if (student.collabDia != collabDiaMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `${
            projectInfo.hasOwnProperty("dev_tech") &&
            projectInfo.dev_tech == "object oriented"
              ? "Collaboration Diagram"
              : "Component Diagram"
          } Marks of ${student.rollNo} was changed by ${localStorage.getItem(
            USER_ROLE
          )}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.collabDia} to ${collabDiaMarks[student.rollNo]}`,
        };

        LOGS.push(log);
      }

      if (student.sysPrototype != sysPrototypeMarks[student.rollNo]) {
        const log = {
          deliverableId: deliverableId,
          groupId: groupId,
          text: `Partially Working System Marks of ${
            student.rollNo
          } was changed by ${localStorage.getItem(USER_ROLE)}: ${
            facultyRes.data.faculty.hasOwnProperty("name")
              ? facultyRes.data.faculty.name
              : null
          } from ${student.sysPrototype} to ${
            sysPrototypeMarks[student.rollNo]
          }`,
        };

        LOGS.push(log);
      }
    });
    console.log(LOGS);
    // return;

    const data = {
      groupId: evalData.groupId,
      remarks: {
        reqRemarks: reqRemarks,
        designRemarks: designRemarks,
        sysRemarks: sysRemarks,
      },
      students: evalData.students.map(student => {
        return {
          rollNo: student.rollNo,
          //   existingSystem: existingSystemMarks[student.rollNo]
          //     ? existingSystemMarks[student.rollNo]
          //     : 0,
          funcReqs: funcReqsMarks[student.rollNo]
            ? funcReqsMarks[student.rollNo]
            : 0,
          interfaces: interfacesMarks[student.rollNo]
            ? interfacesMarks[student.rollNo]
            : 0,
          usecaseDesc: usecaseDescMarks[student.rollNo]
            ? usecaseDescMarks[student.rollNo]
            : 0,
          usecaseDia: usecaseDiaMarks[student.rollNo]
            ? usecaseDiaMarks[student.rollNo]
            : 0,
          nonFuncReqs: nonFuncReqsMarks[student.rollNo]
            ? nonFuncReqsMarks[student.rollNo]
            : 0,
          domainDia: domainDiaMarks[student.rollNo]
            ? domainDiaMarks[student.rollNo]
            : 0,
          classDia: classDiaMarks[student.rollNo]
            ? classDiaMarks[student.rollNo]
            : 0,
          sequenceDia: sequenceDiaMarks[student.rollNo]
            ? sequenceDiaMarks[student.rollNo]
            : 0,
          stateChartDia: stateChartDiaMarks[student.rollNo]
            ? stateChartDiaMarks[student.rollNo]
            : 0,
          collabDia: collabDiaMarks[student.rollNo]
            ? collabDiaMarks[student.rollNo]
            : 0,
          sysPrototype: sysPrototypeMarks[student.rollNo]
            ? sysPrototypeMarks[student.rollNo]
            : 0,
        };
      }),
    };
    console.log(data);
    try {
      const res = await axios.post("/api/evaluation/add-d2-evaluation", data);
      console.log(res.data);
      setTMsg("Marks has been updated successfully");
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
        committeeId,
        status: committeeReview,
        date: revisionDate,
        versionId: currVersion.id,
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
          <Typography variant="h6">
            Software Requirements Specifications
          </Typography>
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
        <TableCell>Functional Requirements</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = funcReqsMarks[student.rollNo]
                  ? funcReqsMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.funcReqs}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(student.rollNo, e.target.value, "funcReqs")
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={5}>
          <TextareaAutosize
            minRows={26}
            value={reqRemarks}
            onChange={e => changeRemarks(e.target.value, "reqRemarks")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Interfaces</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.interfaces}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={interfacesMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "interfaces")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Use case Descriptions</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.usecaseDesc}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={usecaseDescMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "usecaseDesc")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Use case Diagrams</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.usecaseDia}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={usecaseDiaMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "usecaseDia")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Non Functional Attributes</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.nonFuncReqs}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={nonFuncReqsMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "nonFuncReqs")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>

      {/* Next Section */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Design Document</Typography>
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
        <TableCell>
          {projectInfo.hasOwnProperty("dev_tech") &&
          projectInfo.dev_tech == "object oriented"
            ? "Domain Model"
            : "ERD"}
        </TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = domainDiaMarks[student.rollNo]
                  ? domainDiaMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.domainDia}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(student.rollNo, e.target.value, "domainDia")
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={5}>
          <TextareaAutosize
            minRows={26}
            value={designRemarks}
            onChange={e => changeRemarks(e.target.value, "designRemarks")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          {projectInfo.hasOwnProperty("dev_tech") &&
          projectInfo.dev_tech == "object oriented"
            ? "Class Diagram"
            : "Data Flow Diagram"}
        </TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.classDia}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={classDiaMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "classDia")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          {projectInfo.hasOwnProperty("dev_tech") &&
          projectInfo.dev_tech == "object oriented"
            ? "Sequence Diagram"
            : "State Transition Diagram"}
        </TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.sequenceDia}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={sequenceDiaMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "sequenceDia")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          {projectInfo.hasOwnProperty("dev_tech") &&
          projectInfo.dev_tech == "object oriented"
            ? "State Chart Diagram"
            : "Architectural Diagram"}
        </TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.stateChartDia}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={stateChartDiaMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "stateChartDia")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          {projectInfo.hasOwnProperty("dev_tech") &&
          projectInfo.dev_tech == "object oriented"
            ? "Collaboration Diagram"
            : "Component Diagram"}
        </TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={inputError.collabDia}
                  key={student.rollNo}
                  style={{ width: "6rem", marginRight: "1rem" }}
                  value={collabDiaMarks[student.rollNo]}
                  onChange={e =>
                    changeMarks(student.rollNo, e.target.value, "collabDia")
                  }
                />
              ))
            : null}
        </TableCell>
      </TableRow>

      {/* Next Section */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Prototype</Typography>
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
        <TableCell>Partially Working System</TableCell>
        <TableCell>10</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = sysPrototypeMarks[student.rollNo]
                  ? sysPrototypeMarks[student.rollNo]
                  : 0;
                return (
                  <TextField
                    error={inputError.sysPrototype}
                    key={student.rollNo}
                    style={{ width: "6rem", marginRight: "1rem" }}
                    value={value}
                    onChange={e =>
                      changeMarks(
                        student.rollNo,
                        e.target.value,
                        "sysPrototype"
                      )
                    }
                  />
                );
              })
            : null}
        </TableCell>
        <TableCell>
          <TextareaAutosize
            minRows={8}
            value={sysRemarks}
            onChange={e => changeRemarks(e.target.value, "sysRemarks")}
          />
        </TableCell>
      </TableRow>
      {/* Total */}
      <TableRow>
        <TableCell>
          <Typography style={{ fontWeight: "bold" }}>Total</Typography>
        </TableCell>
        <TableCell style={{ fontWeight: "bold" }}>30</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <TextField
                  error={
                    totalFieldMarks[student.rollNo] > 30 ||
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
                      setTotalError(e.target.value > 30 || e.target.value < 0);
                      const total = e.target.value;
                      // const fs = total / ;
                      // const g = total / 4;
                      // const a = total / 4;
                      // const p = total / 4;
                      const fs = total / 15;
                      const sys = total / 3;

                      setFuncReqsMarks({
                        ...funcReqsMarks,
                        [student.rollNo]: fs,
                      });
                      setInterfacesMarks({
                        ...interfacesMarks,
                        [student.rollNo]: fs,
                      });
                      setUsecaseDescMarks({
                        ...usecaseDescMarks,
                        [student.rollNo]: fs,
                      });
                      setUsecaseDiaMarks({
                        ...usecaseDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setNonFuncReqsMarks({
                        ...nonFuncReqsMarks,
                        [student.rollNo]: fs,
                      });
                      setDomainDiaMarks({
                        ...domainDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setClassDiaMarks({
                        ...classDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setSequenceDiaMarks({
                        ...sequenceDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setStateChartDiaMarks({
                        ...stateChartDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setCollabDiaMarks({
                        ...collabDiaMarks,
                        [student.rollNo]: fs,
                      });
                      setSysPrototypeMarks({
                        ...sysPrototypeMarks,
                        [student.rollNo]: sys,
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
        <TableCell>30</TableCell>
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
              inputError.funcReqs ||
              inputError.interfaces ||
              inputError.usecaseDesc ||
              inputError.usecaseDia ||
              inputError.nonFuncReqs ||
              inputError.domainDia ||
              inputError.classDia ||
              inputError.sequenceDia ||
              inputError.stateChartDia ||
              inputError.collabDia ||
              inputError.sysPrototype
            }
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const D2EvaluationPage = props => {
  // const roles = localStorage.getItem(USER_ROLE);
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    !localStorage.getItem(USER_ROLE).includes("SUPERVISOR");
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [subFile, setSubFile] = useState();
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
        ` /api/deliverable/get-grp-submission`,
        { groupId: groupId, deliverableId: 2 }
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
                  D2 Evaluation: {data.group.name}
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

export default D2EvaluationPage;
