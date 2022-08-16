import React, { useEffect, useState } from "react";
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
import axios from "axios";

const DataHead = () => null;

const DataBody = () => {
  const groupID = localStorage.getItem("USER_ID");
  const history = useHistory();
  const [projectData, setProjectData] = useState({});
  useEffect(() => {
    console.log(groupID);
    const getData = async () => {
      try {
        console.log("sending request");
        const projectRes = await axios.get(
          "http://localhost:5000/api/project/get-grp/" + groupID
        );
        console.log(projectRes.data.project);
        localStorage.setItem("PROJECT_ID", projectRes.data.project.id);
        setProjectData(projectRes.data.project);
      } catch (err) {
        console.log(err);
        history.replace("/register-project");
      }
    };
    getData();
  }, [groupID, history]);

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project: {projectData.title}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button color="primary" variant="outlined">
            <Link to="/main/proposal">1st Deliverable: Project Proposal</Link>
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button color="primary" variant="outlined">
            <Link to="/main/d2">2nd Deliverable: Documentation</Link>
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button color="primary" variant="outlined">
            <Link to="/main/d3">3rd Deliverable: Working System</Link>
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Button color="primary" variant="contained" size="large">
            <Link style={{ color: "white" }} to={"/main/group/" + groupID}>
              Show Details
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const GroupDashboard = () => {
  const groupID = localStorage.getItem("USER_ID");
  const [groupData, setGroupData] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/group/get/${groupID}`
        );
        console.log(res.data.group);
        setGroupData(res.data.group);
        localStorage.setItem("GROUP_NAME", res.data.group.name);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [groupID]);

  return (
    <ContainerFluid title={groupData.name}>
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

export default GroupDashboard;
