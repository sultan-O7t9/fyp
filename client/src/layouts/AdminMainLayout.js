import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import MainAppbar from "../components/MainAppbar";
import { BG } from "../utils/Theme";

const navLinks = [
  {
    name: localStorage.getItem("HOD_ID") ? "" : "Faculty",
    path: "/admin/faculty",
    icon: "dashboard",
  },
  {
    name: "Groups",
    path: localStorage.getItem("HOD_ID") ? "/hod/groups" : "/admin/groups",
    icon: "group",
  },
  {
    name: localStorage.getItem("HOD_ID") ? "" : "Departments",
    path: "/admin/dept",
    icon: "person",
  },
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
        links={navLinks.filter(link => link.name)}
      />
      {children}
    </Box>
  );
};

export default AdminMainLayout;
