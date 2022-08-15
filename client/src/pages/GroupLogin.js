import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { BG } from "../utils/Theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/auth";
import Styles from "./auth.styles";
import axios from "axios";
import Link from "../components/Link";

const GroupLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) history.replace("/main/student");
  }, [accessToken, history]);

  const loginHandler = async () => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      // dispatch(loginUser(response.data));
      console.log(response.data);
      //   const { accessToken } = response.data;
      dispatch(loginUser(response.data));
      const groupID = localStorage.getItem("USER_ID");

      axios
        .get(`http://localhost:5000/api/project/get-grp/${groupID}`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          history.replace("/register-project");
          console.log(err);
        });
      //   console.log(groupInfo.data);
      history.replace("/main/student");
    } catch (error) {
      //  Generate an alert here.
      console.log(error.response?.data?.message);
      setError(error.response?.data?.message);
    }
  };

  return (
    <Box style={Styles.container}>
      <Card style={Styles.card}>
        <Typography variant="h5" style={Styles.heading}>
          Log In
        </Typography>
        <TextField
          style={Styles.input}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          style={Styles.input}
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          size="large"
          style={Styles.input}
          variant="contained"
          onClick={loginHandler}
        >
          Log in
        </Button>
        <Typography variant="h6" style={{ textAlign: "center" }}>
          <Link to="/login">Log in as Faculty Member</Link>
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Card>
    </Box>
  );
};

export default GroupLogin;
