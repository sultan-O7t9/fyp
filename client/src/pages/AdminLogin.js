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
import { ADMIN_ID, USER_ROLE } from "../utils/keys";

const AdminLogin = () => {
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
    if (!email.includes("@uog.edu.pk") || email.indexOf("@uog.edu.pk") === 0)
      return setError("Please enter a valid UOG email address");
    try {
      const response = await axios.post("/api/auth/admin", {
        email,
        password,
      });
      // console.log(response.data);
      localStorage.setItem(ADMIN_ID, response.data.id);
      localStorage.setItem(USER_ROLE, ["HOD"]);
      history.replace("/admin/faculty", response.data);
      dispatch(loginUser(response.data));
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
          Log In as Admin
        </Typography>
        <TextField
          style={Styles.input}
          type="email"
          placeholder="Email"
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
          disabled={!email || password.length < 6}
          variant="contained"
          onClick={loginHandler}
        >
          Log in
        </Button>
        <Box
        // style={{
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "flex-end",
        // }}
        >
          <Typography variant="body2" style={{ textDecoration: "underline" }}>
            <Link to="/login">Log in as Faculty Member</Link>
          </Typography>
          <Typography
            variant="body2"
            style={{ textDecoration: "underline", marginTop: "0.5rem" }}
          >
            <Link to="/hod">Log in as HOD Office</Link>
          </Typography>
          <Typography
            variant="body2"
            style={{ textDecoration: "underline", marginTop: "0.5rem" }}
          >
            <Link to="/group">Log in as Student</Link>
          </Typography>
          {/* <Typography variant="body2" style={{ textDecoration: "underline" }}>
            <Link to="/group">Forget Password</Link>
          </Typography> */}
        </Box>

        {/* <Typography variant="h6" style={{ textAlign: "center" }}>
        </Typography>
        <Typography variant="h6" style={{ textAlign: "center" }}>
        </Typography> */}
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Card>
    </Box>
  );
};

export default AdminLogin;
