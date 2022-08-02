import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  Switch,
  Table,
  TableCell,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory } from "react-router-dom";

const DataHead = () => null;

const DataBody = () => {
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();
  return (
    <>
      <TableRow>
        <TableCell>
          <Typography variant="h4">
            1st Deliverable: Project Proposal
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Status</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Approved</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Link to="#">Proposal_SE_18_1.pdf</Link>
        </TableCell>
        <TableCell>
          <Button color="primary" variant="contained">
            Upload Deliverable
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button color="primary" variant="contained">
            Version History
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProposalSubmissionPage = () => {
  return (
    <ContainerFluid title="SE_18_1">
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Box>
            <Typography variant="h3">SE_18_1 Proposal</Typography>
          </Box> */}
          {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
        </Box>

        <DataTable DataHead={DataHead} DataBody={DataBody} />
      </Main>
    </ContainerFluid>
  );
};

export default ProposalSubmissionPage;
