import {
  Backdrop,
  Button,
  CircularProgress,
  List,
  ListItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import ExportAsExcel from "../components/ExportAsExcel";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";
import Link from "../components/Link";
import Main from "../components/Main";
import ManageGroup from "./ManageGroup";

import { IconButton } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import Select from "../components/Select";
import styles from "./auth.styles";

const DATA = {
  heads: ["Group ID", "Members", "Project Title", "Supervisor"],
  data: [
    {
      id: "SE_18_1",
      project: "Project 1",
      supervisor: "Supervisor 1",
      bookletsStatus: "Approved",
    },
    {
      id: "SE_18_2",
      project: "Project 1",
      supervisor: "Supervisor 1",
      bookletsStatus: "Not Submitted",
    },
    {
      id: "SE_18_3",
      project: "Project 1",
      supervisor: "Supervisor 1",
      bookletsStatus: "Approved",
    },
  ],
};

const DataBody = ({ data, depts }) => {
  const [filter, setFilter] = useState("All");
  const [filteredData, setFilteredData] = useState([...data]);
  const filters = ["All", ...depts];

  useEffect(() => {
    if (filter === "All") setFilteredData(data);
    // else if (filter === "In Groups") {
    //   setFilteredData(data.filter(item => item.group !== null));
    // } else if (filter === "Not In Groups") {
    //   setFilteredData(data.filter(item => item.group === null));
    // }
    else {
      setFilteredData(data.filter(item => item.department === filter));
    }
  }, [filter, data]);

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography variant="body1">Filter</Typography>
        </TableCell>
        <TableCell colSpan={2}>
          <Select
            required
            style={{ ...styles.input, margin: 0 }}
            label="Filter"
            value={filter}
            setValue={setFilter}
            items={filters.map(filter => ({
              id: filter,
              value: filter,
              text: filter,
            }))}
          />
        </TableCell>
      </TableRow>

      {data &&
        data.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            {/* <TableCell>{row.members}</TableCell> */}
            {/* <TableCell>
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
        </TableCell> */}
            <TableCell>{row.project ? row.project : "None"}</TableCell>
            <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
            <TableCell>
              <p
                style={{
                  color: row.bookletsStatus === "Approved" ? "green" : "red",
                }}
              >
                {row.bookletsStatus}
              </p>
            </TableCell>
            {/* <TableCell align="right">
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
        <TableCell align="right">
          <Button
            onClick={() => {
              history.push("/groups/" + row.id.split("_")[2]);
            }}
          >
            Show Details
          </Button>
        </TableCell> */}
          </TableRow>
        ))}
    </>
  );
};

const AdminAllGroups = () => {
  const [heads, setHeads] = useState([
    "Group ID",
    "Project Title",
    "Supervisor",
    "Booklet Status",
    "",
  ]);
  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManageGroup, setShowManageGroup] = useState(false);
  const [depts, setDepts] = useState([]);
  useEffect(() => {
    setIsLoading(true);

    const getData = async () => {
      setIsLoading(false);
      try {
        const resGroup = await axios.get(
          "http://localhost:5000/api/group/get-groups"
        );
        const resDept = await axios.get(
          "http://localhost:5000/api/dept/get-all"
        );
        console.log(resGroup.data);
        console.log(resDept.data);
        setBody(resGroup.data.groups);
        setDepts(resDept.data.departments);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
    // axios
    //   .get("http://localhost:5000/api/group/get-all")
    //   .then(res => {
    //     setBody(res.data.groups);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, [showManageGroup]);

  const editGroupHandler = group => {
    setShowManageGroup(group ? group : true);
  };

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <ContainerFluid>
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">Groups</Typography>
          </Box>
          {/* <Box style={{ display: "flex", flexDirection: "column" }}>
            <ExportAsExcel
              label="Export Groups"
              data={[
                [...heads],
                ...body.map(row => [
                  row.id,
                  row.members.map(member => member.rollNo).join(","),
                  row.project ? row.project.title : "None",
                  row.supervisor ? row.supervisor : "None",
                ]),
              ]}
            />
            {/* <Button
              style={{ marginTop: ".5rem" }}
              variant="contained"
              color="primary"
              onClick={() => editGroupHandler()}
            >
              Add Group
            </Button> 
          </Box> */}
        </Box>
        <DataTable
          DataHead={() => <GroupsDataHead heads={heads} />}
          DataBody={() => (
            <DataBody
              data={body}
              // data={DATA.data}
              depts={depts.map(dept => dept.name)}
              setData={setBody}
              editGroup={editGroupHandler}
            />
          )}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AdminAllGroups;
