import { Link, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

const ItemCard = props => {
  const { styles } = props;
  return (
    <Paper
      style={{
        marginBottom: "1.5rem",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...styles,
      }}
    >
      <Box>
        <Typography variant="caption">Deliverable 1</Typography>
        <br />
        <Link href="#" style={{ textDecoration: "none" }} variant="h5">
          Project Proposal
        </Link>
        <Typography variant="subtitle1">Project Idea & Proposal</Typography>
      </Box>
      <Box style={{ alignSelf: "center" }}>
        <Typography variant="h4">4 out of 10</Typography>
      </Box>
    </Paper>
  );
};

export default ItemCard;
