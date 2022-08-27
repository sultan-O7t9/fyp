import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../pages/auth.styles";
import Select from "./Select";
// import Select from "../components/Select";
// import styles from "./auth.styles";

const AddStudent = props => {
  const { setDisplay } = props;
  const [committee, setCommittee] = useState([]);
  const [evaluationDate, setEvaluationDate] = useState("");
  const [groupItems, setGroupItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [dept, setDept] = useState("");
  const [depts, setDepts] = useState([]);

  // const [students, setStudents] = useState([]);
  // const [supervisors, setSupervisors] = useState([]);
  // const [members, setMembers] = useState([]);
  // const [leader, setLeader] = useState("");
  // const [supervisor, setSupervisor] = useState("");

  useEffect(() => {
    const getDept = async () => {
      try {
        const resDept = await axios.get(
          "http://localhost:5000/api/dept/get-all"
        );
        console.log(resDept.data);
        const dts = resDept.data.departments;
        setDepts(
          dts.length
            ? dts.map(dept => ({
                id: dept.id,
                value: dept.id,
                text: `${dept.title} (${dept.name})`,
              }))
            : []
        );
        // setDepts(resDept.data.departments);
      } catch (error) {
        console.log(error);
      }
    };
    getDept();
  }, []);

  //   useEffect(() => {
  //     const getData = async () => {
  //       try {
  //         const res = await axios.get(
  //           "http://localhost:5000/api/committee/get-all"
  //           //   "http://localhost:5000/api/group/get-all/" +
  //           //     localStorage.getItem("USER_ID")
  //           );
  //         console.log("DETAILED GROUPS", res.data);
  //         setData(res.data.committees);
  //     } catch (error) {
  //         console.log(error);
  //     }
  //     };
  //     getData();
  // }, []);

  const registerHandler = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/student/create", {
        name,
        rollNo,
        dept,
      });
      console.log(res);
      setDisplay(false);
    } catch (error) {
      console.log(error);
    }
  };
  //   const selectCommitteeHandler = committee => {
  //       console.log("Comm", committee);
  //       setCommittee(committee);
  //     };
  const selectDeptHandler = dept => {
    console.log("Dept", dept);
    setDept(dept);
  };

  //   const committeeItems = data
  //     ? data.map(committee => {
  //         const data = {
  //           id: committee.id,
  //           value: committee.id,
  //           text:
  //             committee.name +
  //             " (" +
  //             committee.members.map(member => member.name).join(", ") +
  //             ")",
  //         };
  //         console.log(data);
  //         return data;
  //       })
  //     : null;

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container
        maxWidth="md"
        style={{ maxHeight: "80vh", overflowY: "scroll" }}
      >
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.heading}>
            Register
          </Typography>
          <TextField
            style={styles.input}
            value={name}
            placeholder="Name"
            onChange={e => setName(e.target.value)}
          />
          <TextField
            style={styles.input}
            value={rollNo}
            placeholder="Roll #"
            // disabled={faculty.hasOwnProperty("email")}
            onChange={e => setRollNo(e.target.value)}
          />

          <Select
            label="Department"
            style={styles.input}
            value={dept}
            setValue={selectDeptHandler}
            items={depts}
          />
          <Button
            style={styles.input}
            // disabled={!name || !department || !email}
            size="large"
            variant="contained"
            onClick={registerHandler}
          >
            {/* {faculty.hasOwnProperty("name") ? "Update" : "Register"} */}
            Add Student
          </Button>
          <Button
            style={styles.input}
            size="large"
            variant="contained"
            onClick={() => {
              setDisplay(false);
            }}
            color="error"
          >
            Cancel
          </Button>
          {/* {error ? <Alert severity="error">{error}</Alert> : null} */}
        </Card>
      </Container>
    </Backdrop>
  );
};

export default AddStudent;
