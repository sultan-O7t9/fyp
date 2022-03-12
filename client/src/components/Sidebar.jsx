import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Icon } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function Sidebar(props) {
  const { showSidebar, toggleSidebar, links } = props;

  return (
    <div>
      <React.Fragment>
        <Drawer anchor={"left"} open={showSidebar} onClose={toggleSidebar}>
          <SidebarListItems toggleSidebar={toggleSidebar} items={links} />
        </Drawer>
      </React.Fragment>
    </div>
  );
}

const SidebarListItems = ({ items, toggleSidebar }) => {
  const history = useHistory();

  const navigationHandler = path => {
    history.push(path);
    toggleSidebar();
  };

  return (
    <List style={{ minWidth: "250px" }}>
      {items.map(item => (
        <div key={item.path}>
          <ListItem
            button
            onClick={() => {
              navigationHandler(item.path);
            }}
          >
            <ListItemIcon>
              <Icon>{item.icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  );
};
