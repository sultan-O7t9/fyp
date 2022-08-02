import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  Switch,
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
  const [modal, setModal] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body1">PMO Management System</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project Proposal</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Approve</Typography>
        </TableCell>
        <TableCell>
          <Switch></Switch>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Comment</Typography>
        </TableCell>
        <TableCell>
          <TextareaAutosize
            maxRows={4}
            aria-label="maximum height"
            placeholder="Maximum 4 rows"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua."
            style={{ width: "100%" }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("changes saved");
            }}
          >
            Save Changes
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const SupervisorDocumentation = () => {
  return (
    <ContainerFluid title="Deliverable 1">
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">SE_18_1 Documentation</Typography>
          </Box>
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

export default SupervisorDocumentation;
