import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { BG } from "../utils/Theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/auth";
import Styles from "./auth.styles";
import axios from "axios";
import Link from "../components/Link";
import PasswordField from "../components/PasswordField";

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
    if (email.split("_").length - 1 !== 2) {
      console.log(email.split("_").length - 1);
      return setError("Please enter a valid Group ID");
    }
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
      history.replace("/main/student");
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
          Log In as Group
        </Typography>
        <TextField
          style={Styles.input}
          placeholder="Email"
          type="email"
          onChange={e => setEmail(e.target.value)}
        />
        <PasswordField
          style={Styles.input}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          size="large"
          style={Styles.input}
          variant="contained"
          disabled={!email || password.length < 6}
          onClick={loginHandler}
        >
          Log in
        </Button>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Typography variant="body1" style={{ textDecoration: "underline" }}>
            <Link to="/login">Log in as Faculty Member</Link>
          </Typography>
          <Typography variant="body2" style={{ textDecoration: "underline" }}>
            <Link to="/forget">Forget Password?</Link>
          </Typography>
        </Box>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Card>
    </Box>
  );
};

export default GroupLogin;
