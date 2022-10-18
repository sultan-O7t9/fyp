import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "../components/Select";
import Styles from "./auth.styles";
import axios from "axios";
// import { loginUser } from "../store/actions/auth";

const Register = () => {
  const history = useHistory();
  // const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allDepartments, setAllDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) history.replace("/");
  }, [accessToken, history]);

  useEffect(() => {
    axios
      .get("/api/dept/get-all")
      .then(res => {
        console.log(res.data.departments);
        setAllDepartments(res.data.departments);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const registerHandler = () => {
    setError(null);
    if (!email.includes("@uog.edu.pk"))
      return setError("Please enter a valid UOG email address");
    if (email.indexOf("@uog.edu.pk") === 0)
      return setError("Please enter a valid UOG email address");
    // dispatch(registerUser(name, email, password, department));
    console.log(name, email, password, department);
    axios
      .post("/api/faculty/register", {
        email,
        password,
        name,
        departmentId: department,
      })
      .then(res => {
        console.log(res.data);
        history.replace("/login");
      })
      .catch(err => {
        console.log(err);
        setError(err.response.data.message);
      });
  };

  // history.replace("/");

  return (
    <Box style={Styles.container}>
      <Card style={Styles.card}>
        <Typography variant="h5" style={Styles.heading}>
          Register
        </Typography>
        <TextField
          style={Styles.input}
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />
        <TextField
          style={Styles.input}
          placeholder="@uog.edu.pk"
          type="email"
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          style={Styles.input}
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
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
          disabled={!name || !department || !email || !password}
          size="large"
          variant="contained"
          onClick={registerHandler}
        >
          Register
        </Button>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Card>
    </Box>
  );
};

export default Register;
