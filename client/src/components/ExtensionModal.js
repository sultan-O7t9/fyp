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

const ExtensionModal = props => {
  const {
    setDisplay,
    deliverableId,
    setToastMessage,
    total,
    setTotal,
    setShowToast,
  } = props;

  const [requestedExtensions, setRequestedExtensions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/deliverable/ex-get",
          { deliverableId }
        );
        console.log(res.data);
        setRequestedExtensions(res.data.extensions);
        setTotal(res.data.extensions.length);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [deliverableId]);

  const handleExtensionStatus = async (extensionId, status) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/ex-status",
        { id: extensionId, status }
      );
      console.log(res.data);
      setToastMessage("Extension status updated successfully");
      setShowToast(true);
      setRequestedExtensions(extension =>
        extension.filter(ext => ext.id !== extensionId)
      );
    } catch (error) {
      console.log(error);
      setToastMessage("Error updating extension status");
      setShowToast(true);
    }
  };

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container maxWidth="md" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Card style={styles.card}>
          <Box
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h5">
              Extension Requests for Deliverable {deliverableId}
            </Typography>
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
                <li
                  style={{
                    width: "100%",
                    margin: 0,

                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                  }}
                >
                  <div style={{ width: "25%" }}>
                    <Typography variant="h6">Group</Typography>
                  </div>
                  <div style={{ width: "25%" }}>
                    <Typography variant="h6">Supervisor</Typography>
                  </div>
                  <div style={{ width: "25%" }}>
                    <Typography variant="h6">Days</Typography>
                  </div>
                  <div style={{ width: "25%" }}>
                    <Typography variant="h6">Actions</Typography>
                  </div>
                </li>
                {requestedExtensions.length > 0 ? (
                  requestedExtensions.map(extension => (
                    <li
                      key={extension.group + extension.days}
                      style={{
                        width: "100%",
                        margin: 0,

                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0",
                      }}
                    >
                      <div style={{ width: "25%" }}>
                        <Typography variant="body1">
                          {extension.group}
                        </Typography>
                      </div>
                      <div style={{ width: "25%" }}>
                        <Typography variant="body1">
                          {extension.supervisor}
                        </Typography>
                      </div>
                      <div style={{ width: "25%" }}>
                        <Typography variant="body1">
                          {extension.days}
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "25%",
                          //   display: "flex",
                          //   justifyContent: "center",
                        }}
                      >
                        <Button
                          style={{ marginRight: "1rem" }}
                          variant="contained"
                          onClick={() => {
                            handleExtensionStatus(extension.id, "Approved");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            handleExtensionStatus(extension.id, "Rejected");
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <Typography variant="body1">
                      No extension requests
                    </Typography>
                  </li>
                )}
              </ul>
            </Box>
          </Box>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default ExtensionModal;
