import {
  Backdrop,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DataTable from "../components/DataTable";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";

const DATA = {
  data: [
    {
      id: "SE_18_1",
      members: [
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
      ],
      project: "Hello World",
      supervisor: "Demo",
    },
    {
      id: "SE_18_1",
      members: [
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
      ],
      project: "Hello World",
      supervisor: "Demo",
    },
    {
      id: "SE_18_1",
      members: [
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
        { rollNo: "18094198-079", name: "ABC" },
      ],
      project: "Hello World",
      supervisor: "Demo",
    },
  ],
};

const ManageCommittee = () => {
  const [heads, setHeads] = useState([
    "Group ID",
    "Members",
    "Project Title",
    "Supervisor",
  ]);
  const [body, setBody] = useState(DATA.data);
  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container
        maxWidth="md"
        style={{ maxHeight: "80vh", overflowY: "scroll" }}
      >
        <Paper style={{ padding: "3.5rem 2rem" }}>
          <Box
            style={{
              display: "flex",
              margin: "2rem 0.5rem",
              marginTop: "0rem",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "2rem" }}
              color="error"
            >
              Cancel
            </Button>
          </Box>
          <Box style={{ margin: "2rem 0.5rem" }}>
            <Typography variant="h6">Select Members</Typography>
            <Box style={{ margin: "1rem", display: "flex" }}>
              Here goes drag n drop
            </Box>
          </Box>
          <Box style={{ margin: "2rem 0.5rem" }}>
            <Typography variant="h6">Assign Groups</Typography>
            <Box style={{ margin: "1rem", display: "flex" }}>
              Here goes drag n drop
            </Box>
          </Box>
          <Box style={{ margin: "2rem 0.5rem" }}>
            <DataTable
              DataHead={() => <GroupsDataHead heads={heads} />}
              DataBody={() => <GroupsDataBody data={body} />}
            />
          </Box>
        </Paper>
      </Container>
    </Backdrop>
  );
};

export default ManageCommittee;
