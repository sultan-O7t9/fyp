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
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const DataHead = () => null;

const DataBody = () => {
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();
  // const [modal, setModal] = useState(false);
  const params = useParams();
  const groupId = params.id;
  // console.log(id);
  const [groupInfo, setGroupInfo] = useState({});

  const [pmoEvaluationData, setPmoEvaluationData] = useState({});
  const [pmoMarks, setPmoMarks] = useState("");

  const [supEvaluationData, setSupEvaluationData] = useState({});
  const [supMarks, setSupMarks] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/group/get/" + groupId
        );
        console.log(res.data);
        setGroupInfo(res.data.group);

        const pmoRes = await axios.post(
          "http://localhost:5000/api/evaluation/get-pmo-evaluation",
          {
            groupId: groupId,
            projectId: res.data.group.project.id,
          }
        );
        console.log(pmoRes.data);
        setPmoEvaluationData(pmoRes.data.evaluation);
        setPmoMarks(
          pmoRes.data.evaluation.marks ? pmoRes.data.evaluation.marks : 0
        );

        const supRes = await axios.post(
          "http://localhost:5000/api/evaluation/get-supervisor-evaluation",
          {
            groupId: groupId,
            projectId: res.data.group.project.id,
          }
        );
        console.log(supRes.data);
        setSupEvaluationData(supRes.data.evaluation);
        setSupMarks(
          supRes.data.evaluation.marks ? supRes.data.evaluation.marks : 0
        );
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [groupId]);

  const updateSupMarks = async () => {
    if (supMarks > supEvaluationData.totalMarks) {
      alert("Marks cannot be greater than total marks");
      return;
    }
    const data = {
      groupId: groupId,
      projectId: groupInfo.project.id,
      marksObtained: supMarks,
      totalMarks: supEvaluationData.totalMarks,
    };
    try {
      const res = await axios.put(
        "http://localhost:5000/api/evaluation/update-supervisor-evaluation",
        data
      );
      console.log(res.data);
      setPmoEvaluationData(res.data.evaluation);
    } catch (err) {
      console.log(err);
    }
  };
  const updatePmoMarks = async () => {
    if (pmoMarks > pmoEvaluationData.totalMarks) {
      alert("Marks cannot be greater than total marks");
      return;
    }
    const data = {
      groupId: groupId,
      projectId: groupInfo.project.id,
      marksObtained: pmoMarks,
      totalMarks: pmoEvaluationData.totalMarks,
    };
    try {
      const res = await axios.put(
        "http://localhost:5000/api/evaluation/update-pmo-evaluation",
        data
      );
      console.log(res.data);
      setPmoEvaluationData(res.data.evaluation);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
        <TableCell>
          <Typography variant="h6">Evaluation Committee</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("committee") && groupInfo.committee.name ? (
            <Typography to="#" variant="body1">
              {groupInfo.committee.name}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Committee Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("project") && groupInfo.project.title ? (
            <Typography variant="body1">{groupInfo.project.title}</Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Project Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {/* <TableRow>
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
      </TableRow> */}
      <TableRow>
        <TableCell colSpan={2}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h4">PMO Evaluation</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Project Management Office (Sub-section total:{" "}
            {pmoEvaluationData.totalMarks})
          </Typography>
          <Typography>Meetings Deadlines, Attending Workshops</Typography>
        </TableCell>
      </TableRow>
      {localStorage.getItem("USER_ROLE").includes("PMO") ? (
        <>
          <TableRow>
            <TableCell colSpan={2}>
              <TextField
                type="number"
                placeholder="Marks"
                value={pmoMarks}
                onChange={e => setPmoMarks(e.target.value)}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>
              <Button
                onClick={updatePmoMarks}
                variant="contained"
                color="primary"
                size="large"
                style={{ display: "block" }}
              >
                Save{" "}
              </Button>
            </TableCell>
          </TableRow>
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={2}>
            <Typography variant="body1">
              {pmoMarks}/{pmoEvaluationData.totalMarks}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {/* Supervisor Marks */}
      <TableRow>
        <TableCell colSpan={2}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h4">Supervisor Evaluation</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Supervisor (Sub-section total: {supEvaluationData.totalMarks})
          </Typography>
          <Typography>Meetings, Project Progress</Typography>
        </TableCell>
      </TableRow>
      {localStorage.getItem("USER_ROLE").includes("SUPERVISOR") &&
      groupInfo.hasOwnProperty("supervisor") &&
      groupInfo.supervisor.id == localStorage.getItem("USER_ID") ? (
        <>
          <TableRow>
            <TableCell colSpan={2}>
              <TextField
                type="number"
                placeholder="Marks"
                value={supMarks}
                onChange={e => setSupMarks(e.target.value)}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>
              <Button
                onClick={updateSupMarks}
                variant="contained"
                color="primary"
                size="large"
                style={{ display: "block" }}
              >
                Save{" "}
              </Button>
            </TableCell>
          </TableRow>
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={2}>
            <Typography variant="body1">
              {supMarks}/{supEvaluationData.totalMarks}
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const GroupDetail = () => {
  const [groupInfo, setGroupInfo] = useState({});
  const params = useParams();
  const groupId = params.id;
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/group/get/" + groupId
        );
        console.log(res.data);
        setGroupInfo(res.data.group);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <ContainerFluid title="">
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">
              {groupInfo.hasOwnProperty("name") ? groupInfo.name : ""}
            </Typography>
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
