import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { BG } from "../utils/Theme";

const Login = () => {
  const history = useHistory();
  const loginHandler = () => {
    history.replace("/dashboard");
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
        <TextField style={{ marginBottom: "1rem" }} placeholder="Email" />
        <TextField style={{ marginBottom: "1rem" }} placeholder="Password" />
        <Button size="large" variant="contained" onClick={loginHandler}>
          Log in
        </Button>
      </Card>
    </Box>
  );
};

export default Login;
