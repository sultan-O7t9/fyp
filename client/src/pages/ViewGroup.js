import React, { useState } from "react";
import {
  Button,
  Container,
  List,
  ListItem,
  TableCell,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import MainAppbar from "../components/MainAppbar";
import styles from "./auth.styles";
import StudentManageGroup from "./StudentManageGroup";
import { USER_ID } from "../utils/keys";

const DataHead = () => null;

const DataBody = props => {
  const [showEditModal, setShowEditModal] = useState(false);
  const history = useHistory();
  const groupId = localStorage.getItem(USER_ID);
  // console.log(id);
  const [groupInfo, setGroupInfo] = useState({});

  const [password, setPassword] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/group/get/" + groupId);
        console.log(res.data);
        setGroupInfo(res.data.group);

        // const pmoRes = await axios.post(
        //    "/api/evaluation/get-pmo-evaluation",
        //   {
        //     groupId: groupId,
        //     projectId: res.data.group.project.id,
        //   }
        // );
        // console.log(pmoRes.data);

        // const supRes = await axios.post(
        //    "/api/evaluation/get-supervisor-evaluation",
        //   {
        //     groupId: groupId,
        //     projectId: res.data.group.project.id,
        //   }
        // );
        // console.log(supRes.data);
        // setSupEvaluationData(supRes.data.evaluation);
        // setSupMarks(
        //   supRes.data.evaluation.marks ? supRes.data.evaluation.marks : 0
        // );
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [groupId, showEditModal]);

  const verifyGroup = async () => {
    console.log("verify group");
    try {
      const res = await axios.post("/api/group/change/password", {
        groupId: groupId,
        password: password,
      });
      console.log(res.data);
      history.push("/register-project");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showEditModal ? (
        <StudentManageGroup setDisplay={setShowEditModal} group={groupInfo} />
      ) : null}
      <TableRow>
        <TableCell>
          <Typography variant="h3">{groupInfo.name}</Typography>
        </TableCell>
        <TableCell align="right" style={{ marginRight: "1rem" }}>
          {/* <Button
            variant="contained"
            onClick={() => {
              setShowEditModal(true);
            }}
          >
            Edit
          </Button> */}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Group Leader</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" to="#">
            {groupInfo.hasOwnProperty("leader") ? (
              groupInfo.leader
            ) : (
              <Typography variant="body1" style={{ color: "red" }}>
                No Leader Assigned
              </Typography>
            )}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Group Members</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("members") &&
          groupInfo.members.length > 0 ? (
            groupInfo.members.map(member => (
              <Typography key={member} variant="body1" to="#">
                {member}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Members Added
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Supervisor</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("supervisor") &&
          groupInfo.supervisor.name ? (
            <Typography to="#" variant="body1">
              {groupInfo.supervisor.name}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Supervisor Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6" style={{ marginBottom: "1rem" }}>
            Change your Password
          </Typography>
          <TextField
            style={{ width: "300px" }}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              console.log(password);
            }}
            label="New Password"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Button
            variant="contained"
            disabled={password.length < 6}
            size="large"
            onClick={verifyGroup}
          >
            Change Password
          </Button>
        </TableCell>
      </TableRow>

      {/* <TableRow>
        <TableCell>
          <Typography variant="h6">Project</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("project") && groupInfo.project.title ? (
            <Typography variant="body1">{groupInfo.project.title}</Typography>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                history.push("/register-project");
              }}
              color="primary"
            >
              Register Project
            </Button>
          )}
        </TableCell>
      </TableRow> */}
    </>
  );
};

const ViewGroup = () => {
  const [groupInfo, setGroupInfo] = useState({});
  const params = useParams();
  const groupId = params.id;
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/group/get/" + groupId);
        console.log(res.data);
        setGroupInfo(res.data.group);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [groupId]);
  return (
    <>
      <MainAppbar />
      {/* <Box style={styles.container}> */}
      <Container maxWidth="md" style={{ padding: "1rem" }}>
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* <Box>
              <Typography variant="h3">{groupInfo.name}</Typography> */}
            {/* </Box> */}
            {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
          </Box>

          <DataTable DataHead={DataHead} DataBody={DataBody} />
        </Main>
      </Container>
      {/* </Box> */}
    </>
  );
};

export default ViewGroup;
