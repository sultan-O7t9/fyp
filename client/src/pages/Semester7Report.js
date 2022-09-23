import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Backdrop, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

const Semester7ReportComponent = props => {
  const { data, setDisplay, withMarks, setDisabled, pmoDept } = props;
  const rptRef = useRef(null);

  const generatePDF = async () => {
    setDisabled(true);
    // const tables = new Array(
    //   document.getElementById("container--rpt").children.length
    // );
    const pgs = document.getElementsByClassName("pg");
    const pages = Array.from(pgs);
    console.log(pages);
    // setPageDims({
    //   width: page.getBoundingClientRect().width ,
    //   height: page.getBoundingClientRect().height ,
    // });
    const options = {
      orientation: "portrait",
      unit: "px",
      format: [
        595.275590551, 842,
        // 695, 842,
        // 793.700787411, 1122.5196850527,
        // 645.66929134, 958.8188976399,
        // pages[0].getBoundingClientRect().width,
        // pages[0].getBoundingClientRect().height,
      ],
      hotfixes: ["px_scaling"],
    };
    const pdf = new jsPDF(options);

    await Promise.all(
      pages.map(async (page, index) => {
        pdf.setPage(index + 1);
        console.log(page);
        // const tbl = document.getElementById(table);
        const canvas = await html2canvas(page);
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
        if (index !== pages.length - 1) {
          pdf.addPage();
        }
      })
    );

    console.log(pdf);
    pdf.save("Semester_7_Evaluation_Form_.pdf");
    setDisabled(false);
  };

  // const [projectInfo, setProjectInfo] = useState({});

  // const [projectType, setProjectType] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      rptRef.current.click();
      setDisplay(false);
    }
  }, [data]);

  const infoStyles = {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: "14px",
    margin: "3px 0",
  };

  const thStyles = {
    fontFamily: "sans-serif",
    fontSize: "13px",
  };
  const tdStyles = {
    fontFamily: "sans-serif",
    padding: "0 4px",
    fontSize: "13px",
    border: "1px solid black",
  };
  return (
    <>
      <div id="container--rpt">
        {data && data.length
          ? data.map(student => {
              return (
                <div
                  className="pg"
                  style={{
                    boxSizing: "border-box",
                    margin: "0",
                    width: "595.275590551px",
                    // width: "645px",
                    height: "842.8897637821px",
                    // height: "842px",
                    // backgroundColor: "#ddd",
                    padding: "36px",
                    paddingBottom: 0,
                    paddingTop: "2px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "16px",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      Final Year Project Evaluation Form (7th Semester)
                    </h1>
                  </div>
                  {/* INFO */}
                  <div style={{ padding: "6px 0" }}>
                    <p style={infoStyles}>
                      Project Title:{" "}
                      <span style={{ fontWeight: "normal" }}>
                        {student.projectTitle}
                      </span>
                    </p>
                    <div style={{ display: "flex" }}>
                      <p style={{ ...infoStyles, width: "32%" }}>
                        Roll No:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {student.rollNo}
                        </span>
                      </p>
                      <p style={{ ...infoStyles, width: "45%" }}>
                        Student Name:
                        <span style={{ fontWeight: "normal" }}>
                          {student.name}
                        </span>
                      </p>
                      <p style={{ ...infoStyles, width: "28%" }}>
                        Degree:
                        <span style={{ fontWeight: "normal" }}>
                          {student.degree}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* PROPOSAL */}
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontSize: "13px",
                            textAlign: "center",
                            width: "50%",
                          }}
                        >
                          <p style={thStyles}>Project Deliverables</p>
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontSize: "13px",
                            textAlign: "center",
                            width: "12%",
                          }}
                        >
                          <p style={thStyles}>Marks Distribution</p>
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontSize: "13px",
                            textAlign: "center",
                            width: "12%",
                          }}
                        >
                          <p style={thStyles}>Marks Obtained</p>
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontSize: "13px",
                            textAlign: "center",
                            width: "26%",
                          }}
                        >
                          <p style={thStyles}>Remarks</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Proposal Document{" "}
                          </span>{" "}
                          (Sub-section Total: 20)
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Understanding of existing system
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>5</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.proposalEval.existingSystem : ""}
                        </td>
                        <td
                          style={{ ...tdStyles, textAlign: "center" }}
                          rowSpan={4}
                        >
                          {withMarks
                            ? student.proposalEval.existingSystem +
                              student.proposalEval.architecture +
                              student.proposalEval.goals +
                              student.proposalEval.pptSkills
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Well defined goal & objective</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>5</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.proposalEval.goals : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Conceptual Application Architecture{" "}
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>5</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.proposalEval.architecture : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Presentation Skills</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>5</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.proposalEval.pptSkills : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ margin: "4px" }}>
                    <div
                      style={{
                        ...infoStyles,
                        // fontWeight: "bold",
                        fontSize: "13px",
                        // borderBottom: "1px solid black",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <b>Evaluator 1 (Name, Signature & Date): </b>
                        {student.evaluators[0]}
                      </span>
                      {/* <span>{new Date().toLocaleDateString()}</span> */}
                    </div>
                    <div
                      style={{
                        ...infoStyles,
                        // fontWeight: "bold",
                        fontSize: "13px",
                        // borderBottom: "1px solid black",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <b>Evaluator 2 (Name, Signature & Date): </b>
                        {student.evaluators[1]}
                      </span>
                      {/* <span>{new Date().toLocaleDateString()}</span> */}
                    </div>
                  </div>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Software Requirements Specification{" "}
                          </span>{" "}
                          (Sub-section Total: 10)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyles, width: "50%" }}>
                          Functional Requirements
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          2
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks ? student.d2Eval.funcReqs : ""}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "26%",
                            textAlign: "center",
                          }}
                          rowSpan={5}
                        >
                          {withMarks
                            ? student.d2Eval.funcReqs +
                              student.d2Eval.interfaces +
                              student.d2Eval.usecaseDesc +
                              student.d2Eval.usecaseDia +
                              student.d2Eval.nonFuncReqs
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Interfaces (UI, External, H/W interface requirements)
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.interfaces : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Usecase Descriptions</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.usecaseDesc : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Usecase Diagrams</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.usecaseDia : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Non-Fucntional Attributes</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.nonFuncReqs : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Design Document{" "}
                          </span>{" "}
                          (Sub-section Total: 10)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyles, width: "50%" }}>
                          {student.projectType == "structured"
                            ? "ERD"
                            : "Domain Model"}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          2
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks ? student.d2Eval.domainDia : ""}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "26%",
                            textAlign: "center",
                          }}
                          rowSpan={5}
                        >
                          {withMarks
                            ? student.d2Eval.domainDia +
                              student.d2Eval.classDia +
                              student.d2Eval.sequenceDia +
                              student.d2Eval.stateChartDia +
                              student.d2Eval.collabDia
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          {student.projectType == "structured"
                            ? "Data Flow Diagram"
                            : "Class Diagram"}
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.classDia : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          {student.projectType == "structured"
                            ? "State Transition Diagram"
                            : "Sequence Diagram"}
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.sequenceDia : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          {student.projectType == "structured"
                            ? "Architectural Diagram"
                            : "State Chart Diagram"}
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.stateChartDia : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          {student.projectType == "structured"
                            ? "Collaboration Diagram"
                            : "Component Diagram"}
                        </td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>2</td>
                        <td style={{ ...tdStyles, textAlign: "center" }}>
                          {withMarks ? student.d2Eval.collabDia : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>Prototype </span>{" "}
                          (Sub-section Total: 10)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyles, width: "50%" }}>
                          Partially Working System (30% implementation)
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        ></td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks ? student.d2Eval.sysPrototype : ""}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "26%",
                            textAlign: "center",
                          }}
                          rowSpan={1}
                        >
                          {withMarks ? student.d2Eval.sysPrototype : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Supervisor{" "}
                          </span>{" "}
                          (Sub-section Total: 20)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyles, width: "50%" }}>
                          {" "}
                          (Meetings, Project progress)
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        ></td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks ? student.supEval : ""}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "26%",
                            textAlign: "center",
                          }}
                          rowSpan={1}
                        >
                          {withMarks ? student.supEval : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <tbody style={{ width: "100%" }}>
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Project Management Office{" "}
                          </span>{" "}
                          (Sub-section Total: 10)
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyles, width: "50%" }}>
                          (Meeting Deadlines, Attending Workshops)
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        ></td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks ? student.pmoEval : ""}
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "26%",
                            textAlign: "center",
                          }}
                          rowSpan={2}
                        >
                          {withMarks ? student.pmoEval : ""}
                        </td>
                      </tr>

                      <tr>
                        <td style={tdStyles}>
                          <span style={{ fontWeight: "bold" }}>
                            Internal Marks
                          </span>
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          80
                        </td>
                        <td
                          style={{
                            ...tdStyles,
                            width: "12%",
                            textAlign: "center",
                          }}
                        >
                          {withMarks
                            ? +(Math.round(student.total + "e+2") + "e-2")
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ margin: "4px" }}>
                    <div
                      style={{
                        ...infoStyles,
                        // fontWeight: "bold",
                        fontSize: "13px",
                        // borderBottom: "1px solid black",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <b>Evaluator 1 (Name, Signature & Date): </b>
                        {student.evaluators[0]}
                      </span>
                      {/* <span>{new Date().toLocaleDateString()}</span> */}
                    </div>
                    <div
                      style={{
                        ...infoStyles,
                        // fontWeight: "bold",
                        fontSize: "13px",
                        // borderBottom: "1px solid black",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <b>Evaluator 2 (Name, Signature & Date): </b>
                        {student.evaluators[1]}
                      </span>
                      {/* <span>{new Date().toLocaleDateString()}</span> */}
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#555",
                      fontWeight: "bold",
                      fontSize: "10px",
                      marginTop: "20px",
                      textAlign: "center",
                    }}
                  >
                    Project Management Office (PMO-{pmoDept}), C & IT Evening
                    Program Marghzar Campus, University of Gujrat.
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <Button ref={rptRef} onClick={generatePDF}>
        Generate
      </Button>
    </>
  );
};

const Semester7Report = props => {
  const { data, setDisplay, withMarks, setDisabled, pmoDept } = props;
  console.log("data", data);
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Semester7ReportComponent
        data={data}
        pmoDept={pmoDept}
        setDisabled={setDisabled}
        withMarks={withMarks}
        // setPageDims={setPageDims}
        setDisplay={setDisplay}
        // deliverableId={deliverableId}
      />
    </Backdrop>
  );
};

export default Semester7Report;
