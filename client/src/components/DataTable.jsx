import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function DataTable(props) {
  const { DataHead, DataBody } = props;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <DataHead />
          </TableRow>
        </TableHead>
        <TableBody>
          <DataBody />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
