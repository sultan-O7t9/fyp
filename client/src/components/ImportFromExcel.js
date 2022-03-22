import { Button } from "@mui/material";
import { ExcelRenderer } from "react-excel-renderer";

const ImportFromExcel = props => {
  const { importData, label, ...restProps } = props;

  const importFileHandler = event => {
    console.log(event.target);
    console.log("Triggered");
    let fileObj = event.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const rows = resp.rows;
        const columns = rows.shift();
        console.log(columns, rows);

        importData({ heads: columns, data: rows });
      }
    });
  };

  return (
    <Button variant="contained" {...restProps}>
      <label style={{ position: "relative", overflow: "hidden" }}>
        <input
          style={{ display: "none" }}
          className="hidden"
          type="file"
          onChange={importFileHandler}
        />
        {label}
      </label>
    </Button>
  );
};

export default ImportFromExcel;
