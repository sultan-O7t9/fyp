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

const DataBody = ({ data, setRefresh }) => {
  const [filter, setFilter] = useState("All");
  const [filteredData, setFilteredData] = useState([...data]);
  const filters = ["In Groups", "All", "Not In Groups"];

  useEffect(() => {
    if (filter === "All") setFilteredData(data);
    else if (filter === "In Groups") {
      setFilteredData(data.filter(item => item.group !== null));
    } else if (filter === "Not In Groups") {
      setFilteredData(data.filter(item => item.group === null));
    }
  }, [filter, data]);

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
      {/* <TableRow>
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
      </TableRow> */}
      {data &&
        filteredData.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.rollNo}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.group || "None"}</TableCell>
            <TableCell>
              <IconButton
                onClick={() => {
                  console.log("del student " + row.rollNo);
                  handleDeleteStudent(row.rollNo);
                }}
                color="error"
                variant="outlined"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

const AllStudents = () => {
  const [heads, setHeads] = useState(["Name", "Roll No", "Group"]);
  const [body, setBody] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [refresh]);

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
    // console.log(indexOfRoll, indexOfName);
    // //this will show us which column contains roll no and name
    // console.log(indexOfRoll, indexOfName);
    const dataHeads = [
      importedData.heads[indexOfRoll],
      importedData.heads[indexOfName],
      "Group",
    ];
    const students = importedData.data
      .map(item => {
        if (item[indexOfRoll] && item[indexOfName])
          return {
            rollNo: item[indexOfRoll],
            name: item[indexOfName],
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
            <Typography variant="h3">Students</Typography>
          </Box>
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <ImportFromExcel
              label="Import Students"
              importData={importDataHandler}
              // disabled={body.length > 0}
            />
            {/* <Button style={{ marginTop: "1rem" }} variant="contained">
              Add Student
            </Button> */}
          </Box>
        </Box>
        <DataTable
          DataHead={() => <DataHead heads={heads} />}
          DataBody={() => <DataBody data={body} setRefresh={setRefresh} />}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AllStudents;
