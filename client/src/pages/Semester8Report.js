import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Backdrop, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

const Semester8ReportComponent = props => {
  const { data, setDisplay, setDisabled } = props;
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
    pdf.save("Semester_8_Evaluation_Form.pdf");
    setDisabled(false);
  };

  // const [projectInfo, setProjectInfo] = useState({});

  // const [projectType, setProjectType] = useState("");

  useEffect(() => {
    if (data && data.length) {
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
                      Final Year Project Evaluation Form (8th Semester)
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
                          <span style={{ fontWeight: "bold" }}>Code </span>{" "}
                          (Sub-section Total: 30)
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Complete running project in compilance with
                          requirement and design document
                        </td>
                        <td style={tdStyles}>15</td>
                        <td style={tdStyles}>{student.d3Eval.runProject}</td>
                        <td style={tdStyles} rowSpan={2}>
                          {/* remarks */}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Run time code modification & understanding
                        </td>
                        <td style={tdStyles}>15</td>
                        <td style={tdStyles}>{student.d3Eval.codeModify}</td>
                      </tr>
                      {/* TESTING */}
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>Testing </span>{" "}
                          (Sub-section Total: 20)
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Test Plan</td>
                        <td style={tdStyles}>5</td>
                        <td style={tdStyles}>{student.d3Eval.testPlan}</td>
                        <td style={tdStyles} rowSpan={2}>
                          {/* remarks */}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>
                          Test Case Design and Implementation
                        </td>
                        <td style={tdStyles}>15</td>
                        <td style={tdStyles}>{student.d3Eval.testCase}</td>
                      </tr>
                      {/* Overall System & Documentation */}
                      <tr>
                        <td style={tdStyles} colSpan={4}>
                          <span style={{ fontWeight: "bold" }}>
                            Overall System and Documentation{" "}
                          </span>{" "}
                          (Sub-section Total: 40)
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Project presentation</td>
                        <td style={tdStyles}>15</td>
                        <td style={tdStyles}>{student.d3Eval.projectPpt}</td>
                        <td style={tdStyles} rowSpan={2}>
                          {/* remarks */}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>User Manual</td>
                        <td style={tdStyles}>10</td>
                        <td style={tdStyles}>{student.d3Eval.userMan}</td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Standard Template</td>
                        <td style={tdStyles}>5</td>
                        <td style={tdStyles}>{student.d3Eval.stdTemp}</td>
                      </tr>
                      <tr>
                        <td style={tdStyles}>Overall skill set</td>
                        <td style={tdStyles}>10</td>
                        <td style={tdStyles}>{student.d3Eval.skill}</td>
                      </tr>
                      {/* Total */}
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
                        <td style={{ ...tdStyles, width: "12%" }}></td>
                        <td style={{ ...tdStyles, width: "12%" }}>
                          {student.supEval}
                        </td>
                        <td style={{ ...tdStyles, width: "26%" }} rowSpan={1}>
                          {/* remarks */}
                        </td>
                      </tr>

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
                        <td style={{ ...tdStyles, width: "12%" }}></td>
                        <td style={{ ...tdStyles, width: "12%" }}>
                          {student.pmoEval}
                        </td>
                        <td style={{ ...tdStyles, width: "26%" }} rowSpan={2}>
                          {/* remarks */}
                        </td>
                      </tr>

                      <tr>
                        <td style={tdStyles}>
                          <span style={{ fontWeight: "bold" }}>
                            Internal Marks
                          </span>
                        </td>
                        <td style={{ ...tdStyles, width: "12%" }}>120</td>
                        <td style={{ ...tdStyles, width: "12%" }}>
                          {student.total}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ margin: "4px" }}>
                    <p
                      style={{
                        ...infoStyles,
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      Evaluator 1 (Name, Signature &
                      Date):_________________________________
                    </p>
                    <p
                      style={{
                        ...infoStyles,
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      Evaluator 2 (Name, Signature &
                      Date):_________________________________
                    </p>
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
                    Project Management Office (PMO-SE), C & IT Evening Program
                    Marghzar Campus, University of Gujrat.
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

const Semester8Report = props => {
  const { data, setDisplay, setDisabled } = props;
  console.log("data", data);
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Semester8ReportComponent
        data={data}
        setDisabled={setDisabled}
        // setPageDims={setPageDims}
        setDisplay={setDisplay}
        // deliverableId={deliverableId}
      />
    </Backdrop>
  );
};

export default Semester8Report;
