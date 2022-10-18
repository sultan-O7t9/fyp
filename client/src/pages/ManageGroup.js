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

const ManageGroup = props => {
  const { setDisplay, group } = props;
  // const [heads, setHeads] = useState([
  //   "Group ID",
  //   "Members",
  //   "Project Title",
  //   "Supervisor",
  // ]);
  // const [body, setBody] = useState(DATA.data);
  console.log("GRP", group);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [depts, setDepts] = useState([]);
  const [dept, setDept] = useState("");

  useEffect(() => {
    const getDepts = async () => {
      try {
        const res = await axios.get("/api/dept/get-all");
        setDepts(
          res.data.departments.map(dept => ({
            value: dept.id,
            text: dept.title + " (" + dept.name + ")",
            id: dept.id,
          }))
        );
        if (group.hasOwnProperty("department") && group.department !== null) {
          setDept(
            res.data.departments.find(dept => dept.name === group.department).id
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getDepts();
  }, [group]);

  useEffect(() => {
    console.log(group);
    //   if (committee.hasOwnProperty("Groups")) {
    //     setGroups(committee.Groups.map(group => group.name));
    //   }
    // return;
    axios
      .get("/api/student/get-students")
      .then(res => {
        console.log(res.data.students);
        const sts = group.hasOwnProperty("members")
          ? res.data.students.concat(group.members)
          : res.data.students;
        const mms = group.hasOwnProperty("members")
          ? group.members.map(member => member.rollNo)
          : [];
        const l = group.hasOwnProperty("members")
          ? group.members.find(member => member.leader == true).rollNo
          : "";
        console.log(group.members);
        setStudents(sts);
        setMembers(mms);
        setLeader(l);
      })
      .catch(err => {
        console.log(err);
      });
  }, [group.members, group]);
  useEffect(() => {
    axios
      .get("/api/faculty/get-supervisors")
      .then(res => {
        console.log(res.data.supervisors);
        setSupervisors(res.data.supervisors);
        setSupervisor(
          res.data.supervisors.find(
            supervisor => supervisor.name === group.supervisor
          ).id
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, [group.supervisor]);

  const selectMembersHandler = members => {
    if (members.length > 3) {
      return;
    }
    setMembers(members);
    console.log(members);
  };
  const selectLeaderHandler = leader => {
    console.log("Leader", leader);
    setLeader(leader);
  };

  const teamItems = students.map(student => {
    return {
      id: student.rollNo,
      value: student.rollNo,
      text: student.rollNo,
    };
  });

  const editGroupHandler = async () => {
    const data = {
      id: group.id,
      members: members,
      leader: leader,
      supervisor: supervisor,
      department: dept,
    };
    console.log(data);
    try {
      if (group.hasOwnProperty("id")) {
        const result = await axios.put("/api/group/update", {
          members: members,
          leader: leader,
          supervisor: supervisor,
          id: group.id,
          dept: dept,
        });
        console.log(result);
      } else {
        const result = await axios.post("/api/group/create", {
          members: members,
          leader: leader,
          supervisor: supervisor,
          dept: dept,
        });
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDisplay(false);
    }
  };

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container maxWidth="md" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.heading}>
            Register Group
          </Typography>

          <Select
            required
            style={styles.input}
            multiple={true}
            label="Team"
            value={members}
            setValue={selectMembersHandler}
            items={teamItems}
          />
          <Select
            label="Leader"
            style={styles.input}
            value={leader}
            setValue={selectLeaderHandler}
            items={members.map(member => ({
              id: member,
              value: member,
              text: member,
            }))}
          />
          <Select
            label="Department"
            style={styles.input}
            value={dept}
            setValue={setDept}
            items={depts}
          />
          <Select
            label="Supervisor"
            style={styles.input}
            value={supervisor}
            setValue={setSupervisor}
            items={supervisors.map(supervisor => ({
              id: supervisor.id,
              value: supervisor.id,
              text: supervisor.name,
            }))}
          />
          <Box>
            <Button
              variant="contained"
              onClick={editGroupHandler}
              disabled={!supervisor || !leader || members.length <= 0}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: "1rem" }}
              onClick={() => setDisplay(false)}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default ManageGroup;
