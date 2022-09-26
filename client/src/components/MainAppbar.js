import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBarMenu from "./AppBarMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import { USER_ROLE } from "../utils/keys";

export default function MainAppbar(props) {
  const { toggleSidebar, menu } = props;
  const [currentRole, setCurrentRole] = React.useState(
    localStorage.getItem(USER_ROLE) ? localStorage.getItem(USER_ROLE) : []
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
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            display: "flex",
            alignitems: "center",
          }}
        >
          {currentRole.includes("PMO") ||
          currentRole.includes("SUPERVISOR") ||
          currentRole.includes("EVALUATOR") ? (
            <p style={{ fontSize: "12px", marginLeft: "1rem" }}>
              Logged in as {currentRole}
            </p>
          ) : null}
        </Box>

        <AppBarMenu currentRole={currentRole} setCurrentRole={setCurrentRole} />
      </Toolbar>
    </AppBar>
  );
}
