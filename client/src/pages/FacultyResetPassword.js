import { Box } from "@mui/system";
import * as React from "react";
import { useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import Main from "../components/Main";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import Toast from "../components/Toast";

import PasswordField from "../components/PasswordField";
import { BG } from "../utils/Theme";
import { first_login, USER_ID, USER_ROLE } from "../utils/keys";

const Inputs = ({ mailPassword, setMailPassword }) => {
  // const [pwd, setPwd] = useState("");
  return (
    <>
      <Box
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography style={{ marginBottom: "0.8rem" }}>
          Change your Password
        </Typography>
        <PasswordField
          onChange={e => {
            console.log(e.target.value);
            setMailPassword(e.target.value);
          }}
          defaultValue={mailPassword}
          style={{ width: "50%", minWidth: "200px", marginBottom: "0.8rem" }}
          size="small"
          label="Mail Password"
          placeholder="Mail Passowrd"
        />
      </Box>
    </>
  );
};

const FacultyResetPassword = () => {
  const [mailPassword, setMailPassword] = useState("");
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");
  const history = useHistory();
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    localStorage.getItem(USER_ROLE).includes("PMO");
  console.log(isEligible);

  const updateMailPasswordHandler = async () => {
    // if (!sub || !msg) {
    //   setToast(true);
    //   setTMsg("Subject and Message cannot be empty, Mail not Sent");
    //   return;
    // }
    const data = {
      userId: localStorage.getItem(USER_ID),
      password: mailPassword,
    };
    console.log(data);
    try {
      const res = await axios.post("/api/faculty/change-pass", data);
      console.log(res.data);
      localStorage.setItem(first_login, "false");
      setToast(true);
      setTMsg("Your password has been changed successfully");
      history.replace("/");
    } catch (err) {
      setToast(true);
      setTMsg("Some error has occured");
      console.log(err);
    }
  };

  if (!isEligible) return <Redirect to="/404" />;

  return (
    <div>
      {toast ? <Toast open={toast} setOpen={setToast} message={tMsg} /> : null}
      <ContainerFluid
        title="Change Your Password"
        maxWidth="xl"
        style={{ backgroundColor: BG, height: "100vh" }}
      >
        <Main>
          <Box
            sx={{
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Inputs
              mailPassword={mailPassword}
              setMailPassword={setMailPassword}
            />

            <Box style={{ marginBottom: "2rem" }}>
              <Button
                variant="contained"
                size="large"
                // disabled={!mailPassword}
                style={{ display: "block" }}
                onClick={() => {
                  updateMailPasswordHandler();
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Main>
      </ContainerFluid>
      {/* )} */}
    </div>
  );
};

export default FacultyResetPassword;
