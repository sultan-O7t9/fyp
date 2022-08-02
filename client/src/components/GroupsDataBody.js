import {
  Button,
  IconButton,
  List,
  ListItem,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React from "react";
import Link from "./Link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";

const GroupsDataBody = ({ data, setData, editGroup, isPMO }) => {
  const history = useHistory();
  const deleteGroup = async id => {
    const response = await axios.delete(
      `http://localhost:5000/api/group/delete/${id}`
    );
    if (response.data.delete) {
      setData(data => data.filter(group => group.id !== id));
    }
  };

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
        {isPMO ? (
          <>
            <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
            <TableCell>
              <Switch />
            </TableCell>
            <TableCell align="right">
              <IconButton
                onClick={() => {
                  editGroup(row);
                }}
                color="primary"
                variant="outlined"
              >
                <EditIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  deleteGroup(row.id);
                }}
                color="error"
                variant="outlined"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </>
        ) : (
          <TableCell>
            <p
              style={{
                color: row.bookletsStatus === "Approved" ? "green" : "red",
              }}
            >
              {row.bookletsStatus}
            </p>
          </TableCell>
        )}
        <TableCell align="right">
          <Button
            onClick={() => {
              history.push("/groups/" + row.id.split("_")[2]);
            }}
          >
            Show Details
          </Button>
        </TableCell>
      </TableRow>
    ))
  );
};

export default GroupsDataBody;
