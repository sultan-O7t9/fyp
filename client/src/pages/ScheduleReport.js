import React from "react";
import { useHistory } from "react-router-dom";
import { Backdrop, Button } from "@mui/material";
import { useRef } from "react";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useEffect } from "react";

export const ScheduleReportComponent = ({
  data,
  setDisplay,
  deliverableId,
  setPageDims,
}) => {
  const history = useHistory();
  //   const data = history.location.state;
  //   console.log(data);
  const rptRef = useRef(null);
  const uniqueDates = [...new Set(data.map(item => item.date))];
  console.log(uniqueDates);

  useEffect(() => {
    rptRef.current.click();
    setDisplay(false);
  }, []);

  const formattedData = [];

  for (let i = 0; i < uniqueDates.length; i++) {
    const filteredData = data.filter(item => item.date === uniqueDates[i]);
    const d = {
      [uniqueDates[i]]: filteredData,
    };
    formattedData.push(d);
  }
  console.log(formattedData);

  const tables = [];
  const generatePDF = async () => {
    const tbl1 = document.getElementById("tbl-exp-0");
    const container = document.getElementById("container-sched-exp-tbl");
    console.log("HTML", container.innerHTML);
    setPageDims({
      width: tbl1.getBoundingClientRect().width + 100,
      height: container.getBoundingClientRect().height + 100,
    });
    const options = {
      orientation: "l",
      unit: "px",
      format: [
        tbl1.getBoundingClientRect().width + 100,
        container.getBoundingClientRect().height,
      ],
      hotfixes: ["px_scaling"],
    };
    const pdf = new jsPDF(options);

    await Promise.all(
      tables.map(async (table, index) => {
        pdf.setPage(index + 1);
        console.log(table);
        const tbl = document.getElementById(table);
        const canvas = await html2canvas(tbl);
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 50, 50);
        if (index !== tables.length - 1) {
          pdf.addPage();
        }
      })
    );

    console.log(pdf);
    pdf.save(
      "Deliverable_" +
        deliverableId +
        "_eval_schedule" +
        new Date() +
        ".pdf".replace(" ", "_")
    );
  };

  const tDataStyles = {
    border: "1px solid rgb(57, 56, 56)",
    padding: "0.2rem",
  };
  const thStyles = {
    backgroundColor: "rgb(57, 56, 56)",
    padding: "0.5rem 1rem",
    color: "rgb(103, 163, 216)",
    fontStyle: "italic",
  };
  const containerStyles = {
    position: "fixed",
    zIndex: 100,
    backgroundColor: "white",
  };
  return (
    <div id="container-sched-exp-tbl" style={{ containerStyles }}>
      {formattedData &&
        formattedData.map((mainItem, index) => {
          const date = Object.keys(mainItem)[0];
          console.log(date);
          console.log(mainItem[date]);

          tables.push("tbl-exp-" + index);

          return (
            <div key={index}>
              <table
                id={"tbl-exp-" + index}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "sans-serif",
                  boxSizing: "content-box",
                  border: "1px solid rgb(57, 56, 56)",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...thStyles }} colSpan={8}>
                      <h1>
                        Deliverable {deliverableId} Evaluation Schedule for{" "}
                        {new Date(date).toDateString()}
                      </h1>
                    </th>
                    <th style={{ ...thStyles, minWidth: "50px" }}>Date</th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyles, width: "34px" }}>Sr. No.</th>
                    <th style={{ ...thStyles, minWidth: "300px" }}>
                      Project Title
                    </th>
                    <th style={{ ...thStyles, minWidth: "60px" }}>Group</th>
                    <th style={{ ...thStyles, minWidth: "150px" }}>
                      Supervisor
                    </th>
                    <th style={{ ...thStyles, minWidth: "150px" }}>
                      Student Name
                    </th>
                    <th style={{ ...thStyles, minWidth: "150px" }}>
                      Student Roll no.
                    </th>
                    <th style={{ ...thStyles, minWidth: "60px" }}>Committee</th>
                    <th style={{ ...thStyles }}>Evaluators</th>
                    <th style={{ ...thStyles, minWidth: "50px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mainItem[date].map((item, index) => {
                    const evals = item.committee.evaluators;
                    const grpMmbs = item.group.groupMembers;
                    const defaultRowSpan =
                      evals.length >= grpMmbs.length
                        ? evals.length
                        : grpMmbs.length;
                    const newRows = [];
                    const tdStyles = {
                      backgroundColor:
                        index % 2 === 0
                          ? "rgb(180,197,231)"
                          : "rgb(197,223,180)",
                    };
                    for (let i = 1; i < defaultRowSpan; i++) {
                      newRows.push(
                        <>
                          <tr>
                            <td style={{ ...tDataStyles, ...tdStyles }}>
                              {grpMmbs[i] ? grpMmbs[i].name : null}
                            </td>
                            <td style={{ ...tDataStyles, ...tdStyles }}>
                              {grpMmbs[i] ? grpMmbs[i].rollNo : null}
                            </td>
                            <td style={{ ...tDataStyles, ...tdStyles }}>
                              {evals[i] ? evals[i].name : null}
                            </td>
                          </tr>
                        </>
                      );
                    }
                    return (
                      <>
                        <tr key={index}>
                          <td
                            style={{ ...tDataStyles, ...tdStyles }}
                            rowSpan={defaultRowSpan}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{ ...tDataStyles, ...tdStyles }}
                            rowSpan={defaultRowSpan}
                          >
                            {item.project.name}
                          </td>
                          <td
                            style={{ ...tDataStyles, ...tdStyles }}
                            rowSpan={defaultRowSpan}
                          >
                            {item.group.name}
                          </td>
                          <td
                            style={{ ...tDataStyles, ...tdStyles }}
                            rowSpan={defaultRowSpan}
                          >
                            {item.group.supervisor.name}
                          </td>
                          {/* GRpMembers */}
                          <td style={{ ...tDataStyles, ...tdStyles }}>
                            {grpMmbs[0].name}
                          </td>
                          <td style={{ ...tDataStyles, ...tdStyles }}>
                            {grpMmbs[0].rollNo}
                          </td>
                          {/* Committee */}
                          <td
                            style={{ ...tDataStyles, ...tdStyles }}
                            rowSpan={defaultRowSpan}
                          >
                            {item.committee.name}
                          </td>
                          <td style={{ ...tDataStyles, ...tdStyles }}>
                            {evals[0].name}
                          </td>
                          {index == 0 ? (
                            <td
                              style={{
                                ...tDataStyles,
                                backgroundColor: " rgb(255, 255, 0)",
                              }}
                              rowSpan={defaultRowSpan * mainItem[date].length}
                            >
                              <div
                                style={{
                                  transform: "rotateZ(90deg)",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {new Date(date).toDateString()}
                              </div>
                            </td>
                          ) : null}
                        </tr>
                        {/* {grpMmbs.length < evals.length
                          ? groupMemberRows.push(
                              <tr>
                                <td></td>
                              </tr>
                            )
                          : groupMemberRows} */}
                        {/* {groupMemberRows}
                        {evaluatorRows} */}
                        {newRows}
                      </>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ width: "100%", height: "100px" }}></div>
            </div>
          );
        })}
      {/* <ReactToPdf
        targetRef={rptRef}
        options={options}
        filename={`${data.name}_Detailed_Report.pdf`}
      >
        {({ toPdf }) => (
          <Button variant="contained" onClick={toPdf}>
            Download
          </Button>
        )}
      </ReactToPdf> */}
      <Button
        style={{ display: "none" }}
        variant="contained"
        onClick={generatePDF}
        ref={rptRef}
      >
        Download
      </Button>
    </div>
  );
};

const ScheduleReport = ({ data, setDisplay, deliverableId, setPageDims }) => {
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <ScheduleReportComponent
        data={data}
        setPageDims={setPageDims}
        setDisplay={setDisplay}
        deliverableId={deliverableId}
      />
    </Backdrop>
  );
};

export default ScheduleReport;
