import { Box, Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "../components/Select";
import MainAppbar from "../components/MainAppbar";
import Styles from "./auth.styles";
import axios from "axios";
import { useHistory } from "react-router-dom";

const RegisterGroup = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/student/get-students")
      .then(res => {
        console.log(res.data.students);
        setStudents(res.data.students);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/faculty/get-supervisors")
      .then(res => {
        console.log(res.data.supervisors);
        setSupervisors(res.data.supervisors);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

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

  const registerGroupHandler = async () => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/group/create",
        {
          members: members,
          leader: leader,
          supervisor: supervisor,
        }
      );
      console.log(result);
      if (result.data.register) {
        history.replace("/register-project");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <MainAppbar />
      <Box style={Styles.container}>
        <Card style={Styles.card}>
          <Typography variant="h5" style={Styles.heading}>
            Register Group
          </Typography>

          <Select
            required
            style={Styles.input}
            multiple={true}
            label="Team"
            value={members}
            setValue={selectMembersHandler}
            items={teamItems}
          />
          <Select
            label="Leader"
            style={Styles.input}
            value={leader}
            setValue={selectLeaderHandler}
            items={members.map(member => ({
              id: member,
              value: member,
              text: member,
            }))}
          />
          <Select
            label="Supervisor"
            style={Styles.input}
            value={supervisor}
            setValue={setSupervisor}
            items={supervisors.map(supervisor => ({
              id: supervisor.id,
              value: supervisor.id,
              text: supervisor.name,
            }))}
          />
          <Button
            size="large"
            variant="contained"
            onClick={registerGroupHandler}
          >
            Submit
          </Button>
        </Card>
      </Box>
    </>
  );
};

export default RegisterGroup;
