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
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

import Toast from "../components/Toast";
import AddSchedule from "../components/AddSchedule";
import EditSchedule from "../components/EditSchedule";

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
  const { groupId, setToast, setTMsg } = props;
  const [projectInfo, setProjectInfo] = useState({});

  const [inputError, setInputError] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);

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

  useEffect(() => {
    const getProjectInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/project/get-grp/${groupId}`
        );
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
  }, [evalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/evaluation/d2-evaluation",
          { groupId: groupId }
        );
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
    setInputError({});
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
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-d2-evaluation",
        data
      );
      console.log(res.data);
      setTMsg("Marks has been updated successfully");
      setToast(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
  // const roles = localStorage.getItem("USER_ROLE");
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [subFile, setSubFile] = useState();
  const history = useHistory();
  const data = history.location.state;
  console.log(data);
  const groupId = data.id;
  // const params = useParams();
  // const deliverableId = params.id;

  useEffect(() => {
    const getDeliverableData = async () => {
      const response = await axios.post(
        `http://localhost:5000/api/deliverable/get-grp-submission`,
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

  const downloadTemplateFile = async e => {
    e.preventDefault();
    let url = "http://localhost:5000/" + subFile;
    console.log(url);
    let win = window.open(url, "_blank");
    win.focus();
  };

  return (
    <>
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}

      <ContainerFluid maxWidth="lg">
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4">D2 Evaluation: {data.name}</Typography>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                groupId={data.id}
                setToast={setShowToast}
                setTMsg={setToastMessage}
              />
            )}
          />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default D2EvaluationPage;
