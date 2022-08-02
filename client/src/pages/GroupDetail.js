import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  TableCell,
  TableRow,
  TextField,
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
          <Typography variant="h6">Group Leader</Typography>
        </TableCell>
        <TableCell>
          <Link variant="body1" to="#">
            18094198-089
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Group Members</Typography>
        </TableCell>
        <TableCell>
          <List style={{ padding: 0 }}>
            <ListItem style={{ padding: 0 }}>
              <Link variant="body1" to="#">
                18094198-089
              </Link>
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <Link variant="body1" to="#">
                18094198-089
              </Link>
            </ListItem>
          </List>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Supervisor</Typography>
        </TableCell>
        <TableCell>
          <Link to="#" variant="body1">
            Muhammad Ejaz
          </Link>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <Typography variant="h6">Evaluation Committee</Typography>
        </TableCell>
        <TableCell>
          <Link to="#" variant="body1">
            C_SE_1
          </Link>
        </TableCell>
      </TableRow>
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
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project Documentation</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Working System</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">
            7th Semester Marks (Sub-section total: 20)
          </Typography>
          <Typography>Meetings, project progress</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <TextField type="password" placeholder="Marks" />
        </TableCell>
        <TableCell>
          <Button variant="contained" color="primary">
            Save{" "}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">
            8th Semester Marks (Sub-section total: 20)
          </Typography>
          <Typography>Meetings, project progress</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <TextField placeholder="Marks" />
        </TableCell>
        <TableCell>
          <Button variant="contained" color="primary">
            Save{" "}
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const GroupDetail = () => {
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
            <Typography variant="h3">SE_18_1</Typography>
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

export default GroupDetail;
