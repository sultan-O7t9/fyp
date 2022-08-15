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
import React, { useState } from "react";
import Link from "./Link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const DataItem = props => {
  const { row, roles, editGroup, deleteGroup } = props;
  const history = useHistory();
  const [bookletStatus, setBookletStatus] = useState(false);

  useEffect(() => {
    console.log(row);
    setBookletStatus(row.bookletsStatus !== "Not Submitted");
  }, [row]);

  const changeBookletStatus = async (id, status) => {
    const data = {
      groupId: id.split("_").pop(),
      status: status,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/group/change-booklet-status",
        data
      );
      setBookletStatus(response.data.group.bookletsStatus === "Approved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow key={row.id}>
      <TableCell>{row.id}</TableCell>
      {/* <TableCell>{row.members}</TableCell> */}
      <TableCell>
        <List>
          {row.members.map(member => {
            return (
              <ListItem
                style={{ padding: 0 }}
                key={member.rollNo + member.name}
              >
                {member.rollNo}
              </ListItem>
            );
          })}
        </List>
      </TableCell>
      <TableCell>{row.project ? row.project : "None"}</TableCell>
      {roles.includes("PMO") ? (
        <>
          <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
          <TableCell>
            <Switch
              checked={bookletStatus}
              onChange={e => {
                setBookletStatus(e.target.checked);
                changeBookletStatus(
                  row.id,
                  e.target.checked ? "Approved" : "Not Submitted"
                );
              }}
            />
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
  );
};

const GroupsDataBody = ({ data, setData, editGroup, isPMO }) => {
  const roles = localStorage.getItem("USER_ROLE");
  const deleteGroup = async id => {
    const response = await axios.delete(
      `http://localhost:5000/api/group/delete/${id}`
    );
    if (response.data.delete) {
      setData(data => data.filter(group => group.id !== id));
    }
  };

  // useEffect(() => {
  //   setBookletStatus(
  //     data.map(group => ({ id: group.id, status: group.bookletsStatus }))
  //   );
  // }, [data]);

  return (
    data &&
    data.map((row, index) => {
      //find GroupDetail
      // const groupId = row.id;
      // const status = bookletStatus.find(booklet => booklet.id === groupId);
      // console.log(status);
      return (
        <DataItem
          row={row}
          key={index}
          index={index}
          editGroup={editGroup}
          deleteGroup={deleteGroup}
          isPMO={isPMO}
          roles={roles}
        />
      );
    })
  );
};

export default GroupsDataBody;
