import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../pages/auth.styles";
import Select from "./Select";
// import Select from "../components/Select";
// import styles from "./auth.styles";

const MailItem = props => {
  const { mail, setDisplay } = props;

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container maxWidth="md" style={{ height: "80vh", overflowY: "auto" }}>
        <Card style={{ ...styles.card, height: "100%" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <IconButton
              onClick={() => {
                setDisplay(false);
              }}
            >
              <CancelIcon style={{ color: "red" }} fontSize="medium" />
            </IconButton>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h5"
              style={{ ...styles.heading, marginBottom: "1.5rem" }}
            >
              {mail.subject}
            </Typography>
            <Typography variant="caption">
              {new Date(mail.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Divider />

          <Box style={{ display: "flex", margin: "1rem 0" }}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", marginRight: "1rem" }}
            >
              To:
            </Typography>
            <Typography variant="caption" style={{ color: "#888" }}>
              {mail.recipiants.join(", ")}
            </Typography>
          </Box>
          <Divider />
          <Typography variant="body1" style={{ margin: "1rem 0" }}>
            {mail.body}
          </Typography>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default MailItem;
