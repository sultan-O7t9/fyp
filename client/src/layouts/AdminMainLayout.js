import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import MainAppbar from "../components/MainAppbar";
import { BG } from "../utils/Theme";

const navLinks = [
  { name: "Faculty", path: "/admin/faculty", icon: "dashboard" },
  { name: "Groups", path: "/admin/groups", icon: "group" },
  { name: "Departments", path: "/admin/dept", icon: "person" },
];

const AdminMainLayout = props => {
  const { children } = props;
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(state => !state);
  };

  return (
    <Box sx={{ backgroundColor: BG, minHeight: "100vh" }}>
      <MainAppbar toggleSidebar={toggleSidebar} menu={true} />
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        links={navLinks}
      />
      {children}
    </Box>
  );
};

export default AdminMainLayout;
