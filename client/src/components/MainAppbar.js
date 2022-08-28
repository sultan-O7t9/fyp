import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBarMenu from "./AppBarMenu";

export default function MainAppbar(props) {
  const { toggleSidebar, menu } = props;
  const [currentRole, setCurrentRole] = React.useState(
    localStorage.getItem("USER_ROLE")
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {menu ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
        ) : null}
        <Box
          component="div"
          sx={{ flexGrow: 1, justifyContent: "flex-end", display: "flex" }}
        >
          {currentRole.includes("PMO") ||
          currentRole.includes("SUPERVISOR") ||
          currentRole.includes("EVALUATOR") ? (
            <p style={{ fontSize: "12px" }}>Logged in as {currentRole}</p>
          ) : null}
        </Box>

        <AppBarMenu currentRole={currentRole} setCurrentRole={setCurrentRole} />
      </Toolbar>
    </AppBar>
  );
}
