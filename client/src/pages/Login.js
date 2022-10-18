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
import { first_login } from "../utils/keys";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // window.location.reload();
    if (accessToken) history.replace("/");
  }, [accessToken, history]);

  const loginHandler = async () => {
    setError(null);
    // if (!email.includes("@uog.edu.pk") || email.indexOf("@uog.edu.pk") === 0)
    //   return setError("Please enter a valid UOG email address");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log(response.data);
      localStorage.setItem(first_login, response.data.first_login);
      dispatch(loginUser(response.data));
      // console.log(response.data);
      history.replace("/");
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
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <PasswordField
          style={Styles.input}
          // type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          size="large"
          style={Styles.input}
          disabled={!email || password.length < 5}
          variant="contained"
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
            <Link to="/group">Log in as Group</Link>
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

export default Login;
