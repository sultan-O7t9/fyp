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
import GroupExportTable from "../components/GroupExportTable";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";
import Link from "../components/Link";
import Main from "../components/Main";
import Toast from "../components/Toast";
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
  const isPMO = localStorage.getItem("USER_ROLE").includes("PMO");

  const [heads, setHeads] = useState([]);

  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManageGroup, setShowManageGroup] = useState(false);
  useEffect(() => {
    const headers = isPMO
      ? [
          "Group ID",
          "Members",
          "",
          "Project Title",
          "Supervisor",
          "Booklets Status",
          "Booklets Comment",
          "",
          "",
        ]
      : [
          "Group ID",
          "Members",
          "",
          "Project Title",
          "Booklets Status",
          "Booklets Comment",
          "",
        ];
    if (!isPMO) setHeads(headers);
  }, [isPMO]);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        "http://localhost:5000/api/group/get-all/" +
          localStorage.getItem("USER_ID")
      )
      .then(res => {
        console.log(res.data.groups);
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
    <ContainerFluid maxWidth="lg">
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
            {body.length > 0 ? (
              <>
                <GroupExportTable
                  label="Export Groups"
                  filename={("groups_" + new Date().toLocaleString()).replace(
                    " ",
                    "_"
                  )}
                  head={heads.filter(head => head !== "Booklets Comment")}
                  body={body.map(row => ({
                    id: row.id,
                    members: row.members.map(member => member.rollNo),
                    project: row.project ? row.project.title : "None",
                    supervisor: row.supervisor ? row.supervisor : "None",
                    booklets: row.bookletsStatus ? row.bookletsStatus : "None",
                    bookletsComment: row.bookletsComment
                      ? row.bookletsComment
                      : "",
                  }))}
                />
              </>
            ) : null}
            {localStorage.getItem("USER_ROLE").includes("PMO") ? (
              <Button
                style={{ marginTop: ".5rem" }}
                variant="contained"
                color="primary"
                onClick={() => editGroupHandler()}
              >
                Add Group
              </Button>
            ) : null}
          </Box>
        </Box>
        <DataTable
          DataHead={() => <GroupsDataHead heads={heads} />}
          DataBody={() => (
            <GroupsDataBody
              isPMO={isPMO}
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
