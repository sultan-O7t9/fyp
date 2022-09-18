import React, { useEffect, useRef } from "react";
// import jsPDF from "jspdf";
import jsPDF from "jspdf";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import autoTable from "jspdf-autotable";
import uogImg from "../assets/Picture1.jpg";
import html2canvas from "html2canvas";
import { Backdrop } from "@mui/material";

const TBL_DATA = [
  {
    projectTitle:
      "Gujrat Auto Spare Parts Online Shopping App & Management System (GASP)",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
  {
    projectTitle: "PMO Management System",
    members: [
      { rollNo: "18094198-079", name: "Sultan Muhammad" },
      { rollNo: "18094198-089", name: "Ali Ikram" },
      { rollNo: "18094198-048", name: "Ranya Muqadas" },
    ],
  },
];

const CoverLetterReportComponent = ({ data, setDisplay, setDisabled }) => {
  const rptRef = useRef(null);

  useEffect(() => {
    if (data && data.length) {
      rptRef.current.click();
      setDisplay(false);
    }
  }, [data]);

  const printDocument = () => {
    //const input = document.getElementById('divToPrint');
    setDisabled(true);
    const doc = new jsPDF();

    //get table html
    const pdfTable = document.getElementById("divToPrint");
    //html to pdf format
    var html = htmlToPdfmake(
      pdfTable.innerHTML
      //   , {
      //   imagesByReference: true,
      // }
    );

    const documentDefinition = {
      content: html,
      // , images: html.images
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).download("COVER LETTER.pdf");
    setDisabled(false);
  };
  // const generatePDF = async () => {
  //   const doc = new jsPDF();
  //   const canvas = await html2canvas(document.getElementById("content"));
  //   doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
  //   console.log(doc.internal.pageSize.getWidth());
  //   console.log(doc.internal.pageSize.getHeight());
  //   autoTable(doc, { theme: "grid", html: "#my-table" });
  //   doc.save("table.pdf");
  // };

  return (
    <div
      id="divToPrint"
      style={{
        boxSizing: "border-box",
        margin: "0",
        // width: "595.275590551px",
        width: "642px",
        // height: "841.8897637821px",
        // height: "842px",
        backgroundColor: "#ddd",
        padding: "36px",
        paddingBottom: 0,
        paddingTop: "10px",
      }}
    >
      <div id="content">
        <div
          style={{
            // display: "flex",
            // alignItems: "center",
            width: "100%",
            // justifyContent: "center",
          }}
        >
          <div>
            {/* <img
              style={{ height: "80px", position: "absolute" }}
              src={uogImg}
              alt="uog img"
            /> */}
            {/* <img
              style={{ height: "80px", opacity: "0.8" }}
              src={uogImg}
              alt="uog img"
            /> */}
          </div>
          <div
            style={{
              marginLeft: "10px",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                color: "blue",
                // fontFamily: "serif",
                fontSize: "27px",
              }}
            >
              UNIVERSITY OF GUJRAT
            </h3>
            <p style={{ fontSize: "13px", textAlign: "center" }}>
              Evening Programs C&IT, Marghazar Campus Gujrat
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "15px" }}>No.UOG/HOD-Eve/C&IT/</p>
          <p style={{ fontSize: "15px" }}>
            Date: {" " + new Date().toDateString()}
          </p>
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              // fontFamily: "sans-serif",
              fontSize: "14px",
            }}
          >
            <b>CONTROLLER OF EXAMINATION</b>,<br />
            UNIVERSITY OF GUJRAT,
          </p>
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              // fontFamily: "sans-serif",
              fontSize: "14px",
            }}
          >
            SUBJECT:{" "}
          </p>
          <p
            style={{
              // fontFamily: "sans-serif",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            SUBMISSION OF THE THESIS / PROJECT RESULTS OF DEPARTMENT OF C & IT
            EVENING PROGRAMS MARGHZAR CAMPUS (SOFTWARE ENGINEERING)
          </p>
        </div>
        <div>
          <p
            style={{
              // fontFamily: "sans-serif",
              textAlign: "justify",
              fontSize: "14px",
              marginTop: "16px",
              marginBottom: "8px",
            }}
          >
            Please refer to the subject cited above, the following results of
            final year Project/Thesis are being sent to your office for your
            kind information and further necessary action. List of students is
            as under.
          </p>
        </div>
      </div>
      <div>
        <table
          id="my-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            // border: "1px solid black",
            fontSize: "13px",
            // fontFamily: "sans-serif",
          }}
        >
          <tbody>
            {/* <tr>
              <td colSpan={4}>
               
              </td>
            </tr> */}
            {data && data.length
              ? data.map((row, index) => {
                  const rowSpan = row.members.length;
                  const mems = [
                    ...row.members.filter((row, index) => index != 0),
                  ];
                  // console.log(mems);
                  return (
                    <>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            width: "8%",
                            textAlign: "center",
                          }}
                          rowSpan={rowSpan}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            width: "43%",
                            margin: "2px 4px",
                            textAlign: "center",
                          }}
                          rowSpan={rowSpan}
                        >
                          {" " +
                            " " +
                            " " +
                            " " +
                            row.projectTitle +
                            " " +
                            " " +
                            " " +
                            " "}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            //   width: "45%",
                            margin: "2px 4px",
                            textAlign: "center",
                          }}
                        >
                          {row.members[0].name}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            width: "22%",
                            margin: "2px 4px",
                            textAlign: "center",
                          }}
                        >
                          {row.members[0].rollNo}
                        </td>
                      </tr>

                      {mems.map(mm => {
                        return (
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                //   width: "45%",
                                margin: "2px 4px",
                                textAlign: "center",
                              }}
                            >
                              {mm.name}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                width: "22%",
                                margin: "2px 4px",
                                textAlign: "center",
                              }}
                            >
                              {mm.rollNo}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      <button style={{ display: "none" }} ref={rptRef} onClick={printDocument}>
        Generate
      </button>
    </div>
  );
};

const CoverLetterReport = props => {
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
      <CoverLetterReportComponent
        setDisabled={setDisabled}
        data={data}
        setDisplay={setDisplay}
      />
    </Backdrop>
  );

  // return /;
};

export default CoverLetterReport;
