import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { BG } from "../utils/Theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/auth";
import Styles from "./auth.styles";
import axios from "axios";
import Link from "../components/Link";
import PasswordField from "../components/PasswordField";
import Toast from "../components/Toast";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const ForgetPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // window.location.reload();
    if (accessToken) history.replace("/");
  }, [accessToken, history]);

  const loginHandler = async () => {
    setError(null);
    // if (!email.includes("@uog.edu.pk") || email.indexOf("@uog.edu.pk") === 0)
    if (
      (email.includes("@uog.edu.pk") && email.indexOf("@uog.edu.pk") !== 0) ||
      email.split("_").length - 1 == 2
    ) {
      try {
        const response = await axios.post("/api/auth/forget", { email });
        console.log(response.data);
        if (response.data.email) {
          setToast(true);
          let m = "The password has been sent to email of your Group Leader";
          if (email.includes("@uog.edu.pk"))
            m = "The password has been sent to your email";

          setMsg(m);
        }
        // dispatch(loginUser(response.data));
        // console.log(response.data);

        // history.replace("/");
      } catch (error) {
        console.log(error);
        //  Generate an alert here.
        console.log(error.response?.data?.message);
        // setError(error.response?.data?.message);
        if (email.includes("@uog.edu.pk"))
          setError("Faculty Member with this email does not exist");
        else setError("Group with this ID does not exist");
      }
    } else
      return setError("Please enter a valid UOG email address or Group ID");
  };

  return (
    <>
      {toast ? (
        <Toast duration={5000} open={toast} setOpen={setToast} message={msg} />
      ) : null}
      <Box style={Styles.container}>
        <Card style={{ ...Styles.card, minWidth: "412px", minHeight: "340px" }}>
          <Box style={{ marginBottom: "1rem" }}>
            <Tooltip title="Back to Login">
              <IconButton
                onClick={() => {
                  history.goBack();
                }}
                style={{ backgroundColor: "rgba(25,116,208,0.5)" }}
              >
                <ArrowBackRoundedIcon
                  style={{
                    fontSize: "1rem",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="h5" style={Styles.heading}>
            Forget Password
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
            Enter your UOG Email
          </Typography>
          <TextField
            style={Styles.input}
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          {/* <PasswordField
          style={Styles.input}
          // type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        /> */}
          <Button
            size="large"
            style={Styles.input}
            disabled={!email}
            variant="contained"
            onClick={loginHandler}
          >
            Send
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
              <Link to="/group">Log in as Student</Link>
            </Typography>
            {/* <Typography variant="body2" style={{ textDecoration: "underline" }}>
            <Link to="/group">Forget Password</Link>
          </Typography> */}
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Card>
      </Box>
    </>
  );
};

export default ForgetPassword;
