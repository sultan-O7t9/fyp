import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
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
import Link from "../components/Link";
import Main from "../components/Main";
import ManageCommittee from "./ManageCommittee";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ManageDept from "./ManageDept";
import EditDeptPMO from "../components/EditDeptPMO";
const DATA = {
  heads: ["Name", "Department", "Role"],
  data: [
    {
      name: "Software Engineering",
      pmo: "Ali",
    },
    {
      name: "Computer Science",
      pmo: "Ahmad",
    },
    {
      name: "Information Technology",
      pmo: "Arslan",
    },
  ],
};

const DataHead = ({ heads }) => {
  return (
    heads &&
    heads.map((head, index) => <TableCell key={index}>{head}</TableCell>)
  );
};

const DataBody = ({ data, editFaculty, setData }) => {
  // const deleteCommittee = async id => {
  //   console.log("ID", id);
  //   const response = await axios.delete(
  //     `http://localhost:5000/api/faculty/delete/${id}`
  //   );
  //   if (response.data.delete) {
  //     setData(data => data.filter(committee => committee.id !== id));
  //   }
  // };

  return (
    data &&
    data.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.pmo}</TableCell>
        {/* <TableCell>{row.email}</TableCell> */}
        {/* <TableCell>{row.members}</TableCell> */}
        {/* <TableCell>
            {row.role && row.FacultyMembers.length > 0 ? (
              <List>
                {row.FacultyMembers.map(member => (
                  <ListItem style={{ padding: 0 }} key={member.id}>
                    <Link to="#" style={{ textDecoration: "none" }}>
                      {member.name}
                    </Link>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">None</Typography>
            )}
          </TableCell> */}
        {/* <TableCell>
            {row.Groups && row.Groups.length > 0 ? (
              <List>
                {row.Groups.map(group => (
                  <ListItem style={{ padding: 0 }} key={group.id}>
                    <Link to="#" style={{ textDecoration: "none" }}>
                      {group.name}
                    </Link>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">None</Typography>
            )}
          </TableCell> */}
        <TableCell align="right">
          <IconButton
            onClick={() => {
              // editCommittee(row);
              editFaculty(true, {
                dept: { id: row.id, name: row.name },
                pmo: { id: row.pmoId, name: row.pmo },
              });
            }}
            color="primary"
            variant="outlined"
          >
            <EditIcon />
          </IconButton>

          {/* <IconButton
            onClick={() => {
              deleteCommittee(row.id);
            }}
            color="error"
            variant="outlined"
          >
            <DeleteIcon />
          </IconButton> */}
        </TableCell>
        {/* <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell> */}
      </TableRow>
    ))
  );
};

const AdminManageDept = () => {
  const [heads, setHeads] = useState(["Department", "PMO"]);
  const [showAddCommittee, setShowAddCommittee] = useState(false);
  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditFaculty, setShowEditFaculty] = useState(false);
  const [editData, setEditData] = useState({});
  useEffect(() => {
    setIsLoading(true);

    const getData = async () => {
      setIsLoading(false);
      try {
        const resDept = await axios.get(
          "http://localhost:5000/api/dept/get-all"
        );
        console.log(resDept.data);
        setBody(resDept.data.departments);
        // setDepts(resDept.data.departments);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();

    // axios
    //   .get("http://localhost:5000/api/faculty/get-supervisors")
    //   .then(res => {
    //     console.log(res.data);
    //     setBody(res.data.supervisors);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, [showAddCommittee, showEditFaculty]);

  // return <ManageCommittee />;

  const addCommitteeHandler = committee => {
    console.log(committee);
    setShowAddCommittee(committee ? committee : true);
  };
  // const editFacultyHandler = committee => {
  //   console.log(committee);
  //   setShowAddCommittee(committee ? committee : true);
  // };

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  const editFacultyHandler = (show, faculty) => {
    // setEditDeptPMO(show,faculty);
    setShowEditFaculty(show);
    setEditData(faculty);
  };

  return (
    <ContainerFluid>
      {showAddCommittee ? (
        <ManageDept
          committee={showAddCommittee}
          setDisplay={setShowAddCommittee}
        />
      ) : null}
      {showEditFaculty ? (
        <EditDeptPMO setDisplay={setShowEditFaculty} data={editData} />
      ) : null}
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">Departments</Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={addCommitteeHandler}
            >
              Add Department
            </Button>
          </Box>
        </Box>
        <DataTable
          DataHead={() => <DataHead heads={heads} />}
          DataBody={() => (
            <DataBody
              editCommittee={addCommitteeHandler}
              data={body}
              editFaculty={editFacultyHandler}
              // data={DATA.data}
              setData={setBody}
            />
          )}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AdminManageDept;
