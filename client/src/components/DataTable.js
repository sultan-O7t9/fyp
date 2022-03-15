import * as React from "react";
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function DataTable(props) {
  const { DataHead, DataBody } = props;
  return (
    <Card variant="outlined">
      <TableContainer>
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
    </Card>
  );
}
