import React from "react";
import { ExcelRenderer } from "react-excel-renderer";

const ImportFromExcel = props => {
  const { setGroups } = props;

  const importFileHandler = event => {
    console.log(event.target);
    console.log("Triggered");
    let fileObj = event.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const data = resp.rows;
        data.shift();

        const groups = [];
        for (const item of data) {
          // Converted from O(n^2) to O(n) 🙂
          let temp;
          if (item.length < 4) {
            temp = { ...groups[groups.length - 1] };
            temp.members.push(item[1]);
          } else {
            temp = {
              id: item[0],
              members: [item[1]],
              projectTitle: item[2],
              supervisor: item[3],
            };
            groups.push(temp);
          }
        }
        setGroups([...groups]);
      }
    });
  };

  return (
    <label
      className="false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal text-white bg-light-blue-500 hover:bg-light-blue-700 focus:bg-light-blue-400 active:bg-light-blue-800 shadow-md-light-blue hover:shadow-lg-light-blue undefined"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <input className="hidden" type="file" onChange={importFileHandler} />
      Import
    </label>
  );
};

export default ImportFromExcel;
