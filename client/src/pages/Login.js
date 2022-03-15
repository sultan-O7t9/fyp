import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BG } from "../utils/Theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/auth";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (accessToken) history.replace("/");
  }, [accessToken, history]);

  const loginHandler = () => {
    dispatch(loginUser(email, password));
    history.replace("/");
  };

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: BG,
      }}
    >
      <Card
        style={{
          display: "flex",
          padding: "1.5rem 1rem",
          flexDirection: "column",
          minWidth: "25.5rem",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "3.25rem" }}>
          Log In
        </Typography>
        <TextField
          style={{ marginBottom: "1rem" }}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          style={{ marginBottom: "1rem" }}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button size="large" variant="contained" onClick={loginHandler}>
          Log in
        </Button>
      </Card>
    </Box>
  );
};

export default Login;
