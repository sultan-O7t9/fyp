import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, List, ListItem } from "@mui/material";

export default function InnerAppbar(props) {
  const { title, actions } = props;

  return (
    <Toolbar style={{ padding: 0 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>

      {actions && actions.length ? (
        <List>
          {actions.map((action, index) => (
            <ListItem key={index}>
              <Button variant="contained" onClick={action.onClick}>
                {action.name}
              </Button>
            </ListItem>
          ))}
        </List>
      ) : null}
    </Toolbar>
  );
}
