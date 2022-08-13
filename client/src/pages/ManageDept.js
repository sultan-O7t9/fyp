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
import styles from "./auth.styles";
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
  const [dept, setDept] = useState("");

  useEffect(() => {
    // setDeptPMO(pmo);
    axios
      .get(`http://localhost:5000/api/faculty/get-supervisor-all`)
      .then(res => {
        setFaculty(res.data.faculty);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const selectPMOHandler = faculty => {
    // if (faculty == pmo.id) return;
    // setDeptPMO(faculty);
    console.log(faculty);
  };

  const selectFacultyItems = faculty.map(faculty => {
    return {
      id: faculty.id,
      value: faculty.id,
      text: faculty.name,
    };
  });

  const submitPMOHandler = async () => {
    // const res = await axios.patch(
    //   "http://localhost:5000/api/faculty/pmo/assign",
    //   { deptId: dept.id, facultyId: deptPMO }
    // );
    // console.log(res.data.assign);
    // setDisplay(false);
    const result = await axios.post("http://localhost:5000/api/dept/create", {
      name: dept,
    });
    console.log(result.data.dept);
    if (result.data.create) setDisplay(false);
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
            <Typography variant="h6">Add Department</Typography>

            <Box style={{ margin: "1rem" }}>
              <TextField
                style={{ ...styles.input, width: "100%" }}
                placeholder="Department"
                type="text"
                value={dept}
                onChange={e => setDept(e.target.value)}
              />
              {/* <Select
                required
                // style={{ width: "100%" }}
                multiple={false}
                label="PMO"
                value={deptPMO}
                setValue={selectPMOHandler}
                items={selectFacultyItems}
              /> */}
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
              disabled={dept.length === 0}
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
