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
  const { groupId, setToast, setTMsg } = props;
  const [remarks, setRemarks] = useState("");

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

  const [runProjectMarks, setRunProjectMarks] = useState({});
  const [codeModifyMarks, setCodeModifyMarks] = useState({});
  const [testPlanMarks, setTestPlanMarks] = useState({});
  const [testCaseMarks, setTestCaseMarks] = useState({});
  const [projectPptMarks, setProjectPptMarks] = useState({});
  const [userManMarks, setUserManMarks] = useState({});
  const [stdTempMarks, setStdTempMarks] = useState({});
  const [skillMarks, setSkillMarks] = useState({});

  const [reqRemarks, setReqRemarks] = useState("");
  const [designRemarks, setDesignRemarks] = useState("");
  const [sysRemarks, setSysRemarks] = useState("");

  const [codeRemarks, setCodeRemarks] = useState("");
  const [testRemarks, setTestRemarks] = useState("");
  const [overallRemarks, setOverallRemarks] = useState("");

  const [evalData, setEvalData] = useState({});

  useEffect(() => {
    if (!evalData.remarks) return;

    setCodeRemarks(evalData.remarks.codeRemarks);
    setTestRemarks(evalData.remarks.testRemarks);
    setOverallRemarks(evalData.remarks.overallRemarks);
  }, [evalData]);

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

    students.forEach(student => {
      rPMarks[student.rollNo] = student.runProject;
      cMMarks[student.rollNo] = student.codeModify;
      tPMarks[student.rollNo] = student.testPlan;
      tCMarks[student.rollNo] = student.testCase;
      pPMarks[student.rollNo] = student.projectPpt;
      uMMarks[student.rollNo] = student.userMan;
      sTMarks[student.rollNo] = student.stdTemp;
      sMarks[student.rollNo] = student.skill;
    });
    setRunProjectMarks(rPMarks);
    setCodeModifyMarks(cMMarks);
    setTestPlanMarks(tPMarks);
    setTestCaseMarks(tCMarks);
    setProjectPptMarks(pPMarks);
    setUserManMarks(uMMarks);
    setStdTempMarks(sTMarks);
    setSkillMarks(sMarks);
  }, [evalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/evaluation/d3-evaluation",
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
    setBtnDisabled(false);
    setInputError({});

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
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-d3-evaluation",
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
  // const roles = localStorage.getItem("USER_ROLE");
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [subFile, setSubFile] = useState();
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
                D3 Evaluation: {data ? data.name : ""}
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

export default D3EvaluationPage;
