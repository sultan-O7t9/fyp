import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
//   import DataTable from "../components/DataTable";
//   import { AssignedGroups } from "../components/DnD/AssignedGroups";
//   import DragList from "../components/DnD/DragnDrop";
//   import GroupsDataBody from "../components/GroupsDataBody";
//   import GroupsDataHead from "../components/GroupsDataHead";
import Select from "../components/Select";
//   import styles from "./auth.styles";

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

const EVALUATORS = [
  { id: 1, name: "Demo" },
  { id: 2, name: "Demo2" },
  { id: 3, name: "Demo3" },
  { id: 4, name: "Demo4" },
  { id: 5, name: "Demo5" },
  { id: 6, name: "Demo6" },
];

const EditDeptPMO = props => {
  const { setDisplay, data } = props;
  const { dept, pmo } = data;
  console.log(data);
  // const [heads, setHeads] = useState([
  //   "Group ID",
  //   "Members",
  //   "Project Title",
  //   "Supervisor",
  // ]);
  // const [body, setBody] = useState(DATA.data);
  //   const [groupItems, setGroupItems] = useState([]);
  //   const [evaluatorItems, setEvaluatorItems] = useState(EVALUATORS);
  //   const [groups, setGroups] = useState([]);
  //   const [evaluators, setEvaluators] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [deptPMO, setDeptPMO] = useState("");
  const [deptTitle, setDeptTitle] = useState("");

  useEffect(() => {
    // setDeptPMO(pmo);
    axios
      .get("http://localhost:5000/api/faculty/get-supervisors")
      .then(res => {
        let facultyData;
        if (pmo) {
          facultyData = res.data.supervisors.filter(
            supervisor => supervisor.id !== pmo.id
          );
        } else {
          facultyData = res.data.supervisors;
        }
        console.log(facultyData);
        setFaculty(facultyData);

        //    setEvaluatorItems(res.data.supervisors)
      })
      .catch(err => {
        console.log(err);
      });
  }, [dept, pmo]);

  useEffect(() => {
    setDeptTitle(dept.title);
    setDeptPMO(pmo ? pmo.id : null);
  }, [dept, pmo]);

  //   useEffect(() => {
  //     if (committee.hasOwnProperty("Groups")) {
  //       setGroups(committee.Groups.map(group => group.name));
  //     }
  //     // return;
  //     axios
  //       .get("http://localhost:5000/api/group/get-all")
  //       .then(res => {
  //         console.log(res.data);
  //         setGroupItems(
  //           committee.hasOwnProperty("Groups")
  //             ? res.data.groups
  //                 .filter(group => group.committeeId == null)
  //                 .concat(committee.Groups.map(group => ({ id: group.name })))
  //             : res.data.groups.filter(group => group.committeeId == null)
  //         );
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }, [committee]);
  //   useEffect(() => {
  //     if (committee.hasOwnProperty("FacultyMembers")) {
  //       setEvaluators(committee.FacultyMembers.map(member => member.id));
  //     }
  //     axios
  //       .get("http://localhost:5000/api/faculty/get-supervisors")
  //       .then(res => {
  //         console.log(res.data);
  //         setEvaluatorItems(
  //           committee.hasOwnProperty("FacultyMembers")
  //             ? res.data.supervisors
  //                 .filter(faculty => faculty.committeeId == null)
  //                 .concat(
  //                   committee.FacultyMembers.map(member => ({
  //                     id: member.id,
  //                     name: member.name,
  //                   }))
  //                 )
  //             : res.data.supervisors.filter(
  //                 faculty => faculty.committeeId == null
  //               )
  //         );
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }, [committee]);

  //   const manageCommitteeHandler = async () => {
  //     console.log("Manage Committee");
  //     console.log(groups, evaluators);

  //     try {
  //       if (
  //         committee.hasOwnProperty("Groups") &&
  //         committee.hasOwnProperty("FacultyMembers")
  //       ) {
  //         const res = await axios.put(
  //           "http://localhost:5000/api/committee/update",
  //           {
  //             committeeId: committee.id,
  //             groups: groups,
  //             members: evaluators,
  //           }
  //         );
  //         console.log(res);

  //         setDisplay(false);
  //         return;
  //       }
  //       const result = await axios.post(
  //         "http://localhost:5000/api/committee/create",
  //         { members: [...evaluators], groups: [...groups] }
  //       );
  //       console.log(result);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setDisplay(false);
  //     }
  //   };

  //   const selectGroupsHandler = groups => {
  //     if (groups.length > 3) {
  //       return;
  //     }
  //     setGroups(groups);
  //     console.log(groups);
  //   };
  //   const selectEvaluatorsHandler = evaluators => {
  //     if (evaluators.length > 2) {
  //       return;
  //     }
  //     setEvaluators(evaluators);
  //     console.log(evaluators);
  //   };
  const selectPMOHandler = faculty => {
    // if (faculty == pmo.id) return;
    setDeptPMO(faculty);
    console.log(faculty);
  };

  //   const selectGroupItems = groupItems.map(group => {
  //     return {
  //       id: group.id,
  //       value: group.id,
  //       text: group.id,
  //     };
  //   });
  const selectFacultyItems = faculty.map(faculty => {
    return {
      id: faculty.id,
      value: faculty.id,
      text: faculty.name,
    };
  });

  // useEffect(() => {
  //   const prevPMO = faculty.find(faculty => faculty.id == pmo.id);
  //   setDeptPMO(prevPMO);
  // }, [data, pmo]);

  //   const selectEvaluatorItems = evaluatorItems.map(evaluator => {
  //     return {
  //       id: evaluator.id,
  //       value: evaluator.id,
  //       text: evaluator.name,
  //     };
  //   });

  const submitPMOHandler = async () => {
    try {
      const deptRes = await axios.post(
        "http://localhost:5000/api/dept/update",
        {
          id: dept.id,
          title: deptTitle,
        }
      );
      const pmoRes = await axios.patch(
        "http://localhost:5000/api/faculty/pmo/assign",
        { deptId: dept.id, facultyId: deptPMO }
      );
      if (deptRes.data.update && pmoRes.data.assign) {
        console.log("Updated");
      }
      setDisplay(false);
    } catch (err) {
      console.log(err);
      setDisplay(false);
    }
  };

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
            <Typography variant="h6">Edit Department</Typography>
            <Box style={{ margin: "1rem" }}>
              <TextField
                style={{ width: "100%" }}
                placeholder="Department Name"
                value={deptTitle}
                onChange={e => {
                  setDeptTitle(e.target.value);
                }}
              />
            </Box>
            <Box style={{ margin: "1rem" }}>
              <Select
                required
                // style={{ width: "100%" }}
                multiple={false}
                label="PMO"
                value={deptPMO}
                setValue={selectPMOHandler}
                items={selectFacultyItems}
              />
            </Box>
          </Box>
          {/* <Box style={{ margin: "2rem 0.5rem" }}>
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
          </Box> */}
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
              disabled={!deptPMO}
              onClick={submitPMOHandler}
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

export default EditDeptPMO;
