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
import ManageFaculty from "./ManageFaculty";
import AdminMainLayout from "../layouts/AdminMainLayout";
import { Redirect, useHistory } from "react-router-dom";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import { USER_ROLE } from "../utils/keys";

const DATA = {
  heads: ["Name", "Department", "Role"],
  data: [
    {
      name: "Ali",
      members: "SE",
      groups: ["Supervisor", "Evaluator", "PMO"],
    },
    {
      name: "Ali",
      members: "SE",
      groups: ["Supervisor", "Evaluator", "PMO"],
    },
    {
      name: "Ali",
      members: "SE",
      groups: ["Supervisor", "Evaluator", "PMO"],
    },
  ],
};

const DataHead = ({ heads }) => {
  return (
    heads &&
    heads.map((head, index) => <TableCell key={index}>{head}</TableCell>)
  );
};

const DataBody = ({ data, editCommittee, setData }) => {
  const [gridCols, setGridCols] = useState([]);
  const [gridData, setGridData] = useState(data);
  const [toDelete, setToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const columns = [
      {
        name: "name",
        header: "Name",
        defaultFlex: 1,
      },
      {
        name: "email",
        header: "Email",
        defaultFlex: 2,
      },
      {
        name: "department",
        header: "Department",
        defaultFlex: 1,
      },
      {
        name: "actions",
        defaultFlex: 2,
        header: "Actions",
      },
    ];

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
              variant="contained"
              size="small"
              onClick={() => {
                editCommittee(item);
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
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </div>
        ),
      };
    });

    setGridCols(columns);
    setGridData(dataSource);
  }, [data, editCommittee]);

  const deleteCommittee = async id => {
    console.log("ID", id);
    const response = await axios.delete(` /api/faculty/delete/${id}`);
    if (response.data.delete) {
      setShowDeleteModal(false);
      setData(data => data.filter(committee => committee.id !== id));
    }
  };

  return (
    <>
      <ReactDataGrid
        idProperty="id"
        columns={gridCols}
        dataSource={gridData}
        rowHeight={100}
        style={{
          height: "calc(100vh - 230px)",
        }}
      />
      {showDeleteModal ? (
        <DeleteConfirmationDialog
          itemType="Faculty Member"
          item={toDelete.name}
          handleDelete={() => {
            deleteCommittee(toDelete.id);
          }}
          setOpen={setShowDeleteModal}
        />
      ) : null}
    </>
  );

  // return (
  //   data &&
  //   data.map((row, index) => (
  //     <TableRow key={row.id}>
  //       <TableCell>{row.name}</TableCell>
  //       <TableCell>{row.department}</TableCell>
  //       <TableCell>{row.email}</TableCell>
  //       {/* <TableCell>{row.members}</TableCell> */}
  //       {/* <TableCell>
  //         {row.role && row.FacultyMembers.length > 0 ? (
  //           <List>
  //             {row.FacultyMembers.map(member => (
  //               <ListItem style={{ padding: 0 }} key={member.id}>
  //                 <Link to="#" style={{ textDecoration: "none" }}>
  //                   {member.name}
  //                 </Link>
  //               </ListItem>
  //             ))}
  //           </List>
  //         ) : (
  //           <Typography variant="body2">None</Typography>
  //         )}
  //       </TableCell> */}
  //       {/* <TableCell>
  //         {row.Groups && row.Groups.length > 0 ? (
  //           <List>
  //             {row.Groups.map(group => (
  //               <ListItem style={{ padding: 0 }} key={group.id}>
  //                 <Link to="#" style={{ textDecoration: "none" }}>
  //                   {group.name}
  //                 </Link>
  //               </ListItem>
  //             ))}
  //           </List>
  //         ) : (
  //           <Typography variant="body2">None</Typography>
  //         )}
  //       </TableCell> */}
  //       <TableCell align="right">
  //         <IconButton
  //           onClick={() => {
  //             editCommittee(row);
  //           }}
  //           color="primary"
  //           variant="outlined"
  //         >
  //           <EditIcon />
  //         </IconButton>

  //         <IconButton
  //           onClick={() => {
  //             deleteCommittee(row.id);
  //           }}
  //           color="error"
  //           variant="outlined"
  //         >
  //           <DeleteIcon />
  //         </IconButton>
  //       </TableCell>
  //       {/* <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell> */}
  //     </TableRow>
  //   ))
  // );
};

const AdminManageFaculty = () => {
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    localStorage.getItem(USER_ROLE).includes("HOD");
  const [heads, setHeads] = useState(["Name", "Department", "Email"]);
  const [showAddCommittee, setShowAddCommittee] = useState(false);
  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("/api/faculty/get-supervisors")
      .then(res => {
        console.log(res.data);
        setBody(res.data.supervisors);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showAddCommittee]);

  // return <ManageCommittee />;

  const addCommitteeHandler = committee => {
    console.log(committee);
    setShowAddCommittee(committee ? committee : true);
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
      <ContainerFluid>
        {showAddCommittee ? (
          <ManageFaculty
            faculty={showAddCommittee}
            setDisplay={setShowAddCommittee}
          />
        ) : null}
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">Faculty Members</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addCommitteeHandler(null);
                }}
              >
                Add Faculty
              </Button>
            </Box>
          </Box>
          {/* <DataTable
            DataHead={() => <DataHead heads={heads} />}
            DataBody={() => (
              
            )}
          /> */}
          <DataBody
            editCommittee={addCommitteeHandler}
            data={body}
            setData={setBody}
          />
        </Main>
      </ContainerFluid>
    </AdminMainLayout>
  );
};

export default AdminManageFaculty;
