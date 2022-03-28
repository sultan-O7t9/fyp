import {
  Backdrop,
  Button,
  CircularProgress,
  List,
  ListItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import ExportAsExcel from "../components/ExportAsExcel";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";
import Link from "../components/Link";
import Main from "../components/Main";
import ManageGroup from "./ManageGroup";

// const DATA = {
//   heads: ["Group ID", "Members", "Project Title", "Supervisor"],
//   data: [
//     {
//       id: "SE_18_1",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//     {
//       id: "SE_18_2",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//     {
//       id: "SE_18_3",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//   ],
// };

const AllGroups = () => {
  const [heads, setHeads] = useState([
    "Group ID",
    "Members",
    "Project Title",
    "Supervisor",
    "",
  ]);
  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManageGroup, setShowManageGroup] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("http://localhost:5000/api/group/get-all")
      .then(res => {
        setBody(res.data.groups);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showManageGroup]);

  const editGroupHandler = group => {
    setShowManageGroup(group ? group : true);
  };

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <ContainerFluid>
      {showManageGroup ? (
        <ManageGroup group={showManageGroup} setDisplay={setShowManageGroup} />
      ) : null}
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">Groups</Typography>
          </Box>
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <ExportAsExcel
              label="Export Groups"
              data={[
                [...heads],
                ...body.map(row => [
                  row.id,
                  row.members.map(member => member.rollNo).join(","),
                  row.project ? row.project.title : "None",
                  row.supervisor ? row.supervisor : "None",
                ]),
              ]}
            />
            <Button
              style={{ marginTop: ".5rem" }}
              variant="contained"
              color="primary"
              onClick={() => editGroupHandler()}
            >
              Add Group
            </Button>
          </Box>
        </Box>
        <DataTable
          DataHead={() => <GroupsDataHead heads={heads} />}
          DataBody={() => (
            <GroupsDataBody
              data={body}
              setData={setBody}
              editGroup={editGroupHandler}
            />
          )}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AllGroups;
