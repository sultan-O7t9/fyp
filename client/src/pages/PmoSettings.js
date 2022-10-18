import { Box } from "@mui/system";
import * as React from "react";
import { useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import Main from "../components/Main";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import Toast from "../components/Toast";

import PasswordField from "../components/PasswordField";
import { USER_ID, USER_ROLE } from "../utils/keys";

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
          Mail Password
        </Typography>
        <PasswordField
          onBlur={e => {
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

const PmoSettings = () => {
  const [mailPassword, setMailPassword] = useState("");
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");

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
      mailPassword,
    };
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/faculty/email-pass",
        data
      );
      console.log(res.data.mail);
      if (res.data.mail) {
        setToast(true);
        setTMsg("New settings have been saved successfully");
      }
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
      <ContainerFluid title="Settings" maxWidth="xl">
        <Main>
          <Box
            sx={{
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <Inputs
              mailPassword={mailPassword}
              setMailPassword={setMailPassword}
            /> */}
            <Box
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography style={{ marginBottom: "0.8rem" }}>
                Mail Password
              </Typography>
              <PasswordField
                onChange={e => {
                  console.log(e.target.value);
                  setMailPassword(e.target.value);
                }}
                defaultValue={mailPassword}
                style={{
                  width: "50%",
                  minWidth: "200px",
                  marginBottom: "0.8rem",
                }}
                size="small"
                label="Mail Password"
                placeholder="Mail Passowrd"
              />
            </Box>

            <Box style={{ marginBottom: "2rem" }}>
              <Button
                variant="contained"
                size="large"
                disabled={!mailPassword}
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

export default PmoSettings;
