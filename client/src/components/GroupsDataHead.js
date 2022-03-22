import { TableCell } from "@mui/material";
import React from "react";

const GroupsDataHead = ({ heads }) => {
  return (
    heads &&
    heads.map((head, index) => <TableCell key={index}>{head}</TableCell>)
  );
};

export default GroupsDataHead;
