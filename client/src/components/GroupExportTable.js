import { Button } from "@mui/material";
import React from "react";
import { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../assets/styles/btn.css";

const GroupExportTable = props => {
  const { body, head, label, filename } = props;
  let tableheads = head;
  tableheads = tableheads.filter(head => head.trim() !== "");
  //   const heads = ["Group ID", "Members", "Project Title", "Supervisor"];
  //   const body = [
  //     {
  //       id: "SE_18_2",
  //       members: ["18094198-099", "18094198-049", "18094198-069"],
  //       supervisor: "Sup 1",
  //       title: "Project 1",
  //     },
  //     {
  //       id: "SE_18_1",
  //       members: ["18094198-079", "18094198-089", "18094198-059"],
  //       supervisor: "Sup 2",
  //       title: "Project 2",
  //     },
  //   ];
  return (
    <>
      <div>
        <div className="exp-container">
          <Button
            variant="contained"
            onClick={() => {
              const btn = document.getElementById("test-table-xls-button");
              console.log(btn);
              btn.click();
            }}
          >
            {label}
          </Button>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="exp-btn"
            table="table-to-xls"
            filename={filename}
            sheet="Groups"
            buttonText="Export as Excel"
          />
        </div>
        <div style={{ display: "none" }}>
          <table style={style.table} id="table-to-xls">
            <thead>
              <tr>
                {tableheads.map((head, index) => (
                  <th
                    key={new Date().getTime() * Math.random()}
                    style={style.th}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((group, index) => {
                const remainingMembers = [...group.members];
                remainingMembers.shift();
                const rowSpan = group.members.length;
                const tdStyles = {
                  ...style.td,
                  backgroundColor:
                    index % 2 === 0 ? style.td.backgroundColor : "white",
                  borderColor: index % 2 === 0 ? "white" : "#ddd",
                };
                return (
                  <>
                    <tr key={new Date().getTime() * Math.random()}>
                      <td rowSpan={rowSpan} style={tdStyles}>
                        {group.id}
                      </td>
                      <td style={tdStyles}>{group.members[0]}</td>
                      <td style={tdStyles} rowSpan={rowSpan}>
                        {group.project}
                      </td>
                      <td style={tdStyles} rowSpan={rowSpan}>
                        {group.supervisor}
                      </td>
                      <td style={tdStyles} rowSpan={rowSpan}>
                        {group.booklets}
                      </td>
                      <td style={tdStyles} rowSpan={rowSpan}>
                        {group.bookletsComment}
                      </td>
                    </tr>
                    {remainingMembers.map((member, index) => {
                      return (
                        <tr key={new Date().getTime() * Math.random()}>
                          <td style={tdStyles}>{member}</td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const TableTest = () => {
  return (
    <div>
      <p>Table Test</p>
      <GroupExportTable />
    </div>
  );
};

const style = {
  th: {
    color: "white",
    backgroundColor: "#06f",
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "1px solid #06f",
    padding: "8px",
  },
  td: {
    backgroundColor: "#f2f2f2",
    padding: "8px",
    border: "1px solid #ddd",
  },
  table: {
    borderCollapse: "collapse",
    fontFamily: "sans-serif",
    verticalAlign: "middle",
    textAlign: "center",
  },
};

export default GroupExportTable;
