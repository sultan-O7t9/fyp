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
  const [remarks, setRemarks] = useState("");

  const [inputError, setInputError] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [existingSystemMarks, setExistingSystemMarks] = useState({});
  const [architectureMarks, setArchitectureMarks] = useState({});
  const [pptSkillsMarks, setPptSkillsMarks] = useState({});
  const [goalsMarks, setGoalsMarks] = useState({});

  const [evalData, setEvalData] = useState({});

  useEffect(() => {
    if (!evalData.remarks) return;
    setRemarks(evalData.remarks);
  }, [evalData]);

  useEffect(() => {
    if (!evalData.students) return;
    const students = evalData.students;
    const esMarks = {};
    const archMarks = {};
    const pptMarks = {};
    const gMarks = {};
    students.forEach(student => {
      esMarks[student.rollNo] = student.existingSystem;
      archMarks[student.rollNo] = student.architecture;
      pptMarks[student.rollNo] = student.pptSkills;
      gMarks[student.rollNo] = student.goals;
    });
    setExistingSystemMarks(esMarks);
    setArchitectureMarks(archMarks);
    setPptSkillsMarks(pptMarks);
    setGoalsMarks(gMarks);
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

  const changeMarks = (rollNo, marks, type) => {
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
                        "existingSystem"
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
  // const roles = localStorage.getItem("USER_ROLE");
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [subFile, setSubFile] = useState();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
              <Typography variant="h4">
                Proposal Evaluation: {data.name}
              </Typography>
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
                  groupId={data.id}
                  setToast={setShowToast}
                  setTMsg={setToastMessage}
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
