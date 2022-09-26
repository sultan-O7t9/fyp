import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import MainAppbar from "../components/MainAppbar";
import { BG } from "../utils/Theme";
import { USER_ROLE } from "../utils/keys";

const MainLayout = props => {
  const { children } = props;
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(state => !state);
  };

  const roles = localStorage.getItem(USER_ROLE);
  console.log(roles);
  const navLinks = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    // {
    //   name: roles && roles.includes("PMO") ? "Semesters" : null,
    //   path: "/semesters",
    //   icon: "menubook",
    // },
    {
      name:
        roles && roles.includes("SUPERVISOR")
          ? "My Groups"
          : roles && roles.includes("PMO")
          ? "Groups"
          : null,
      path: "/groups",
      icon: "group",
    },
    {
      name: roles && roles.includes("PMO") ? "Students" : null,
      path: "/students",
      icon: "person",
    },
    {
      name: roles && roles.includes("PMO") ? "Committees" : null,
      path: "/committees",
      icon: "people",
    },
  ];

  return (
    <Box sx={{ backgroundColor: BG, minHeight: "100vh" }}>
      <MainAppbar toggleSidebar={toggleSidebar} menu={true} />
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        links={navLinks.filter(link => link.name)}
      />
      {children}
    </Box>
  );
};

export default MainLayout;
