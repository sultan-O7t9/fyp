import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { BG } from "../utils/Theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/auth";
import Styles from "./auth.styles";
import axios from "axios";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) history.replace("/");
  }, [accessToken, history]);

  const loginHandler = async () => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
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
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          style={Styles.input} type="password"
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
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Card>
    </Box>
  );
};

export default Login;
