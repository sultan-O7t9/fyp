import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import MainAppbar from "../components/MainAppbar";
import { BG } from "../utils/Theme";

const navLinks = [
  { name: "Dashboard", path: "/", icon: "dashboard" },
  { name: "Groups", path: "/groups", icon: "group" },
  { name: "Students", path: "/students", icon: "person" },
];

const MainLayout = props => {
  const { children } = props;
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(state => !state);
  };

  return (
    <Box sx={{ backgroundColor: BG, minHeight: "100vh" }}>
      <MainAppbar toggleSidebar={toggleSidebar} />
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        links={navLinks}
      />
      {children}
    </Box>
  );
};

export default MainLayout;
