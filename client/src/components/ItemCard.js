import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "./Link";

const ItemCard = props => {
  const { styles, item, index } = props;
  const roles = localStorage.getItem("USER_ROLE");
  return (
    <Link
      to={
        item.hasOwnProperty("deadline")
          ? roles.includes("PMO") || roles.includes("EVALUATOR")
            ? "/deliverable/" + item.id
            : "/sup/deliverable/" + item.id
          : item.link
      }
      style={{ textDecoration: "none", width: "calc(50% - 1.5rem)" }}
      variant="h5"
    >
      <Paper
        style={{
          backgroundColor: "#fff",
          marginBottom: "2rem",
          minHeight: "156px",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "row",
          minWidth: "100%",
          // background:
          //   "linear-gradient(31deg, rgba(96,228,255,1) 0%, rgba(21,217,255,1) 54%, rgba(0,212,255,1) 100%)",
          background:
            "linear-gradient(31deg, rgba(25,117,210,1) 0%, rgba(25,117,210,0.95) 54%, rgba(25,117,210,0.7) 100%)",
          justifyContent: "space-between",
          ...styles,
        }}
      >
        <Box>
          <Typography
            style={{ fontWieght: "bold", color: "#ddd" }}
            variant="caption"
          >
            {item.title.split(" ")[0]}
          </Typography>
          <br />

          <Typography variant="h5" style={{ color: "#fff" }}>
            {item.title}
          </Typography>

          {item.hasOwnProperty("deadline") ? (
            <Typography style={{ color: "#ddd" }} variant="subtitle1">
              Deadline:{" "}
              {item.deadline
                ? new Date(item.deadline).toLocaleDateString()
                : "None"}
            </Typography>
          ) : null}
        </Box>
      </Paper>
    </Link>
  );
};

export default ItemCard;
