import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { AssignedGroups } from "../components/DnD/AssignedGroups";
import DragList from "../components/DnD/DragnDrop";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";
import Select from "../components/Select";
import { USER_ID } from "../utils/keys";
import styles from "./auth.styles";

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

// const DragComponent = () => {
//   return (
//     <Box
//       style={{
//         width: "100%",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//       }}
//     >
//       <List style={{ width: "40%", maxHeight: "300px" }}>
//         <ListItem style={{ margin: 0 }}>
//           <Card variant="outlined" style={{ padding: "1rem", width: "100%" }}>
//             SE_18_1
//           </Card>
//         </ListItem>
//         <ListItem style={{ margin: 0 }}>
//           <Card variant="outlined" style={{ padding: "1rem", width: "100%" }}>
//             SE_18_1
//           </Card>
//         </ListItem>
//         <ListItem style={{ margin: 0 }}>
//           <Card variant="outlined" style={{ padding: "1rem", width: "100%" }}>
//             SE_18_1
//           </Card>
//         </ListItem>
//       </List>
//       <List>
//         <ListItem>1</ListItem>
//         <ListItem>1</ListItem>
//         <ListItem>1</ListItem>
//       </List>
//     </Box>
//   );
// };

const GROUPS = [
  { id: "SE_18_1" },
  { id: "SE_18_2" },
  { id: "SE_18_3" },
  { id: "SE_18_4" },
];
const EVALUATORS = [
  { id: "1", name: "ABC" },
  { id: "2", name: "ABC" },
  { id: "3", name: "ABC" },
  { id: "4", name: "ABC" },
  { id: "5", name: "ABC" },
  { id: "6", name: "ABC" },
];

const EditCommittee = props => {
  const { setDisplay, committee } = props;
  console.log(committee);
  // const [heads, setHeads] = useState([
  //   "Group ID",
  //   "Members",
  //   "Project Title",
  //   "Supervisor",
  // ]);
  // const [body, setBody] = useState(DATA.data);
  const [groupItems, setGroupItems] = useState(GROUPS);
  const [evaluatorItems, setEvaluatorItems] = useState(EVALUATORS);
  const [groups, setGroups] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  console.log(committee);
  useEffect(() => {
    const getData = async () => {
      setGroups(committee.Groups.map(group => group.name));
      try {
        const res = axios.post("http://localhost:5000/api/group/get-groups/", {
          userId: localStorage.getItem(USER_ID),
        });
        console.log(res.data);
        console.log(evaluators.includes(1));
        console.log(res.data.groups);
        // setGroups([]);
        console.log(evaluators);

        const res2 = await axios.get(
          "http://localhost:5000/api/sem/get-current"
        );
        console.log(res2.data);
        const currSem = res2.data.semester ? res2.data.semester.id : null;

        const grps = res.data.groups
          .filter(
            group =>
              group.committeeId == null &&
              !evaluators.includes(group.supervisorId)
          )
          .map(group => {
            return {
              id: group.id,
              text: group.id,
              value: group.id,
            };
          })
          .concat(
            committee.Groups.map(group => ({
              id: group.name,
              text: group.name,
              value: group.name,
            }))
          );
        setGroupItems(
          currSem != null
            ? grps.filter(grp => currSem != null && grp.semesterId == currSem)
            : grps
        );
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [committee, evaluators]);
  useEffect(() => {
    setEvaluators(committee.members.map(member => member.id));

    axios
      .get("http://localhost:5000/api/faculty/get-supervisors")
      .then(res => {
        console.log(res.data);
        setEvaluatorItems(
          res.data.supervisors
            .filter(faculty => faculty.committeeId == null)
            .map(supervisor => {
              return {
                id: supervisor.id,
                name: supervisor.name,
                value: supervisor.id,
              };
            })
            .concat(
              committee.members.map(member => ({
                id: member.id,
                name: member.name,
                value: member.id,
              }))
            )
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, [committee]);

  const manageCommitteeHandler = async () => {
    console.log("Manage Committee");
    console.log(groups, evaluators);
    // return;

    try {
      const res = await axios.put(
        "http://localhost:5000/api/committee/update",
        {
          committeeId: committee.id,
          groups: groups,
          members: evaluators,
        }
      );
      console.log(res);

      setDisplay(false);
      return;
    } catch (err) {
      console.log(err);
    } finally {
      setDisplay(false);
    }
  };

  const selectGroupsHandler = groups => {
    // if (groups.length > 3) {
    //   return;
    // }
    setGroups(groups);
    console.log(groups);
  };
  const selectEvaluatorsHandler = evaluators => {
    if (evaluators.length > 2) {
      return;
    }
    setEvaluators(evaluators);
    console.log(evaluators);
  };

  const selectGroupItems = groupItems.map(group => {
    return {
      id: group.id,
      value: group.id,
      text: group.id,
    };
  });
  const selectEvaluatorItems = evaluatorItems.map(evaluator => {
    return {
      id: evaluator.id,
      value: evaluator.id,
      text: evaluator.name,
    };
  });

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
          <Box style={{ margin: "2rem 0.5rem", marginTop: "0rem" }}>
            <Typography variant="h6">Select Members</Typography>
            <Box style={{ margin: "1rem" }}>
              <Select
                required
                // style={{ width: "100%" }}
                multiple={true}
                label="Evaluators"
                value={evaluators}
                setValue={selectEvaluatorsHandler}
                items={selectEvaluatorItems}
              />
            </Box>
          </Box>
          <Box style={{ margin: "2rem 0.5rem" }}>
            <Typography variant="h6">Assign Groups</Typography>
            <Box style={{ margin: "1rem" }}>
              <Select
                required
                // style={{ width: "100%" }}
                multiple={true}
                label="Groups"
                value={groups}
                setValue={selectGroupsHandler}
                items={selectGroupItems}
              />
            </Box>
          </Box>
          <Box style={{ margin: "2rem 0.5rem" }}>
            {/* <DataTable
                DataHead={() => <GroupsDataHead heads={heads} />}
                DataBody={() => <GroupsDataBody data={body} />}
              /> */}
          </Box>
          <Box
            style={{
              display: "flex",
              margin: "2rem 0.5rem",
              marginBottom: 0,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={groups.length == 0 || evaluators.length == 0}
              onClick={manageCommitteeHandler}
            >
              Save
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "2rem" }}
              color="error"
              onClick={() => setDisplay(false)}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Container>
    </Backdrop>
  );
};

export default EditCommittee;
