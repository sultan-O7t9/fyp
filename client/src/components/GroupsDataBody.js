import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Switch,
  TableCell,
  TableRow,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import Link from "./Link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Toast from "./Toast";
import RadioButtonGroup from "./RadioButtonGroup";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

// const DataItem = props => {
//   const {
//     row,
//     roles,
//     editGroup,
//     deleteGroup,
//     toastMessage,
//     setToastMessage,
//     open,
//     setOpen,
//   } = props;
//   const history = useHistory();
//   const [bookletStatus, setBookletStatus] = useState(false);
//   const [bookletComment, setBookletComment] = useState("");
//   useEffect(() => {
//     console.log(row);
//     setBookletStatus(row.bookletsStatus);
//     setBookletComment(row.bookletsComment);
//     console.log(bookletStatus);
//   }, [row]);

//   const changeBookletStatus = async (id, status) => {
//     const data = {
//       groupId: id.split("_").pop(),
//       status: status,
//     };
//     console.log(data);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/group/change-booklet-status",
//         data
//       );
//       setBookletStatus(response.data.group.bookletsStatus === "Approved");
//       setToastMessage(
//         "Booklet Status changed to " + response.data.group.bookletsStatus
//       );
//       setOpen(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const changeBookletComment = async id => {
//     const data = {
//       groupId: id.split("_").pop(),
//       comment: bookletComment,
//     };

//     console.log(data);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/group/change-booklet-comment",
//         data
//       );
//       if (res.data.comment === true) {
//         setToastMessage("Comment Added Successfully");
//         setOpen(true);
//       }
//     } catch (error) {
//       console.log(error);
//       setToastMessage(error.message);
//       setOpen(true);
//     }

//     // try {
//     //   const response = await axios.post(
//     //     "http://localhost:5000/api/group/change-booklet-status",
//     //     data
//     //   );
//     //   setBookletStatus(response.data.group.bookletsStatus === "Approved");
//     // } catch (error) {
//     //   console.log(error);
//     // }
//   };

//   return (
//     <TableRow key={row.id}>
//       <TableCell>{row.id}</TableCell>
//       {/* <TableCell>{row.members}</TableCell> */}
//       <TableCell colSpan={2}>
//         <List>
//           {row.members.map(member => {
//             return (
//               <ListItem
//                 style={{ padding: 0 }}
//                 key={member.rollNo + member.name}
//               >
//                 {member.rollNo}
//               </ListItem>
//             );
//           })}
//         </List>
//       </TableCell>
//       <TableCell>{row.project ? row.project : "None"}</TableCell>
//       {roles.includes("PMO") ? (
//         <>
//           <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell>
//           <TableCell>
//             <RadioButtonGroup
//               label="Project Type"
//               defaultValue={row.bookletsStatus}
//               onChange={e => {
//                 setBookletStatus(e.target.value);
//                 changeBookletStatus(row.id, e.target.value);

//                 console.log(e.target.value);
//               }}
//               items={[
//                 { label: "Approved", value: "Approved" },
//                 { label: "Pending", value: "Pending" },
//                 { label: "Not Submitted", value: "Not Submitted" },
//               ]}
//             />
//           </TableCell>
//           <TableCell>
//             <TextareaAutosize
//               minRows={3}
//               value={bookletComment}
//               onChange={e => {
//                 setBookletComment(e.target.value);
//               }}
//             />
//             <Button
//               variant="contained"
//               size="small"
//               // disabled={!bookletComment}
//               onClick={() => {
//                 changeBookletComment(row.id);
//               }}
//             >
//               Add Comment
//             </Button>
//           </TableCell>
//           <TableCell align="right">
//             <IconButton
//               onClick={() => {
//                 editGroup(row);
//               }}
//               color="primary"
//               variant="outlined"
//             >
//               <EditIcon />
//             </IconButton>

//             <IconButton
//               onClick={() => {
//                 deleteGroup(row.id);
//               }}
//               color="error"
//               variant="outlined"
//             >
//               <DeleteIcon />
//             </IconButton>
//           </TableCell>
//         </>
//       ) : (
//         <>
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
//           <TableCell>{row.bookletsComment}</TableCell>
//         </>
//       )}
//       <TableCell align="right">
//         <Button
//           onClick={() => {
//             history.push("/groups/" + row.id.split("_")[2]);
//           }}
//         >
//           Show Details
//         </Button>
//       </TableCell>
//     </TableRow>
//   );
// };

const GroupsDataBody = ({
  data,
  setData,
  editGroup,
  selected,
  setSelected,
}) => {
  const roles = localStorage.getItem("USER_ROLE");
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [gridData, setGridData] = useState(data);
  const [gridCols, setGridCols] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const history = useHistory();

  const toArray = selected => {
    return Object.keys(selected).map(id => id.split("_").pop());
  };

  const [selectedGroups, setSelectedGroups] = useState([]);

  const onSelectionChange = useCallback(({ selected }) => {
    setSelectedGroups(selected);
  }, []);

  useEffect(() => {
    console.log(selectedGroups);
    setSelected(toArray(selectedGroups));
  }, [selectedGroups, setSelected]);

  const deleteGroup = async id => {
    const response = await axios.delete(
      `http://localhost:5000/api/group/delete/${id}`
    );
    if (response.data.delete) {
      setData(data => data.filter(group => group.id !== id));
      setShowDeleteModal(false);
      setToastMessage("Group Deleted Successfully");
      setOpen(true);
    }
  };

  console.log(data);
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
              alignItems: "center",
            }}
          >
            {localStorage.getItem("USER_ROLE").includes("PMO") ? (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Button
                  style={{ marginBottom: "0.5rem" }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    editGroup(item);
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
              </Box>
            ) : null}
            <Button
              size="small"
              onClick={() => {
                history.push("/groups/" + item.id.split("_")[2]);
              }}
              variant="outlined"
            >
              Show Details
            </Button>
          </div>
        ),
      };
    });
    const columns = [
      {
        name: "id",
        header: "Name",
        defaultFlex: 1,
      },

      {
        name: "members",
        header: "Members",
        defaultFlex: 2,
        render: ({ value }) => {
          const comp = [];
          for (let i = 0; i < value.length; i++) {
            comp.push(<div>{value[i].rollNo}</div>);
          }
          return <div>{comp}</div>;
        },
      },
      {
        name: "department",
        header: "Dept",
        defaultFlex: 1,
      },
      // {
      //   name: "semesterTitle",
      //   header: "Semester",
      //   defaultFlex: 1,
      // },
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
        render: ({ value }) => {
          return value ? value : "None";
        },
      },
      {
        name: "bookletsStatus",
        header: "Booklets Status",
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
        name: "actions",
        defaultFlex: 3,
        header: "Actions",
      },
    ];
    setGridCols(columns);
    setGridData(dataSource);
  }, [data, editGroup, history]);

  return (
    <>
      {/* {data &&
        data.map((row, index) => {
          //find GroupDetail
          // const groupId = row.id;
          // const status = bookletStatus.find(booklet => booklet.id === groupId);
          // console.log(status);
          return (
            // <DataItem
            //   row={row}
            //   key={index}
            //   index={index}
            //   toastMessage={toastMessage}
            //   setToastMessage={setToastMessage}
            //   open={open}
            //   setOpen={setOpen}
            //   editGroup={editGroup}
            //   deleteGroup={deleteGroup}
            //   isPMO={isPMO}
            //   roles={roles}
            // />
           null
          );
        })} */}
      <ReactDataGrid
        idProperty="id"
        columns={gridCols}
        selected={selectedGroups}
        checkboxColumn
        onSelectionChange={onSelectionChange}
        dataSource={gridData}
        rowHeight={100}
        style={{
          height: "calc(100vh - 230px)",
        }}
      />
      {/* <p>Selected rows: {JSON.stringify(toArray(selectedGroups))}.</p> */}
      {showDeleteModal ? (
        <DeleteConfirmationDialog
          itemType="Group"
          item={toDelete.id}
          handleDelete={() => {
            deleteGroup(toDelete.id);
          }}
          setOpen={setShowDeleteModal}
        />
      ) : null}
      {open ? (
        <Toast open={open} setOpen={setOpen} message={toastMessage} />
      ) : null}
    </>
  );
};

export default GroupsDataBody;
