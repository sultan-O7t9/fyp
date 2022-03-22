import { List, ListItem, TableCell, TableRow } from "@mui/material";
import React from "react";
import Link from "./Link";

const GroupsDataBody = ({ data }) => {
  return (
    data &&
    data.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        {/* <TableCell>{row.members}</TableCell> */}
        <TableCell>
          <List>
            {row.members.map(member => (
              <ListItem
                style={{ padding: 0 }}
                key={member.rollNo + member.name}
              >
                <Link to="#" style={{ textDecoration: "none" }}>
                  {member.rollNo}
                </Link>
              </ListItem>
            ))}
          </List>
        </TableCell>
        <TableCell>{row.project ? row.project : "None"}</TableCell>
        <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
      </TableRow>
    ))
  );
};

export default GroupsDataBody;
