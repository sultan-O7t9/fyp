import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { USER_ROLE } from "../utils/keys";
import Link from "./Link";

const ItemCard = props => {
  const { styles, item, index, manual } = props;
  const roles = localStorage.getItem(USER_ROLE);
  let route = item.link;
  if (roles.includes("PMO")) route = "/deliverable/" + item.id;
  else if (roles.includes("SUPERVISOR")) route = "/sup/deliverable/" + item.id;
  else if (roles.includes("EVALUATOR")) route = "/deliverable/sched/" + item.id;
  return (
    <Link
      to={manual ? item.link : route}
      style={{ textDecoration: "none", width: "calc(33% - 1.5rem)" }}
      variant="h5"
    >
      <Paper
        style={{
          backgroundColor: "#fff",
          marginBottom: "2rem",
          // marginRight: "1rem",
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
