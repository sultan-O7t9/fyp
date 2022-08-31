import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import ImportFromExcel from "../components/ImportFromExcel";
import Link from "../components/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import Main from "../components/Main";
import axios from "axios";
import Select from "../components/Select";
import styles from "./auth.styles";
import { ConstructionOutlined } from "@mui/icons-material";
import Toast from "../components/Toast";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { useHistory } from "react-router-dom";
import AddStudent from "../components/AddStudent";
import EditStudent from "../components/EditStudent";

import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";

const DATA = {
  heads: ["Group ID", "Members", "Project Title", "Supervisor"],
  data: [
    {
      id: "SE_18_1",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
    {
      id: "SE_18_2",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
    {
      id: "SE_18_3",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
  ],
};

const DataHead = ({ heads }) => {
  return (
    heads &&
    heads.map((head, index) => <TableCell key={index}>{head}</TableCell>)
  );
};

const DataBody = ({ data, setRefresh, setShowEditStudent, setToEdit }) => {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [gridData, setGridData] = useState(data);
  const [gridCols, setGridCols] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const history = useHistory();
  const [depts, setDepts] = useState([]);

  const filterValue = [
    { name: "dept", operator: "startsWith", type: "string", value: "" },
    // { name: "supervisor", operator: "startsWith", type: "string", value: "" },
    // {
    //   name: "bookletsStatus",
    //   operator: "eq",
    //   type: "select",
    //   value: "Approved",
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
  useEffect(() => {
    const getDepts = async () => {
      const res = await axios.get("http://localhost:5000/api/dept/get-all");
      console.log(res.data);
      setDepts(
        res.data.departments.map(dept => ({
          label: dept.name,
          id: dept.name,
        }))
      );
    };
    getDepts();
  }, [data, history]);

  useEffect(() => {
    const dataSource = data.map(item => {
      return {
        ...item,
        actions: (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                // editGroup(item);
                // editStudent
                setToEdit(item);
                setShowEditStudent(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              onClick={() => {
                setShowDeleteModal(true);
                setToDelete(item);
              }}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </div>
        ),
      };
    });
    const columns = [
      {
        name: "name",
        header: "Name",
        defaultFlex: 2,
      },

      {
        name: "rollNo",
        header: "Roll #",
        defaultFlex: 2,
      },
      // {
      //   name: "batch",
      //   header: "Batch",
      //   defaultFlex: 1,
      // },
      {
        name: "dept",
        header: "Department",
        defaultFlex: 2,
        filterEditor: SelectFilter,
        filterEditorProps: {
          placeholder: "All",
          dataSource: depts,
        },
      },
      {
        name: "group",
        header: "Group",
        defaultFlex: 1,
        render: ({ value }) => {
          return value ? value : "None";
        },
      },

      {
        name: "actions",
        defaultFlex: 2,
        header: "Actions",
      },
    ];
    setGridCols(columns);
    setGridData(dataSource);
  }, [data, history, depts]);

  const handleDeleteStudent = async id => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/student/delete/${id}`
      );
      if (res.data.delete) {
        setRefresh(refresh => !refresh);
      } else {
        alert("Something went wrong! Failed to delete the student");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
      {showDeleteModal ? (
        <DeleteConfirmationDialog
          itemType="Student"
          item={toDelete.rollNo}
          handleDelete={() => {
            // deleteGroup(toDelete.id);
            handleDeleteStudent(toDelete.rollNo);
          }}
          setOpen={setShowDeleteModal}
        />
      ) : null}
      {open ? (
        <Toast open={open} setOpen={setOpen} message={toastMessage} />
      ) : null}
    </>
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
  //       filteredData.map((row, index) => (
  //         <TableRow key={index}>
  //           <TableCell>{row.rollNo}</TableCell>
  //           <TableCell>{row.name}</TableCell>
  //           <TableCell>{row.group || "None"}</TableCell>
  //           <TableCell>
  //             <IconButton
  //               onClick={() => {
  //                 console.log("del student " + row.rollNo);
  //                 handleDeleteStudent(row.rollNo);
  //               }}
  //               color="error"
  //               variant="outlined"
  //             >
  //               <DeleteIcon />
  //             </IconButton>
  //           </TableCell>
  //         </TableRow>
  //       ))}
  //   </>
  // );
};

const AllStudents = () => {
  const [heads, setHeads] = useState(["Name", "Roll No", "Group"]);
  const [body, setBody] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/student/get-all")
      .then(res => {
        console.log(res.data);
        setBody(res.data.students);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refresh, showAddStudent, showEditStudent]);

  const importDataHandler = async importedData => {
    // console.log(importedData);
    setIsLoading(true);

    //ok
    //now find roll no and name is on which index
    const indexOfRoll = importedData.heads.findIndex(item =>
      item.includes("oll")
    );
    const indexOfName = importedData.heads.findIndex(item =>
      item.includes("ame")
    );
    const indexOfDepartment = importedData.heads.findIndex(item =>
      item.includes("epart")
    );
    // console.log(indexOfRoll, indexOfName);
    // //this will show us which column contains roll no and name
    // console.log(indexOfRoll, indexOfName);
    const dataHeads = [
      importedData.heads[indexOfRoll],
      importedData.heads[indexOfName],
      importedData.heads[indexOfDepartment],
      "Group",
    ];
    const students = importedData.data
      .map(item => {
        if (item[indexOfRoll] && item[indexOfName] && item[indexOfDepartment])
          return {
            rollNo: item[indexOfRoll],
            name: item[indexOfName],
            department: item[indexOfDepartment],
          };
        else return null;
      })
      .filter(item => item != null);
    const alreadyCreatedStudents = body.map(item => item.rollNo);
    const studentsToCreate = students.filter(
      item => !alreadyCreatedStudents.includes(item.rollNo)
    );
    console.log(studentsToCreate);
    // return;
    // return;
    //Now send request to server and create studetns there, render the response array in table
    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/create-all",
        { students: studentsToCreate }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setHeads(dataHeads);
        // setBody(response.data.students);
        setRefresh(refresh => !refresh);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStudent = () => {
    console.log("add student");
    setShowAddStudent(true);
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
    <>
      {showAddStudent ? (
        <AddStudent
          setDisplay={setShowAddStudent}
          students={body ? body.map(b => b.rollNo) : []}
        />
      ) : null}
      {showEditStudent ? (
        <EditStudent student={toEdit} setDisplay={setShowEditStudent} />
      ) : null}
      <ContainerFluid>
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">Students</Typography>
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <ImportFromExcel
                label="Import Students"
                importData={importDataHandler}
                // disabled={body.length > 0}
              />
              <Button
                style={{ marginTop: "1rem" }}
                variant="contained"
                onClick={handleAddStudent}
              >
                Add Student
              </Button>
            </Box>
          </Box>
          {/* <DataTable
          DataHead={() => <DataHead heads={heads} />}
          DataBody={() => <DataBody data={body} setRefresh={setRefresh} />}
        /> */}
          <DataBody
            data={body}
            setToEdit={setToEdit}
            setShowEditStudent={setShowEditStudent}
            setRefresh={setRefresh}
          />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default AllStudents;
