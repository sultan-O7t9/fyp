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
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
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

import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";

import { IconButton } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Redirect, useHistory } from "react-router-dom";
import Select from "../components/Select";
import styles from "./auth.styles";
import AdminMainLayout from "../layouts/AdminMainLayout";
import { USER_ROLE } from "../utils/keys";

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
  console.log(data);
  // const [filter, setFilter] = useState("All");
  const [gridData, setGridData] = useState(data);
  const [gridCols, setGridCols] = useState([]);
  console.log("data", data, depts);
  // const [filteredData, setFilteredData] = useState([...data]);
  // const filters = ["All", ...depts];

  // useEffect(() => {
  //   if (filter === "All") setFilteredData(data);
  //   // else if (filter === "In Groups") {
  //   //   setFilteredData(data.filter(item => item.group !== null));
  //   // } else if (filter === "Not In Groups") {
  //   //   setFilteredData(data.filter(item => item.group === null));
  //   // }
  //   else {
  //     setFilteredData(data.filter(item => item.department === filter));
  //   }
  // }, [filter, data]);

  const filterValue = [
    { name: "department", operator: "startsWith", type: "string", value: "" },
    { name: "supervisor", operator: "startsWith", type: "string", value: "" },
    {
      name: "semesterTitle",
      operator: "startsWith",
      type: "string",
      value: "",
    },
    {
      name: "bookletsStatus",
      operator: "eq",
      type: "select",
      value: "Approved",
    },
    // {
    //   name: "semesterTitle",
    //   operator: "eq",
    //   type: "select",
    //   // value: "All",
    // },
    // { name: 'age', operator: 'gte', type: 'number', value: 21 },
    // { name: 'city', operator: 'startsWith', type: 'string', value: '' },
    // {
    //   name: 'birthDate',
    //   operator: 'before',
    //   type: 'date',
    //   value: ''
    // },
    // { name: 'country', operator: 'eq', type: 'select', value: 'ca' }
  ];

  const semesterItems = [...new Set(data.map(item => item.semesterTitle))].map(
    item => ({ label: item, value: item })
  );

  useEffect(() => {
    const columns = [
      {
        name: "id",
        header: "Name",
        defaultFlex: 1,
      },

      // {
      //   name: "members",
      //   header: "Members",
      //   defaultFlex: 2,
      //   render: ({ value }) => {
      //     const comp = [];
      //     for (let i = 0; i < value.length; i++) {
      //       comp.push(<div>{value[i].rollNo}</div>);
      //     }
      //     return <div>{comp}</div>;
      //   },
      // },
      {
        name: "semesterTitle",
        header: "Semester",
        defaultFlex: 1,
        // filterEditor: SelectFilter,
        // filterEditorProps: {
        //   placeholder: "All",
        //   dataSource: semesterItems,
        // },
      },
      // {
      //   name: "department",
      //   header: "Department",
      //   defaultFlex: 1,

      // },
      {
        name: "department",
        header: "Department",
        defaultFlex: 1,
        filterEditor: SelectFilter,
        filterEditorProps: {
          placeholder: "All",
          dataSource: depts.map(item => ({ label: item, id: item })),
        },
      },
      {
        name: "project",
        header: "Project",
        defaultFlex: 2,
        render: ({ value }) => {
          return value ? value : "None";
        },
      },
      {
        name: "supervisor",
        defaultFlex: 1,
        header: "Supervisor",
      },
      {
        name: "bookletsStatus",
        header: "Booklets Status",
        filterEditor: SelectFilter,
        filterEditorProps: {
          placeholder: "All",
          dataSource: [
            { id: "Not Submitted", label: "Not Submitted" },
            { id: "Approved", label: "Approved" },
            { id: "Pending", label: "Pending" },
          ],
        },
        render: ({ value }) => {
          return value === "Approved" ? (
            <div style={{ color: "green" }}>{value}</div>
          ) : value === "Pending" ? (
            <div style={{ color: "orange" }}>{value}</div>
          ) : (
            <div style={{ color: "red" }}>{value}</div>
          );
        },
      },
      {
        name: "bookletsComment",
        header: "Booklets Comments",
        defaultFlex: 2,
      },
    ];
    setGridCols(columns);

    setGridData(data);
    console.log(gridData);
  }, [data, depts]);

  return (
    <ReactDataGrid
      idProperty="id"
      defaultFilterValue={filterValue}
      columns={gridCols}
      dataSource={gridData}
      rowHeight={100}
      style={{
        height: "calc(100vh - 230px)",
      }}
    />
  );

  // return (
  //   <>
  //     {/* <TableRow>
  //       <TableCell>
  //         <Typography variant="body1">Filter</Typography>
  //       </TableCell>
  //       <TableCell colSpan={2}>
  //         <Select
  //           required
  //           style={{ ...styles.input, margin: 0 }}
  //           label="Filter"
  //           value={filter}
  //           setValue={setFilter}
  //           items={filters.map(filter => ({
  //             id: filter,
  //             value: filter,
  //             text: filter,
  //           }))}
  //         />
  //       </TableCell>
  //     </TableRow> */}

  //     {data &&
  //       data.map((row, index) => (
  //         <TableRow key={row.id}>
  //           <TableCell>{row.id}</TableCell>
  //           {/* <TableCell>{row.members}</TableCell> */}
  //           {/* <TableCell>
  //         <List>
  //           {row.members.map(member => (
  //             <ListItem
  //               style={{ padding: 0 }}
  //               key={member.rollNo + member.name}
  //               >
  //               <Link to="#" style={{ textDecoration: "none" }}>
  //               {member.rollNo}
  //               </Link>
  //               </ListItem>
  //               ))}
  //         </List>
  //       </TableCell> */}
  //           <TableCell>{row.project ? row.project : "None"}</TableCell>
  //           <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
  //           <TableCell>
  //             <p
  //               style={{
  //                 color:
  //                   row.bookletsStatus === "Approved"
  //                     ? "green"
  //                     : row.bookletsStatus === "Pending"
  //                     ? "orange"
  //                     : "red",
  //               }}
  //             >
  //               {row.bookletsStatus}
  //             </p>
  //           </TableCell>
  //           <TableCell>
  //             <Typography variant="body1">
  //               {row.bookletsComment ? row.bookletsComment : "None"}
  //             </Typography>
  //           </TableCell>
  //           {/* <TableCell align="right">
  //         <IconButton
  //           onClick={() => {
  //             editGroup(row);
  //           }}
  //           color="primary"
  //           variant="outlined"
  //         >
  //           <EditIcon />
  //         </IconButton>

  //         <IconButton
  //           onClick={() => {
  //             deleteGroup(row.id);
  //           }}
  //           color="error"
  //           variant="outlined"
  //         >
  //           <DeleteIcon />
  //         </IconButton>
  //       </TableCell>
  //       <TableCell align="right">
  //         <Button
  //           onClick={() => {
  //             history.push("/groups/" + row.id.split("_")[2]);
  //           }}
  //         >
  //           Show Details
  //         </Button>
  //       </TableCell> */}
  //         </TableRow>
  //       ))}
  //   </>
  // );
};

const AdminAllGroups = () => {
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    localStorage.getItem(USER_ROLE).includes("HOD");
  const [heads, setHeads] = useState([
    "Group ID",
    "Project Title",
    "Supervisor",
    "Booklet Status",
    "Booklet Comments",
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
          "http://localhost:5000/api/group/get-groups-admin"
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

  if (!isEligible) return <Redirect to="/404" />;

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
    <AdminMainLayout>
      <ContainerFluid maxWidth="lg">
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
          <DataBody
            data={body}
            // data={DATA.data}
            depts={depts.map(dept => dept.name)}
            setData={setBody}
            editGroup={editGroupHandler}
          />
          {/* <DataTable
            DataHead={null}
            DataBody={() => (
              <DataBody
                data={body}
                // data={DATA.data}
                depts={depts.map(dept => dept.name)}
                setData={setBody}
                editGroup={editGroupHandler}
              />
            )}
          /> */}
        </Main>
      </ContainerFluid>
    </AdminMainLayout>
  );
};

export default AdminAllGroups;
