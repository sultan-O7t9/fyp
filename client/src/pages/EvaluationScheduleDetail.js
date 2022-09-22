import { useState } from "react";
import {
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import * as ReactDOMServer from "react-dom/server";

import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import Select from "../components/Select";
import UploadFile from "../components/UploadFile";
import axios from "axios";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import DeliverableSettingsModal from "../components/DeliverableSettingsModal";

import Toast from "../components/Toast";
import AddSchedule from "../components/AddSchedule";
import EditSchedule from "../components/EditSchedule";

import ReactDataGrid from "@inovua/reactdatagrid-community";

import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import "@inovua/reactdatagrid-community/index.css";
import { useCallback } from "react";
import ExtensionModal from "../components/ExtensionModal";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import ScheduleReport, { ScheduleReportComponent } from "./ScheduleReport";

const DATA = {
  // heads: ["Group ID", "Project Title", "Submitted On", "Submission"],
  heads: [
    "Group ID",
    "Project Title",
    "Supervisor",
    // "Student Name",
    // "Student Roll no.",
    "Committee",
    "Evaluation Date",
    "",
  ],
  data: [
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
    {
      id: "SE_18_1",
      project: "Project1",
      supervisor: "Sup1",
      members: [
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
        { rollNo: "18094198-079", name: "Sultan" },
      ],
      committee: "C_18_2",
      date: new Date().toDateString(),
    },
  ],
};

const DataHead = () => {
  return DATA.heads.map(head => <TableCell key={head}>{head}</TableCell>);
};

// const DataBody = () => {
//   const roles = localStorage.getItem("USER_ROLE");
//   const [submissionsData, setSubmissionsData] = useState([]);
//   const [gridData, setGridData] = useState([]);
//   const [gridCols, setGridCols] = useState([]);
//   const history = useHistory();
//   const params = useParams();

//   const toArray = selected => {
//     return Object.keys(selected).map(id => id);
//   };

//   const [selectedGroups, setSelectedGroups] = useState([]);
//   const onSelectionChange = useCallback(({ selected }) => {
//     console.log("selected", selected);
//     setSelectedGroups(selected);
//   }, []);

//   const deliverableId = params.id;

//   const filterValue = [
//     {
//       name: "status",
//       operator: "inlist",
//       type: "select",
//       emptyValue: "",
//     },
//   ];
//   // const [filter, setFilter] = useState(null);
//   // const filters = [
//   //   { text: "Submitted", id: 1 },
//   //   { text: "Verified", id: 2 },
//   //   { text: "Rejected", id: 3 },
//   //   { text: "Revised", id: 4 },
//   // ];
//   const userId = localStorage.getItem("USER_ID");
//   //Get all submissions of the deliverabale

//   useEffect(() => {
//     console.log(userId);
//     console.log(deliverableId);
//     const getSubmissions = async () => {
//       try {
//         let newData = [];
//         if (roles.includes("PMO")) {
//           const res = await axios.post(
//             "http://localhost:5000/api/deliverable/get-grp-submission-sem",
//             {
//               deliverableId,
//             }
//           );
//           console.log(res.data);
//           newData = res.data.submissions;

//           // if (!roles.includes("PMO")) {
//           //   newData = res.data.submissions.filter(submission => {
//           //     return submission.supervisorId == userId;
//           //   });
//           // }
//         }
//         if (roles.includes("SUPERVISOR")) {
//           const res = await axios.post(
//             "http://localhost:5000/api/deliverable/get-grp-submission-sem",
//             {
//               deliverableId,
//             }
//           );
//           console.log(res.data);
//           newData = res.data.submissions;
//         }
//         // if (
//         //   newData.hasOwnProperty("submission") &&
//         //   !newData.submission.hasOwnProperty("name")
//         // )
//         //   return;
//         setSubmissionsData(
//           newData.filter(data => {
//             return data.submission.name;
//           })
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getSubmissions();
//   }, [userId, deliverableId, roles]);

//   const downloadSubmission = async (e, file) => {
//     e.preventDefault();
//     try {
//       let url = "http://localhost:5000/" + file;
//       console.log(url);
//       let win = window.open(url, "_blank");
//       win.focus();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     console.log(submissionsData);
//     const dataSource = submissionsData.map(item => {
//       console.log(item);
//       return {
//         ...item,
//         status: item.submission.status,
//         file: item.submission.name,
//         // actions: (
//         //   <div
//         //     style={{
//         //       width: "100%",
//         //       height: "100%",
//         //       display: "flex",
//         //       justifyContent: "center",
//         //     }}
//         //   >
//         //     <Button
//         //       size="small"
//         //       onClick={() => {
//         //         history.push("/sup/deliverable/detail/" + item.id, {
//         //           deliverableId,
//         //           groupId: item.id,
//         //         });
//         //         console.log(item);
//         //       }}
//         //       variant="outlined"
//         //     >
//         //       Show Details
//         //     </Button>
//         //   </div>
//         // ),
//       };
//     });
//     const columns = [
//       {
//         name: "name",
//         header: "Name",
//         defaultFlex: 1,
//       },
//       {
//         name: "project",
//         header: "Project Title",
//         defaultFlex: 2,
//         render: ({ value }) => {
//           return value.title;
//         },
//       },

//       {
//         name: "submission",
//         header: "Submited On",
//         defaultFlex: 2,
//         render: ({ value }) => {
//           return new Date(value.createdAt).toDateString();
//         },
//       },
//       {
//         name: "file",
//         header: "File",
//         defaultFlex: 2,
//         render: ({ value }) => {
//           // return value.name;
//           return value ? (
//             <Button
//               onClick={() => {
//                 let url = "http://localhost:5000/" + value;
//                 let win = window.open(url, "_blank");
//                 win.focus();
//               }}
//             >
//               {value}
//             </Button>
//           ) : (
//             "None"
//           );
//         },
//       },
//       {
//         name: "status",
//         header: "Status",
//         defaultFlex: 2,
//         render: ({ value }) => {
//           const color =
//             value == "Pending"
//               ? "orange"
//               : value == "Approved"
//               ? "green"
//               : "red";
//           return (
//             <div
//               style={{
//                 color: color,
//                 fontWeight: "bold",
//                 textTransform: "uppercase",
//               }}
//             >
//               {value}
//             </div>
//           );
//         },
//         filterEditor: SelectFilter,
//         filterEditorProps: {
//           placeholder: "All",
//           dataSource: [
//             { id: "Revised", label: "Revised" },
//             { id: "Approved", label: "Approved" },
//             { id: "Pending", label: "Pending" },
//           ],
//         },
//       },

//       // {
//       //   name: "project",
//       //   header: "Project",
//       //   defaultFlex: 2,
//       //   render: ({ value }) => {
//       //     return value ? value : "None";
//       //   },
//       // },

//       // {
//       //   name: "actions",
//       //   defaultFlex: 2,
//       //   header: "Actions",
//       // },
//     ];
//     setGridCols(columns);
//     setGridData(dataSource);
//   }, [submissionsData, history]);

//   const sendMailToStudents = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/deliverable/send-mail",
//         { deliverableId, userId, groups: toArray(selectedGroups) }
//       );
//       console.log(res.data.get);
//       if (res.data.get) {
//         alert("Mail sent successfully");
//       } else {
//         alert("Mail not sent");
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Error sending mail");
//     }
//   };

//   return (
//     <>
//       <Card
//         variant="outlined"
//         style={{
//           marginBottom: "2rem",
//           padding: "1rem 2rem",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <Typography variant="h6">Submission Details</Typography>
//           {toArray(selectedGroups).length ? (
//             <Button
//               variant="contained"
//               type="submit"
//               onClick={sendMailToStudents}
//             >
//               Send Mail
//             </Button>
//           ) : null}
//         </Box>
//       </Card>

//       <ReactDataGrid
//         idProperty="id"
//         columns={gridCols}
//         selected={selectedGroups}
//         checkboxColumn
//         onSelectionChange={onSelectionChange}
//         defaultFilterValue={filterValue}
//         dataSource={gridData}
//         rowHeight={100}
//         style={{
//           height: "calc(100vh - 230px)",
//         }}
//       />
//     </>
//   );

//   // return (
//   //   <>
//   //     {/* <TableRow>
//   //       <TableCell colSpan={3}>
//   //         <Box>
//   //            <Button
//   //             variant="contained"
//   //             type="submit"
//   //             onClick={sendMailToStudents}
//   //           >
//   //             Send Mail
//   //           </Button>
//   //         </Box>
//   //       </TableCell>
//   //     </TableRow> */}
//   //     {submissionsData.map((row, index) => (
//   //       <TableRow key={row.id}>
//   //         <TableCell>{row.name}</TableCell>
//   //         {/* <TableCell>{row.members}</TableCell> */}
//   //         <TableCell>
//   //           {row.project.hasOwnProperty("title") && row.project.title
//   //             ? row.project.title
//   //             : "None"}
//   //         </TableCell>
//   //         <TableCell>
//   //           {row.submission.createdAt
//   //             ? new Date(row.submission.createdAt).toLocaleString()
//   //             : "-"}
//   //         </TableCell>
//   //         <TableCell>
//   //           {row.hasOwnProperty("submission") && row.submission.name ? (
//   //             <form
//   //               onSubmit={e => {
//   //                 downloadSubmission(e, row.submission.name);
//   //               }}
//   //               className="form"
//   //             >
//   //               <Button variant="text" type="submit">
//   //                 {row.submission.name}
//   //               </Button>
//   //             </form>
//   //           ) : (
//   //             <Typography variant="body">None</Typography>
//   //           )}
//   //         </TableCell>
//   //       </TableRow>
//   //     ))}
//   //   </>
//   // );
// };

const DataBody2 = props => {
  const {
    showScheduleModal,
    showEditScheduleModal,
    setShowEditScheduleModal,
    toEdit,
    deliverableDeadline,
    setToEdit,
  } = props;
  const userId = localStorage.getItem("USER_ID");
  const [pageDims, setPageDims] = useState({});

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [gridData, setGridData] = useState([]);
  const [gridCols, setGridCols] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const history = useHistory();

  const params = useParams();
  const deliverableId = params.id;
  const [schedulesData, setSchedulesData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [exportSchedule, setExportSchedule] = useState(false);

  useEffect(() => {
    console.log(userId);
    console.log(deliverableId);
    const getSchedules = async () => {
      const data = {
        deliverableId,
        userId,
      };
      try {
        const res = await axios.post(
          "http://localhost:5000/api/evaluation/get-schedule-deliverable",
          data
        );
        console.log(res.data);
        let schedules = res.data.schedules;
        // schedules.sort((a, b) => {
        //   return new Date(a.date) - new Date(b.date);
        // });
        console.log(schedules);
        console.log(userId);
        // console.log(
        //   (schedules = schedules.filter(
        //     sched => !!sched.committee.evaluators.find(e => e.id == userId)
        //   ))
        // );
        if (localStorage.getItem("USER_ROLE").includes("EVALUATOR")) {
          console.log("evaluator");
          // schedules = schedules.filter(
          //   sched => !!sched.committee.evaluators.find(e => e.id != userId)
          // );
          const filteredSchedules = [];
          for (let i = 0; i < schedules.length; i++) {
            const evaluators = schedules[i].committee.evaluators;
            const evaluator = evaluators.find(e => e.id == userId);
            if (evaluator) {
              filteredSchedules.push(schedules[i]);
            }
          }
          console.log(filteredSchedules);
          schedules = filteredSchedules;
        }
        console.log(localStorage.getItem("USER_ROLE"));
        console.log(schedules);
        setSchedulesData(schedules);
      } catch (err) {
        console.log(err);
      }
    };
    getSchedules();
  }, [
    userId,
    deliverableId,
    refresh,
    showScheduleModal,
    showEditScheduleModal,
  ]);
  // Group ID
  // Project Title
  // Supervisor
  // Committee
  // Evaluation Date
  // Supervisor Review

  useEffect(() => {
    const dataSource = schedulesData.map(item => {
      return {
        ...item,
        revisionDate:
          item.submission && item.submission.eval_status == "Revised"
            ? item.submission.revision_date
            : null,

        committeeStatus:
          item.submission && item.submission.eval_status
            ? item.submission.eval_status
            : "Pending",
        supervisorStatus:
          item.submission && item.submission.status
            ? item.submission.status
            : "Pending",
        groupId: item.group.name,
        groupName: item.group.name,
        projectTitle: item.project.name,
        supervisorName: item.group.supervisor.name,
        committeeTitle: item.committee.name,
        date: new Date(item.date).toDateString(),
        actions: (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            {localStorage.getItem("USER_ROLE").includes("PMO") ? (
              <Box
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  style={{ marginBottom: "0.5rem" }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setShowEditScheduleModal(true);
                    setToEdit(item);
                  }}
                  disabled={
                    item.submission && item.submission.eval_status != "Pending"
                  }
                >
                  Edit
                </Button> */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setToDelete(item);
                    setShowDeleteModal(true);
                  }}
                  color="error"
                  disabled={
                    item.submission && item.submission.eval_status != "Pending"
                  }
                  style={{ marginBottom: "0.5rem" }}
                >
                  Delete
                </Button>
              </Box>
            ) : null}
            <Button
              size="small"
              disabled={
                !item.submission || item.submission.status != "Approved"
              }
              onClick={() => {
                console.log(item);

                if (deliverableId == 1)
                  history.push("/proposal/eval/", {
                    ...item,
                    deliverableDeadline: deliverableDeadline,
                  });
                else if (deliverableId == 2)
                  history.push("/d2/eval/", {
                    ...item,
                    deliverableDeadline: deliverableDeadline,
                  });
                else if (deliverableId == 3)
                  history.push("/d3/eval/", {
                    ...item,
                    deliverableDeadline: deliverableDeadline,
                  });
              }}
              variant="contained"
            >
              Evaluate
            </Button>
          </div>
        ),
      };
    });
    const columns = [
      // groupId: item.group.id,
      // groupName: item.group.name,
      // projectTitle: item.project.title,
      // supervisor: item.group.supervisor.name,
      // committeeTitle: item.committee.name,
      // actions: (
      {
        name: "groupId",
        header: "Group ID",
        defaultFlex: 1,
      },
      {
        name: "projectTitle",
        header: "Project Title",
        defaultFlex: 2,
      },
      {
        name: "supervisorName",
        header: "Supervisor",
        defaultFlex: 2,
      },
      {
        name: "committeeTitle",
        header: "Committee",
        defaultFlex: 1,
      },
      {
        name: "committeeStatus",
        header: "Evaluation Status",
        defaultFlex: 2,
        render: ({ value }) => {
          const color =
            value == "Pending"
              ? "orange"
              : value == "Approved"
              ? "green"
              : "red";

          return (
            <div
              style={{
                color: color,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: "revisionDate",
        header: "Evaluation Revision Date",
        defaultFlex: 2,
        render: ({ value }) => {
          return <div>{value ? new Date(value).toDateString() : null}</div>;
        },
      },
      {
        name: "supervisorStatus",
        header: "Supervisor Review",
        defaultFlex: 2,
        render: ({ value }) => {
          console.log(value);
          const color =
            value == "Pending"
              ? "orange"
              : value == "Approved"
              ? "green"
              : "red";

          return (
            <div
              style={{
                color: color,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: "date",
        header: "Evaluation Date",
        defaultFlex: 2,
        // render: ({ value }) => {
        //   console.log(value);
        //   return new Date(value).toLocaleString();
        // },
      },
      // {
      //   name: "Supervisor Review",
      //   header: "Committee",
      //   defaultFlex: 2,
      // },
      {
        name: "actions",
        defaultFlex: 2,
        header: "Actions",
      },
    ];

    setGridCols(columns);
    setGridData(dataSource);
  }, [history, schedulesData]);

  const handleDeleteSchedule = async id => {
    console.log("DEL", id);
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/evaluation/del-schedule/" + id
      );
      console.log(res.data);
      setShowDeleteModal(false);

      setRefresh(refresh => !refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNavToEvaluationPage = data => {
    console.log(data.group);
    if (deliverableId == 1) history.push("/proposal/eval/", data.group);
    else if (deliverableId == 2) history.push("/d2/eval/", data.group);
    else if (deliverableId == 3) history.push("/d3/eval/", data.group);
  };

  const shareSchedule = async tables => {
    const data = {
      tables: tables,
      deliverableId: deliverableId,
      deliverableData: schedulesData,
      dim: pageDims,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/share-sched",
        data
      );
      console.log(res.data);
      setToastMessage("Schedule shared successfully");
      setOpen(true);
    } catch (err) {
      setToastMessage("An error hass occured while sharing the schedule");
      setOpen(true);
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(pageDims);
  }, [pageDims]);

  return (
    <>
      {exportSchedule ? (
        <ScheduleReport
          setPageDims={setPageDims}
          data={schedulesData}
          setDisplay={setExportSchedule}
          deliverableId={deliverableId}
        />
      ) : null}
      {localStorage.getItem("USER_ROLE").includes("PMO") ? (
        <Card
          variant="outlined"
          style={{
            marginBottom: "2rem",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              disabled={!schedulesData.length}
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={() => {
                const a = ReactDOMServer.renderToStaticMarkup(
                  <ScheduleReportComponent
                    data={schedulesData}
                    setDisplay={setExportSchedule}
                    deliverableId={deliverableId}
                  />
                );
                console.log(a.replace("opacity:0", "opacity:1"));
                shareSchedule(a);
              }}
            >
              Share Schedule
            </Button>
            <Button
              disabled={!schedulesData.length}
              variant="contained"
              onClick={() => {
                setExportSchedule(true);
              }}
            >
              Export Schedule
            </Button>
          </Box>
        </Card>
      ) : null}
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
          itemType="Schedule"
          item={"Schedule"}
          handleDelete={() => {
            handleDeleteSchedule(toDelete.id);
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
  //     {schedulesData.length
  //       ? schedulesData.map(row => {
  //           const evaluators =
  //             row.committee && row.committee.evaluators
  //               ? row.committee.evaluators.map(evaluator => {
  //                   return evaluator.id;
  //                 })
  //               : [];
  //           const isEvaluator =
  //             evaluators.filter(user => user == userId).length == 1;
  //           const evalRole = localStorage
  //             .getItem("USER_ROLE")
  //             .includes("EVALUATOR");
  //           console.log("HELLO", userId, isEvaluator, evalRole);
  //           return (
  //             <>
  //               <TableRow key={row.id}>
  //                 <TableCell>
  //                   {row.group.id ? row.group.name : "None"}
  //                 </TableCell>
  //                 <TableCell>
  //                   {row.project.id ? row.project.name : "None"}
  //                 </TableCell>
  //                 <TableCell>
  //                   {row.group.supervisor.id
  //                     ? row.group.supervisor.name
  //                     : "None"}
  //                 </TableCell>
  //                 {/* <TableCell>
  //             <List>
  //               {row.members.map(member => (
  //                 <ListItem>{member.name}</ListItem>
  //               ))}
  //             </List>
  //           </TableCell>
  //           <TableCell>
  //             <List>
  //               {row.members.map(member => (
  //                 <ListItem style={{ fontSize: "12px" }}>
  //                   {member.rollNo}
  //                 </ListItem>
  //               ))}
  //             </List>
  //           </TableCell> */}
  //                 <TableCell>
  //                   {row.committee.id ? row.committee.name : "None"}
  //                 </TableCell>
  //                 <TableCell>
  //                   {row.date ? new Date(row.date).toDateString() : "None"}
  //                 </TableCell>
  //                 <TableCell align="right">
  //                   {/* <IconButton
  //                     onClick={() => {
  //                       handleEditSchedule(row.id);
  //                     }}
  //                     color="primary"
  //                     variant="outlined"
  //                   >
  //                     <EditIcon />
  //                   </IconButton> */}

  //                   {localStorage.getItem("USER_ROLE").includes("PMO") ? (
  //                     <IconButton
  //                       style={{ marginRight: "1rem" }}
  //                       onClick={() => {
  //                         handleDeleteSchedule(row.id);
  //                       }}
  //                       color="error"
  //                       variant="outlined"
  //                     >
  //                       <DeleteIcon />
  //                     </IconButton>
  //                   ) : null}
  //                   {localStorage.getItem("USER_ROLE").includes("EVALUATOR") &&
  //                   isEvaluator ? (
  //                     <Button
  //                       variant="contained"
  //                       size="small"
  //                       onClick={() => {
  //                         handleNavToEvaluationPage(row);
  //                       }}
  //                     >
  //                       Evaluate
  //                     </Button>
  //                   ) : null}
  //                 </TableCell>
  //               </TableRow>
  //             </>
  //           );
  //         })
  //       : null}
  //   </>
  // );
};

const EvaluationScheduleDetail = props => {
  const isEligible =
    localStorage.getItem("USER_ROLE") &&
    !localStorage.getItem("USER_ROLE").includes("SUPERVISOR");
  const roles = localStorage.getItem("USER_ROLE");
  const [file, setFile] = useState({});
  const [name, setName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deliverableData, setDeliverableData] = useState({
    title: "",
    template: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  // const history=useHistory();
  const params = useParams();
  const deliverableId = params.id;

  useEffect(() => {
    const getDeliverableData = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/deliverable/get/${deliverableId}`
      );
      console.log(response.data);
      setDeliverableData(response.data.deliverable);
    };
    getDeliverableData();
  }, [deliverableId, showUploadModal, showSettingsModal]);

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", deliverableId);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/template-file",
        data
      );
      console.log(res.data);
      if (res.data.upload) {
        setShowUploadModal(false);
        setToastMessage("Template uploaded successfully");
        setShowToast(true);
      }
      setName(res.data.file);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadTemplateFile = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/get-template-file",
        { deliverableId: deliverableId }
      );
      console.log(res.data);
      let url = "http://localhost:5000/" + res.data.file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const uploadTemplateFile = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  if (!isEligible) return <Redirect to="/404" />;

  return (
    <>
      {showEditScheduleModal ? (
        <EditSchedule
          deliverable={deliverableData}
          setDisplay={setShowEditScheduleModal}
          schedule={toEdit}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
        />
      ) : null}
      {showExtensionModal ? (
        <ExtensionModal
          deliverableId={deliverableId}
          setDisplay={setShowExtensionModal}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
        />
      ) : null}
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}

      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}
      {showSettingsModal ? (
        <DeliverableSettingsModal
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          deliverable={deliverableData}
          setDisplay={setShowSettingsModal}
        />
      ) : null}
      {showScheduleModal ? (
        <AddSchedule
          deliverable={deliverableData}
          setDisplay={setShowScheduleModal}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
        />
      ) : null}
      <ContainerFluid maxWidth="lg">
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">
                Evaluation Schedule: {deliverableData.title}
              </Typography>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Deadline:{" "}
                  {deliverableData.deadline
                    ? new Date(deliverableData.deadline).toLocaleDateString()
                    : "None"}
                  {/* {deliverableData.deadline} */}
                </Typography>
                {/* <Typography variant="body">
                  {" ( "}
                  {deliverableData.deadline
                    ? new Date(
                        new Date(deliverableData.deadline) - new Date()
                      ).getDay()
                    : ""}
                  {")"}
                </Typography> */}
              </Box>
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}></Box>
          </Box>
          <Card
            variant="outlined"
            style={{
              marginBottom: "2rem",
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">Template File</Typography>
              {/* <Button variant="text" onClick={downloadTemplateFile}>
                {name}
              </Button> */}
              {deliverableData.template ? (
                <form onSubmit={downloadTemplateFile} className="form">
                  <Button variant="text" type="submit">
                    {deliverableData.template}
                  </Button>
                </form>
              ) : (
                <Typography variant="body">None</Typography>
              )}
            </Box>
            <Box>
              {/* {roles.includes("PMO") ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={uploadTemplateFile}
                >
                  Upload
                </Button>
              ) : null} */}
            </Box>
          </Card>
          {/* <DataTable DataHead={DataHead} DataBody={DataBody} /> */}
          {/*
           */}
          <Card
            variant="outlined"
            style={{
              marginBottom: "2rem",
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">Evaluation Schedule</Typography>
            </Box>
            <Box>
              {roles.includes("PMO") &&
              deliverableData &&
              deliverableData.deadline ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSchedule}
                >
                  Add Schedule
                </Button>
              ) : null}
            </Box>
          </Card>
          {/* <DataTable
            DataHead={DataHead}
            DataBody={() => <DataBody2 showScheduleModal={showScheduleModal} />}
          /> */}
          <DataBody2
            showEditScheduleModal={showEditScheduleModal}
            setShowEditScheduleModal={setShowEditScheduleModal}
            toEdit={toEdit}
            deliverableDeadline={deliverableData.deadline}
            setToEdit={setToEdit}
            showScheduleModal={showScheduleModal}
          />
          {/* <DataBody /> */}
        </Main>
      </ContainerFluid>
    </>
  );
};

export default EvaluationScheduleDetail;
