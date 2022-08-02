import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "../components/Select";
import Styles from "./auth.styles";
import axios from "axios";
// import { loginUser } from "../store/actions/auth";

const ManageFaculty = props => {
  const history = useHistory();
  const { setDisplay, faculty } = props;
  console.log(faculty);
  // const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [name, setName] = useState(faculty ? faculty.name : "");
  const [email, setEmail] = useState(faculty ? faculty.email : "");
  const [password, setPassword] = useState("");
  const [allDepartments, setAllDepartments] = useState([]);
  const [department, setDepartment] = useState(
    faculty ? faculty.departmentId : ""
  );
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     if (
  //       faculty.hasOwnProperty("name") &&
  //       faculty.hasOwnProperty("email") &&
  //       faculty.hasOwnProperty("department")
  //     ) {
  //       console.log("SET FACULTY");
  //       setName(faculty.name);
  //       setEmail(faculty.email);
  //       setDepartment(faculty.department);
  //     }
  //   }, [faculty]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dept/get-all")
      .then(res => {
        console.log(res.data.departments);
        setAllDepartments(res.data.departments);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const registerHandler = async () => {
    console.log(name, email, password, department);
    setError(null);
    if (!email.includes("@uog.edu.pk"))
      return setError("Please enter a valid UOG email address");
    // dispatch(registerUser(name, email, password, department));
    console.log(name, email, password, department);

    try {
      if (
        faculty.hasOwnProperty("name") &&
        faculty.hasOwnProperty("email") &&
        faculty.hasOwnProperty("department")
      ) {
        const res = await axios.put(
          "http://localhost:5000/api/faculty/update",
          {
            id: faculty.id,
            email: faculty.email,
            name: name,
            departmentId: department,
          }
        );
        console.log(res);

        setDisplay(false);
        return;
      }
      const result = await axios.post(
        "http://localhost:5000/api/faculty/register",
        {
          email,
          password,
          name,
          departmentId: department,
        }
      );
      console.log(result);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    } finally {
      setDisplay(false);
    }
  };

  // history.replace("/");

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container
        maxWidth="md"
        style={{ maxHeight: "80vh", overflowY: "scroll" }}
      >
        <Card style={Styles.card}>
          <Typography variant="h5" style={Styles.heading}>
            Register
          </Typography>
          <TextField
            style={Styles.input}
            value={name}
            placeholder="Name"
            onChange={e => setName(e.target.value)}
          />
          <TextField
            style={Styles.input}
            value={email}
            placeholder="@uog.edu.pk"
            type="email"
            disabled={faculty.hasOwnProperty("email")}
            onChange={e => setEmail(e.target.value)}
          />
          {faculty.hasOwnProperty("name") &&
          faculty.hasOwnProperty("email") &&
          faculty.hasOwnProperty("department") ? null : (
            <TextField
              style={Styles.input}
              placeholder="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          )}
          <Select
            label="Department"
            style={Styles.input}
            value={department}
            setValue={setDepartment}
            items={
              allDepartments.length > 0
                ? allDepartments.map(dept => ({
                    id: dept.id,
                    value: dept.id,
                    text: dept.name,
                  }))
                : []
            }
          />
          <Button
            style={Styles.input}
            disabled={!name || !department || !email}
            size="large"
            variant="contained"
            onClick={registerHandler}
          >
            {faculty.hasOwnProperty("name") ? "Update" : "Register"}
          </Button>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Card>
      </Container>
    </Backdrop>
  );
};

export default ManageFaculty;
