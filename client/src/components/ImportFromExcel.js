import React, { useRef } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import Icon from "@material-tailwind/react/Icon";
import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";

const ImportFromExcel = props => {
  const { onImportFromExcel } = props;
  const labelRef = useRef();

  const importFileHandler = event => {
    let fileObj = event.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const data = resp.rows;
        // data.shift();
        onImportFromExcel(data);
        // const groups = [];
        // for (const item of data) {
        //   // Converted from O(n^2) to O(n) 🙂
        //   let temp;
        //   if (item.length < 4) {
        //     temp = { ...groups[groups.length - 1] };
        //     temp.members.push(item[1]);
        //   } else {
        //     temp = {
        //       id: item[0],
        //       members: [item[1]],
        //       projectTitle: item[2],
        //       supervisor: item[3],
        //     };
        //     groups.push(temp);
        //   }
        // }

        // setGroups([...groups]);
      }
    });
  };

  return (
    <div className="mr-4">
      <label
        ref={labelRef}
        className="false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-full w-10 h-10 p-0 grid place-items-center text-xs leading-normal text-white bg-primary hover:bg-light-blue-700 focus:bg-light-blue-400 active:bg-light-blue-800 shadow-md-light-blue hover:shadow-lg-light-blue undefined"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <input className="hidden" type="file" onChange={importFileHandler} />
        <Icon name="upload" size="xxl" />
      </label>
      <Tooltips placement="top" ref={labelRef}>
        <TooltipsContent>Import From Excel</TooltipsContent>
      </Tooltips>
    </div>
  );
};

export default ImportFromExcel;
