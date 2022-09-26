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
import ItemCard from "../components/ItemCard";
import { GROUP_NAME, PROJECT_ID, USER_ID } from "../utils/keys";

const DataHead = () => null;

const DataBody = () => {
  const groupID = localStorage.getItem(USER_ID);
  const history = useHistory();
  const [projectData, setProjectData] = useState({});
  const [proposalDeadline, setProposalDeadline] = useState("None");
  const [d2Deadline, setD2Deadline] = useState("None");
  const [d3Deadline, setD3Deadline] = useState("None");
  useEffect(() => {
    console.log(groupID);
    const getData = async () => {
      try {
        console.log("sending request");
        const projectRes = await axios.get(
          "http://localhost:5000/api/project/get-grp/" + groupID
        );
        console.log(projectRes.data.project);
        localStorage.setItem(PROJECT_ID, projectRes.data.project.id);
        setProjectData(projectRes.data.project);
      } catch (err) {
        console.log(err);
        history.replace("/main/info");
      }
    };
    const getDeliverablesData = async () => {
      const delivRes = await axios.get(
        "http://localhost:5000/api/deliverable/get-all"
      );
      console.log(delivRes.data);
      const proposal = delivRes.data.deliverables.filter(
        deliv => deliv.id == 1
      )[0];
      const d2 = delivRes.data.deliverables.filter(deliv => deliv.id == 2)[0];
      const d3 = delivRes.data.deliverables.filter(deliv => deliv.id == 3)[0];
      console.log(proposal, d2, d3);
      setProposalDeadline(
        proposal.deadline ? new Date(proposal.deadline).toDateString() : "None"
      );
      setD2Deadline(
        d2.deadline ? new Date(d2.deadline).toDateString() : "None"
      );
      setD3Deadline(
        d3.deadline ? new Date(d3.deadline).toDateString() : "None"
      );
      // setProposalDeadline(delivRes.data.deliverables);
    };
    getData();
    getDeliverablesData();
  }, [groupID, history]);

  const deliverables = [
    {
      id: 1,
      title: "Deliverable 1",
      link: "/main/proposal",
      deadline: proposalDeadline,
    },
    {
      id: 2,
      title: "Deliverable 2",
      link: "/main/d2",
      deadline: d2Deadline,
    },
    {
      id: 3,
      title: "Deliverable 3",
      link: "/main/d3",
      deadline: d3Deadline,
    },
  ];
  return (
    <ContainerFluid title={"Project: " + projectData.title}>
      <Main>
        <Box
          sx={{
            padding: "3rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {deliverables.map((deliverable, index) => {
            return (
              <ItemCard
                manual={true}
                key={deliverable.id}
                index={"Deliverable " + (index + 1)}
                item={deliverable}
              />
            );
          })}

          <ItemCard
            index={""}
            manual={true}
            item={{
              id: 1,
              title: "Group Details",
              link: "/main/group/" + groupID,
            }}
          />
        </Box>
      </Main>
    </ContainerFluid>
  );

  // return (
  //   <>
  //     <TableRow>
  //       <TableCell colSpan={2}>
  //         <Typography variant="h6">Project: {projectData.title}</Typography>
  //       </TableCell>
  //     </TableRow>
  //     <TableRow>
  //       <TableCell>
  //         <Button color="primary" variant="outlined">
  //           <Link to="/main/proposal">1st Deliverable: Project Proposal</Link>
  //         </Button>
  //       </TableCell>

  //       <TableCell>
  //         <Typography variant="subtitle2">
  //           {" "}
  //           Deadline: {proposalDeadline}
  //         </Typography>
  //       </TableCell>
  //     </TableRow>
  //     <TableRow>
  //       <TableCell>
  //         <Button color="primary" variant="outlined">
  //           <Link to="/main/d2">2nd Deliverable: Documentation</Link>
  //         </Button>
  //       </TableCell>

  //       <TableCell>
  //         <Typography variant="subtitle2"> Deadline: {d2Deadline}</Typography>
  //       </TableCell>
  //     </TableRow>
  //     <TableRow>
  //       <TableCell>
  //         <Button color="primary" variant="outlined">
  //           <Link to="/main/d3">3rd Deliverable: Working System</Link>
  //         </Button>
  //       </TableCell>
  //       <TableCell>
  //         <Typography variant="subtitle2"> Deadline: {d3Deadline}</Typography>
  //       </TableCell>
  //     </TableRow>
  //     <TableRow>
  //       <TableCell>
  //         <Button color="primary" variant="contained" size="large">
  //           <Link style={{ color: "white" }} to={"/main/group/" + groupID}>
  //             Show Details
  //           </Link>
  //         </Button>
  //       </TableCell>
  //     </TableRow>
  //   </>
  // );
};

const GroupDashboard = () => {
  const groupID = localStorage.getItem(USER_ID);
  const [groupData, setGroupData] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/group/get/${groupID}`
        );
        console.log(res.data.group);
        setGroupData(res.data.group);
        localStorage.setItem(GROUP_NAME, res.data.group.name);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [groupID]);

  return <DataBody />;
  // return (
  //   <ContainerFluid title={groupData.name}>
  //     <Main styles={{ padding: "1.5rem" }}>
  //       <Box
  //         sx={{ marginBottom: "3rem" }}
  //         display="flex"
  //         justifyContent="space-between"
  //         alignItems="center"
  //       >
  //         {/* <Box>
  //           <Typography variant="h3">SE_18_1 Proposal</Typography>
  //         </Box> */}
  //         {/* <Box>
  //           <Button variant="contained" color="primary">
  //             Settings
  //           </Button>
  //         </Box> */}
  //       </Box>

  //       <DataTable DataHead={DataHead} DataBody={DataBody} />
  //     </Main>
  //   </ContainerFluid>
  // );
};

export default GroupDashboard;
