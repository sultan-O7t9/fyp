import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Backdrop, Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import uogImg from "../assets/Picture1.jpg";

const FinalResultPerformaComponent = props => {
  const { data, setDisplay, setDisabled } = props;
  console.log(data);
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
    rptRef.current.click();
    setDisplay(false);
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
      <div id="containerpt">
        {data && data.length
          ? data.map(student => {
              return (
                <div
                  className="pg"
                  style={{
                    boxSizing: "border-box",
                    margin: "0",
                    width: "595.275590551px",
                    height: "842.8897637821px",
                    // width: "645px",
                    // height: "842px",
                    // backgroundColor: "#ddd",
                    padding: "36px",
                    paddingBottom: 0,
                    paddingTop: "2px",
                  }}
                >
                  <div id="content">
                    <div>
                      <img
                        style={{ height: "40px", opacity: "0.8" }}
                        src={uogImg}
                        alt="uog"
                      />
                    </div>
                    <div>
                      <h1
                        style={{
                          fontSize: "18px",
                          textAlign: "center",
                          fontFamily: "sans-serif",
                          fontWeight: "black",
                          textDecoration: "underline",
                        }}
                      >
                        UNIVERSITY OF GUJRAT <br />
                        FINAL EVALUATION OF THESIS/PROJECT
                      </h1>
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <table>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              DEPARTMENT NAME:
                            </td>
                            <td>{student.department}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              STUDENT NAME:
                            </td>
                            <td>{student.name}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              ROLL NO:
                            </td>
                            <td>{student.rollNo}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              CLASS:
                            </td>
                            <td>{student.class}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              SESSION:
                            </td>
                            <td>{student.session}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              THESIS/PROJECT:
                            </td>
                            <td>Project</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              TOPIC OF PROJECT:
                            </td>
                            <td>{student.projectTitle}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              CREDIT HOURS:
                            </td>
                            <td>6</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              TOTAL MARKS:
                            </td>
                            <td>200</td>
                          </tr>

                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              SUPERVISOR:
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                paddingTop: "10px",
                              }}
                            >
                              <p style={{ fontWeight: "bold" }}>
                                {student.supervisor}
                              </p>
                              <p style={{ fontSize: "14px" }}>
                                Faculty of Computing and IT, UOG
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                width: "50%",
                              }}
                            >
                              Date:
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                paddingTop: "10px",
                              }}
                            >
                              {new Date().toDateString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                paddingBottom: "10px",
                              }}
                              colSpan={4}
                            >
                              EXTERNAL EXAMINERS
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                paddingBottom: "2px",
                              }}
                              colSpan={4}
                            >
                              {student.evaluators[0].name}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                                paddingBottom: "2px",
                                width: "18%",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Designation
                              </span>
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid black",
                                textAlign: "center",
                                width: "42%",
                              }}
                            >
                              {student.evaluators[0].designation}
                            </td>

                            <td
                              style={{
                                fontSize: "12px",
                                paddingBottom: "2px",
                                width: "12%",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Signature
                              </span>
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid black",
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                paddingBottom: "2px",
                              }}
                              colSpan={4}
                            >
                              {student.evaluators[1].name}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                                paddingBottom: "2px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  width: "18%",
                                  marginRight: "16px",
                                }}
                              >
                                Designation
                              </span>
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid black",
                                textAlign: "center",
                                width: "42%",
                              }}
                            >
                              {student.evaluators[1].designation}
                            </td>

                            <td
                              style={{
                                fontSize: "12px",
                                paddingBottom: "2px",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Signature
                              </span>
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid black",
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                paddingTop: "20px",
                              }}
                            >
                              MARKS OBTAINED BY THE STUDENT
                            </td>
                            <td
                              style={{
                                paddingTop: "20px",
                                borderBottom: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              {student.total}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              %AGE MARKS OBTAINED BY THE STUDENT
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              {student.percentage} %
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                paddingTop: "20px",
                              }}
                            >
                              __________________________
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                paddingTop: "20px",
                              }}
                            >
                              __________________________
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{ fontWeight: "bold", fontSize: "14px" }}
                            >
                              Coordinator
                            </td>
                            <td
                              style={{ fontWeight: "bold", fontSize: "14px" }}
                            >
                              Project Management Officer
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              C & IT Evening Programs
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              SE - Evening Programs
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              Marghazar Campus
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              Marghazar Campus
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              University Of Gujrat
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              University Of Gujrat
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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

const FinalResultPerforma = props => {
  const { data, setDisplay, setDisabled } = props;
  console.log("data", data);
  // return (
  //   <FinalResultPerformaComponent
  //     data={data}
  //     // setPageDims={setPageDims}
  //     setDisplay={setDisplay}
  //     // deliverableId={deliverableId}
  //   />
  // );
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <FinalResultPerformaComponent
        setDisabled={setDisabled}
        data={data}
        // setPageDims={setPageDims}
        setDisplay={setDisplay}
        // deliverableId={deliverableId}
      />
    </Backdrop>
  );
};

export default FinalResultPerforma;
