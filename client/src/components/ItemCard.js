import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "./Link";

const ItemCard = props => {
  const { styles, item, index } = props;
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
        <Typography variant="caption">{index}</Typography>
        <br />
        <Link
          to={"/deliverable/" + item.id}
          style={{ textDecoration: "none" }}
          variant="h5"
        >
          {item.title}
        </Link>

        <Typography variant="subtitle1">{item.description}</Typography>
      </Box>
      <Box style={{ alignSelf: "center" }}>
        <Typography variant="h4">{item.percentage}</Typography>
      </Box>
    </Paper>
  );
};

export default ItemCard;