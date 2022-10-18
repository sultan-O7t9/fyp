import { useRef, useState } from "react";
import ReactToPdf from "react-to-pdf";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
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
  const { groupId } = props;

  const [projectInfo, setProjectInfo] = useState({});

  const [totalMarks, setTotalMarks] = useState([]);
  const [grades, setGrades] = useState([]);

  //   Proposal
  const [remarks, setRemarks] = useState("");

  const [existingSystemMarks, setExistingSystemMarks] = useState({});
  const [architectureMarks, setArchitectureMarks] = useState({});
  const [pptSkillsMarks, setPptSkillsMarks] = useState({});
  const [goalsMarks, setGoalsMarks] = useState({});

  const [proposalEvalData, setProposalEvalData] = useState({});

  //   D2
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

  // D3
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

  const [d3EvalData, setD3EvalData] = useState({});

  // Supervisor
  const [supEvaluationData, setSupEvaluationData] = useState({});
  const [supMarks, setSupMarks] = useState("");
  const [supRemarks, setSupRemarks] = useState("");

  // PMO
  const [pmoEvaluationData, setPmoEvaluationData] = useState({});
  const [pmoMarks, setPmoMarks] = useState("");
  const [pmoRemarks, setPmoRemarks] = useState("");

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
  }, [
    evalData,
    groupId,
    d3EvalData,
    proposalEvalData,
    supEvaluationData,
    pmoEvaluationData,
  ]);

  //Proposal

  useEffect(() => {
    if (!proposalEvalData.remarks) return;
    setRemarks(proposalEvalData.remarks);
  }, [proposalEvalData]);

  useEffect(() => {
    if (!proposalEvalData.students) return;
    const students = proposalEvalData.students;
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
  }, [proposalEvalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "/api/evaluation/proposal-evaluation",
          { groupId: groupId }
        );
        console.log(response.data);
        setProposalEvalData(response.data.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  //D2
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

  // D3
  useEffect(() => {
    if (!d3EvalData.remarks) return;

    setCodeRemarks(d3EvalData.remarks.codeRemarks);
    setTestRemarks(d3EvalData.remarks.testRemarks);
    setOverallRemarks(d3EvalData.remarks.overallRemarks);
  }, [d3EvalData]);

  useEffect(() => {
    if (!d3EvalData.students) return;
    const students = d3EvalData.students;

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
  }, [d3EvalData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post("/api/evaluation/d3-evaluation", {
          groupId: groupId,
        });
        console.log(response.data);
        setD3EvalData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  // Supervisor & PMO
  useEffect(() => {
    if (supEvaluationData.remarks) setSupRemarks(supEvaluationData.remarks);
  }, [supEvaluationData]);
  useEffect(() => {
    if (pmoEvaluationData.remarks) setPmoRemarks(pmoEvaluationData.remarks);
  }, [pmoEvaluationData]);

  useEffect(() => {
    if (!supEvaluationData.students) return;
    const students = supEvaluationData.students;
    const marks = {};
    students.forEach(student => {
      marks[student.rollNo] = student.marks_seven = student.marks_eight;
    });
    setSupMarks(marks);
    setTotalMarks(marks);
    console.log(marks);
  }, [supEvaluationData]);
  useEffect(() => {
    if (!pmoEvaluationData.students) return;
    const students = pmoEvaluationData.students;
    const marks = {};
    students.forEach(student => {
      marks[student.rollNo] = student.marks_seven + student.marks_eight;
    });
    setPmoMarks(marks);
  }, [pmoEvaluationData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post("/api/evaluation/sup-evaluation", {
          groupId: groupId,
        });
        console.log(response.data);
        setSupEvaluationData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post("/api/evaluation/pmo-evaluation", {
          groupId: groupId,
        });
        console.log(response.data);
        setPmoEvaluationData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  useEffect(() => {
    if (!supEvaluationData.students) return;
    if (!pmoEvaluationData.students) return;
    if (!evalData.students) return;
    if (!d3EvalData.students) return;
    if (!proposalEvalData.students) return;

    const students = evalData.students.map(student => student.rollNo);
    let total = {};

    // proposalEvalData.students.map(student => {
    //     let total = 0;
    //     for (const key in student) {
    //       if (key == "rollNo") continue;
    //       total += student[key];
    //     }
    const pT = {};
    proposalEvalData.students.forEach(student => {
      let total = 0;
      for (const key in student) {
        if (key == "rollNo") continue;
        console.log(key, student[key]);
        total += student[key];
      }
      pT[student.rollNo] = total;
    });

    const d2T = {};
    evalData.students.forEach(student => {
      let total = 0;
      for (const key in student) {
        if (key == "rollNo") continue;
        console.log(key, student[key]);
        total += student[key];
      }
      d2T[student.rollNo] = total;
    });

    const d3T = {};
    d3EvalData.students.forEach(student => {
      let total = 0;
      for (const key in student) {
        if (key == "rollNo") continue;
        console.log(key, student[key]);
        total += student[key];
      }
      d3T[student.rollNo] = total;
    });

    const sT = {};
    supEvaluationData.students.forEach(student => {
      let total = 0;
      for (const key in student) {
        if (key == "rollNo") continue;
        console.log(key, student[key]);
        total += student[key];
      }
      sT[student.rollNo] = total;
    });

    const pmoT = {};
    pmoEvaluationData.students.forEach(student => {
      let total = 0;
      for (const key in student) {
        if (key == "rollNo") continue;
        console.log(key, student[key]);
        total += student[key];
      }
      pmoT[student.rollNo] = total;
    });
    const totalObj = {};
    for (const key in pT) {
      totalObj[key] = pT[key] + sT[key] + d2T[key] + d3T[key] + pmoT[key];
    }
    console.log(totalObj);
    setTotalMarks(totalObj);

    const gradeObj = {};
    for (const key in totalObj) {
      const r = totalObj[key];
      if (r >= 170) gradeObj[key] = "A+";
      else if (r >= 160) gradeObj[key] = "A";
      else if (r >= 150) gradeObj[key] = "B+";
      else if (r >= 140) gradeObj[key] = "B";
      else if (r >= 130) gradeObj[key] = "B-";
      else if (r >= 120) gradeObj[key] = "C+";
      else if (r >= 110) gradeObj[key] = "C";
      else if (r >= 100) gradeObj[key] = "D";
      else gradeObj[key] = "F";
    }
    console.log(gradeObj);
    setGrades(gradeObj);
  }, [
    evalData,
    d3EvalData,
    supEvaluationData,
    pmoEvaluationData,
    proposalEvalData,
  ]);

  return (
    <>
      {/* Proposal */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Deliverable 01</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Proposal Document</Typography>
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
          {proposalEvalData.students && proposalEvalData.students.length
            ? proposalEvalData.students.map(student => {
                const value = existingSystemMarks[student.rollNo]
                  ? existingSystemMarks[student.rollNo]
                  : 0;
                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={4}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {remarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Well defined goal & objective</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {proposalEvalData.students && proposalEvalData.students.length
            ? proposalEvalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {goalsMarks[student.rollNo]}
                </Typography>
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Conceptual Application/ Architecture</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {proposalEvalData.students && proposalEvalData.students.length
            ? proposalEvalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {architectureMarks[student.rollNo]}
                </Typography>
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Presentation Skills</TableCell>
        <TableCell>5</TableCell>
        <TableCell>
          {proposalEvalData.students && proposalEvalData.students.length
            ? proposalEvalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {pptSkillsMarks[student.rollNo]}
                </Typography>
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>20</TableCell>
        <TableCell>
          {proposalEvalData.students && proposalEvalData.students.length
            ? proposalEvalData.students.map(student => {
                let total = 0;
                for (const key in student) {
                  if (key == "rollNo") continue;
                  total += student[key];
                }

                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {total}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>

      {/* D2 */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Deliverable 02</Typography>
        </TableCell>
      </TableRow>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={5}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {reqRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Interfaces</TableCell>
        <TableCell>2</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {interfacesMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {usecaseDescMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {usecaseDiaMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {nonFuncReqsMarks[student.rollNo]}
                </Typography>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={5}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {designRemarks}
          </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {classDiaMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {sequenceDiaMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {stateChartDiaMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {collabDiaMarks[student.rollNo]}
                </Typography>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {sysRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>30</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                let total = 0;
                for (const key in student) {
                  if (key == "rollNo") continue;
                  total += student[key];
                }

                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {total}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>

      {/* D3 */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Deliverable 03</Typography>
        </TableCell>
      </TableRow>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={2}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {codeRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Run time code Modification</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {codeModifyMarks[student.rollNo]}
                </Typography>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={2}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {testRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Test Case Design</TableCell>
        <TableCell>15</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {testCaseMarks[student.rollNo]}
                </Typography>
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
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={4}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {overallRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>User Manual</TableCell>
        <TableCell>10</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => (
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {userManMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {stdTempMarks[student.rollNo]}
                </Typography>
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
                <Typography
                  key={student.rollNo}
                  style={{
                    width: "6rem",
                    marginRight: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {skillMarks[student.rollNo]}
                </Typography>
              ))
            : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>90</TableCell>
        <TableCell>
          {d3EvalData.students && d3EvalData.students.length
            ? d3EvalData.students.map(student => {
                let total = 0;
                for (const key in student) {
                  if (key == "rollNo") continue;
                  total += student[key];
                }

                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {total}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
      {/*  */}

      {/* Supervisor */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Supervisor</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Project Progress, Meetings</Typography>
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
        <TableCell>{""}</TableCell>
        <TableCell>40</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = supMarks[student.rollNo]
                  ? supMarks[student.rollNo]
                  : 0;
                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={1}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {supRemarks}
          </Typography>
        </TableCell>
      </TableRow>

      {/* PMO */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Project Management Office</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Project Progress, Meetings</Typography>
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
        <TableCell>{""}</TableCell>
        <TableCell>20</TableCell>
        <TableCell>
          {evalData.students && evalData.students.length
            ? evalData.students.map(student => {
                const value = pmoMarks[student.rollNo]
                  ? pmoMarks[student.rollNo]
                  : 0;
                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {value}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell rowSpan={1}>
          <Typography
            style={{
              width: "6rem",
              marginRight: "1rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {pmoRemarks}
          </Typography>
        </TableCell>
      </TableRow>
      {/* TOTAL */}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h4">Total</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4}>
          <Typography variant="h6">Marks</Typography>
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
        <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>200</TableCell>
        <TableCell>
          {d3EvalData.students && d3EvalData.students.length
            ? d3EvalData.students.map(student => {
                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {totalMarks[student.rollNo]}
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ fontWeight: "bold" }}>Percentage</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>100%</TableCell>
        <TableCell>
          {d3EvalData.students && d3EvalData.students.length
            ? d3EvalData.students.map(student => {
                return (
                  <Typography
                    key={student.rollNo}
                    style={{
                      width: "6rem",
                      fontWeight: "bold",
                      marginRight: "1rem",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {(totalMarks[student.rollNo] / 200) * 100} %
                  </Typography>
                );
              })
            : null}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
      {/*  */}
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
    </>
  );
};
const MainComponent = props => {
  const { data } = props;

  return (
    <Main styles={{ padding: "1.5rem" }}>
      <Box
        sx={{ marginBottom: "3rem" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h4">Detailed Report {data.name}</Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>
        </Box>
      </Box>
      <DataTable
        DataHead={DataHead}
        DataBody={() => <DataBody groupId={data.id} />}
      />
    </Main>
  );
};

const DetailedReport = props => {
  // const roles = localStorage.getItem(USER_ROLE);
  // const [file, setFile] = useState({});
  // const [name, setName] = useState("");
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();
  const data = history.location.state;
  const linkRef = useRef(null);
  const rptRef = useRef(null);

  //   useEffect(() => {
  //     console.log(rptRef.current);
  //   }, []);
  // const params = useParams();
  // const deliverableId = params.id;

  //   useEffect(() => {
  //     const getDeliverableData = async () => {
  //       const response = await axios.post(
  //         ` /api/deliverable/get-grp-submission`,
  //         { groupId: data.id, deliverableId: 2 }
  //       );
  //       console.log(response.data.versions.pop());
  //       const file = response.data.versions.pop();
  //       setDeliverableData({ title: file.name, template: file.name });
  //     };
  //     getDeliverableData();
  //   }, [data]);

  //   const downloadTemplateFile = async e => {
  //     e.preventDefault();
  //     let url = " /" + deliverableData.template;
  //     console.log(url);
  //     let win = window.open(url, "_blank");
  //     win.focus();
  //   };

  const options = {
    orientation: "portrait",
    unit: "in",
    format: [39.00390625, 12],
  };

  return (
    <>
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}

      <ContainerFluid maxWidth="lg">
        <div id="thistopdf" ref={rptRef}>
          <MainComponent data={data} />
        </div>
        <div style={{ padding: "8rem 0", paddingTop: "2rem" }}>
          {/* <Button variant="contained" onClick={printToPDF}>
            Download
          </Button>
          <a style={{ display: "none" }} ref={linkRef} id="link">
            Download
          </a> */}
          <ReactToPdf
            targetRef={rptRef}
            options={options}
            filename={`${data.name}_Detailed_Report.pdf`}
          >
            {({ toPdf }) => (
              <Button variant="contained" onClick={toPdf}>
                Download
              </Button>
            )}
          </ReactToPdf>
        </div>
      </ContainerFluid>
    </>
  );
};

export default DetailedReport;
