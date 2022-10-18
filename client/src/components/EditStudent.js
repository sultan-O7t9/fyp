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
import Toast from "./Toast";
// import Select from "../components/Select";
// import styles from "./auth.styles";

const EditStudent = props => {
  const { setDisplay, student, students } = props;
  console.log(students);

  const [committee, setCommittee] = useState([]);
  const [toast, setToast] = useState(false);
  const [msg, setMsg] = useState("");
  const [evaluationDate, setEvaluationDate] = useState("");
  const [groupItems, setGroupItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [dept, setDept] = useState("");
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    setName(student.name);
    setRollNo(student.rollNo);

    setDept(student.deptId);
  }, [student]);

  // const [students, setStudents] = useState([]);
  // const [supervisors, setSupervisors] = useState([]);
  // const [members, setMembers] = useState([]);
  // const [leader, setLeader] = useState("");
  // const [supervisor, setSupervisor] = useState("");

  useEffect(() => {
    const getDept = async () => {
      try {
        const resDept = await axios.get("/api/dept/get-all");
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

  const updateHandler = async () => {
    if (
      students.find(student => student === rollNo) &&
      rollNo != student.rollNo
    ) {
      // alert("Student already exists");
      setToast(true);
      setMsg("ERROR: Student already exists");
      return;
    }
    if (
      rollNo.toString().split("-")[0].length != 8 ||
      rollNo.toString().split("-")[1].length != 3
    ) {
      console.log(rollNo.toString().split("-")[0].length);
      console.log(rollNo.toString().split("-")[1].length);
      setToast(true);
      setMsg("ERROR: Invalid Roll No");
      return;
    }
    try {
      const res = await axios.post("/api/student/update", {
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
  const selectDeptHandler = dept => {
    console.log("Dept", dept);
    setDept(dept);
  };

  return (
    <>
      {toast ? <Toast open={toast} setOpen={setToast} message={msg} /> : null}

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
              onClick={updateHandler}
            >
              {/* {faculty.hasOwnProperty("name") ? "Update" : "Register"} */}
              Edit Student
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
    </>
  );
};

export default EditStudent;
