import React from "react";
import { useHistory } from "react-router-dom";
import { Backdrop, Button } from "@mui/material";
import { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../assets/styles/btn.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useEffect } from "react";

export const FinalMarksReportComponent = props => {
  const { data, setDisplay, setDisabled } = props;
  const rptRef = useRef(null);
  console.log(data);
  useEffect(() => {
    if (data && data.length) {
      rptRef.current.click();
      setDisplay(false);
    }
  }, [setDisplay]);

  const tDataStyles = {
    border: "1px solid rgb(57, 56, 56)",
    padding: "0.2rem",
  };
  const thStyles = {
    backgroundColor: "rgb(57, 56, 56)",
    padding: "6rem 4rem",
    color: "rgb(103, 163, 216)",
    fontStyle: "italic",
  };
  const containerStyles = {
    position: "fixed",
    zIndex: 100,
    backgroundColor: "white",
  };

  return (
    <div id="container">
      <div className="exp-container">
        <Button
          style={{ display: "none" }}
          ref={rptRef}
          variant="contained"
          onClick={() => {
            setDisabled(true);
            const btn = document.getElementById("test-table-xls-button");
            console.log(btn);
            btn.click();
            setDisabled(false);
          }}
        >
          Exp
        </Button>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="exp-btn"
          table="table-to-xls-final-marks"
          filename={"Final Marks Report"}
          sheet="Groups"
          buttonText="Export as Excel"
        />
      </div>
      <div style={{ display: "none" }}>
        <table
          id="table-to-xls-final-marks"
          style={{
            borderCollapse: "collapse",
            fontFamily: "sans-serif",
            boxSizing: "content-box",
            border: "1px solid rgb(57, 56, 56)",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyles }}>Group No.</th>
              <th style={{ ...thStyles }}>Project Title</th>
              <th style={{ ...thStyles }}>Supervisor</th>
              <th style={{ ...thStyles }}>Student Name</th>
              <th style={{ ...thStyles }}>Roll no.</th>
              <th style={{ ...thStyles }}>External Examiners 1</th>
              <th style={{ ...thStyles }}>External Examiners 2</th>
              <th style={{ ...thStyles }}>Defense Marks (20)</th>
              <th style={{ ...thStyles }}>D2 Marks (30)</th>
              <th style={{ ...thStyles }}>Supervisor Marks (40)</th>
              <th style={{ ...thStyles }}>D3 Marks (90)</th>
              <th style={{ ...thStyles }}>PMO Marks (20)</th>
              <th style={{ ...thStyles }}>Total Marks (200)</th>
              <th style={{ ...thStyles }}>Percentage</th>
              <th style={{ ...thStyles }}>Department</th>
              <th style={{ ...thStyles }}>Class</th>
              <th style={{ ...thStyles }}>Session</th>
              <th style={{ ...thStyles }}>THESIS/ Project</th>
              <th style={{ ...thStyles }}>Credit Hour</th>
              <th style={{ ...thStyles }}>Total Marks</th>
              <th style={{ ...thStyles }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0
              ? data.map((item, index) => {
                  return (
                    <tr key={item.rollNo}>
                      <td style={{ ...tDataStyles }}>{index + 1}</td>
                      <td style={{ ...tDataStyles }}>{item.projectTitle}</td>
                      <td style={{ ...tDataStyles }}>{item.supervisor}</td>
                      <td style={{ ...tDataStyles }}>{item.name}</td>
                      <td style={{ ...tDataStyles }}>{item.rollNo}</td>
                      <td style={{ ...tDataStyles }}>{item.evaluators[0]}</td>
                      <td style={{ ...tDataStyles }}>{item.evaluators[1]}</td>
                      <td style={{ ...tDataStyles }}>{item.d1}</td>
                      <td style={{ ...tDataStyles }}>{item.d2}</td>
                      <td style={{ ...tDataStyles }}>
                        {item.supervisorEvaluation}
                      </td>
                      <td style={{ ...tDataStyles }}>{item.d2}</td>
                      <td style={{ ...tDataStyles }}>{item.pmoEvaluation}</td>
                      <td style={{ ...tDataStyles }}>{item.total}</td>
                      <td style={{ ...tDataStyles }}>{item.percentage}</td>
                      <td style={{ ...tDataStyles }}>{item.department}</td>
                      <td style={{ ...tDataStyles }}>{item.class}</td>
                      <td style={{ ...tDataStyles }}>{item.session}</td>
                      <td style={{ ...tDataStyles }}>PROJECT</td>
                      <td style={{ ...tDataStyles }}>6</td>
                      <td style={{ ...tDataStyles }}>200</td>
                      <td style={{ ...tDataStyles }}>
                        {new Date().toDateString()}
                      </td>
                    </tr>
                  );
                })
              : null}

            <tr>
              <td style={{ ...tDataStyles }}>1</td>
              <td style={{ ...tDataStyles }}>PMO System</td>
              <td style={{ ...tDataStyles }}>Ejaz</td>
              <td style={{ ...tDataStyles }}>Sultan</td>
              <td style={{ ...tDataStyles }}>18094198-079</td>
              <td style={{ ...tDataStyles }}>Gulsher</td>
              <td style={{ ...tDataStyles }}>Adeel</td>
              <td style={{ ...tDataStyles }}>D1</td>
              <td style={{ ...tDataStyles }}>D2</td>
              <td style={{ ...tDataStyles }}>Sup</td>
              <td style={{ ...tDataStyles }}>D3</td>
              <td style={{ ...tDataStyles }}>PMO</td>
              <td style={{ ...tDataStyles }}>Total</td>
              <td style={{ ...tDataStyles }}>Percent</td>
              <td style={{ ...tDataStyles }}>Department</td>
              <td style={{ ...tDataStyles }}>Class</td>
              <td style={{ ...tDataStyles }}>Session</td>
              <td style={{ ...tDataStyles }}>PROJECT</td>
              <td style={{ ...tDataStyles }}>6</td>
              <td style={{ ...tDataStyles }}>200</td>
              <td style={{ ...tDataStyles }}>{new Date().toDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FinalMarksReport = ({
  data,
  setDisplay,
  deliverableId,
  setDisabled,
  setPageDims,
}) => {
  console.log("data", data);
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <FinalMarksReportComponent
        data={data}
        setDisabled={setDisabled}
        // setPageDims={setPageDims}
        setDisplay={setDisplay}
        // deliverableId={deliverableId}
      />
    </Backdrop>
  );
};

export default FinalMarksReport;
