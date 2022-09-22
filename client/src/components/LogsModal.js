import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../pages/auth.styles";
import Select from "./Select";
import CancelIcon from "@mui/icons-material/Cancel";
// import Select from "../components/Select";
// import styles from "./auth.styles";

const LogsModal = props => {
  const { setDisplay, data } = props;

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container maxWidth="lg" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Card style={styles.card}>
          <Box
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h5">Evaluation Change Logs</Typography>
            <IconButton
              onClick={() => {
                setDisplay(false);
              }}
            >
              <CancelIcon style={{ color: "red" }} fontSize="large" />
            </IconButton>
          </Box>
          <Box>
            <Box>
              <ul
                style={{ margin: 0, listStyleType: "none", padding: " 0 1rem" }}
              >
                {/* <li
                  style={{
                    width: "100%",
                    margin: 0,

                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                  }}
                >
                  <div style={{ width: "33%" }}>
                    <Typography variant="h6">Group</Typography>
                  </div>
                  <div style={{ width: "33%" }}>
                    <Typography variant="h6">Days</Typography>
                  </div>
                  <div style={{ width: "33%" }}>
                    <Typography variant="h6">Actions</Typography>
                  </div>
                </li> */}
                {data.length > 0 ? (
                  data.map(log => {
                    const daysAgo =
                      Math.round(
                        ((new Date().getTime() -
                          new Date(log.createdAt).getTime()) /
                          86400000) *
                          10
                      ) / 10;
                    const hrsAgo =
                      Math.round(
                        ((new Date().getTime() -
                          new Date(log.createdAt).getTime()) /
                          3600000) *
                          10
                      ) / 10;
                    return (
                      <li
                        style={{
                          //   backgroundColor: "red",
                          padding: "0.5rem 1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "2px solid #ccc",
                          fontSize: "1.2rem",
                        }}
                        key={log.id}
                      >
                        <Typography variant="subtitle1">{log.text}</Typography>
                        <Typography
                          style={{ marginLeft: "1rem" }}
                          variant="body2"
                        >
                          {daysAgo < 1
                            ? hrsAgo + " Hrs ago"
                            : daysAgo + " Days ago"}
                        </Typography>
                      </li>
                    );
                  })
                ) : (
                  <li>No Logs</li>
                )}
              </ul>
            </Box>
          </Box>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default LogsModal;
