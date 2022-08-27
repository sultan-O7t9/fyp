import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  Typography,
} from "@mui/material";
import styles from "../pages/auth.styles";

const DeleteConfirmationDialog = props => {
  const { item, itemType, handleDelete, setOpen } = props;

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Container
        maxWidth="sm"
        style={{
          height: "500px",
          overflowY: "hidden",
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%,-50%)",
        }}
      >
        <Card style={styles.card}>
          <Typography variant="h5">Deleting {item}</Typography>
          <Box style={{ margin: "1rem 0" }}>
            <Typography variant="h6">
              Are you sure you want to delete this {itemType}?
            </Typography>
          </Box>

          <Box>
            <Button variant="contained" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: "1rem" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default DeleteConfirmationDialog;
