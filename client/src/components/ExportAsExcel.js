import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

const ExportAsExcel = props => {
  const { data, label } = props;

  return (
    <CSVLink style={{ textDecoration: "none" }} data={data}>
      <Button variant="contained" color="primary">
        {label}
      </Button>
    </CSVLink>
  );
};

export default ExportAsExcel;
