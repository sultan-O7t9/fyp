import * as React from "react";
import Box from "@mui/material/Box";
// import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";
// import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logoutUser } from "../store/actions/auth";
import { useEffect } from "react";
import Toast from "./Toast";
import { refreshToken, USER_ROLE, USER_ROLES } from "../utils/keys";

export default function AppBarMenu(props) {
  const { currentRole, setCurrentRole } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [roles, setRoles] = React.useState(null);
  const open = Boolean(anchorEl);
  const [toast, setToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getAllRoles = async () => {
      if (
        localStorage.getItem(USER_ROLES).includes("group") ||
        localStorage.getItem(USER_ROLES).includes("HOD")
      ) {
        console.log("its a group");
        return;
      }
      try {
        const response = await axios.get("/api/role/faculty-all");
        setRoles(response.data.roles);
        console.log(response.data.roles);
      } catch (error) {
        console.log(error);
      }
    };
    getAllRoles();
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await axios.post("/api/auth/logout", {
        token: localStorage.getItem(refreshToken),
      });
      if (response.data.logout) {
        localStorage.clear();
        dispatch(logoutUser());

        history.replace("/login");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      window.location.reload();
    }
  };

  return (
    <React.Fragment>
      {toast ? (
        <Toast open={toast} setOpen={setToast} message={toastMessage} />
      ) : null}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          ml: 4,
        }}
      >
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        {/* <Tooltip title="Account settings"> */}
        {currentRole.includes("PMO") ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              history.push("/pmo/settings");
            }}
          >
            <SettingsIcon />
          </IconButton>
        ) : null}
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 1, color: "white" }}
          aria-controls={open ? "account-menu" : undefined}
          // aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
          <AccountCircle />
        </IconButton>
        {/* </Tooltip> */}
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {roles && roles.length
          ? roles.map(role => (
              <MenuItem
                key={role}
                disabled={localStorage.getItem(USER_ROLE).includes(role)}
                onClick={() => {
                  console.log(role);
                  localStorage.setItem(USER_ROLE, [role]);
                  history.replace("/");
                  setToastMessage("Logged in as " + role);
                  setCurrentRole(role);
                  setToast(true);
                  // window.location.reload();
                  // setTimeout(() => {
                  //   // window.location.reload();
                  // }, 1000);
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Login as {role}
              </MenuItem>
            ))
          : null}
        <MenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
