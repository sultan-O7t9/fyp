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
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactDataGrid from "@inovua/reactdatagrid-community";

import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import "@inovua/reactdatagrid-community/index.css";
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
import { USER_ID, USER_ROLE } from "../utils/keys";

const DATA = {
  // heads: ["Group ID", "Project Title", "Submitted On", "Submission"],
  heads: [
    "Group ID",
    "Project Title",
    "Submission Date",
    // "Status",
    // "Comment",
    "Submission File",
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

const DataBody = () => {
  const roles = localStorage.getItem(USER_ROLE);
  const [submissionsData, setSubmissionsData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [gridCols, setGridCols] = useState([]);
  const history = useHistory();
  const params = useParams();

  const deliverableId = params.id;

  const filterValue = [
    {
      name: "status",
      operator: "inlist",
      type: "select",
      emptyValue: "",
    },
  ];
  // const [filter, setFilter] = useState(null);
  // const filters = [
  //   { text: "Submitted", id: 1 },
  //   { text: "Verified", id: 2 },
  //   { text: "Rejected", id: 3 },
  //   { text: "Revised", id: 4 },
  // ];
  const userId = localStorage.getItem(USER_ID);
  //Get all submissions of the deliverabale

  useEffect(() => {
    console.log(userId);
    console.log(deliverableId);
    const getSubmissions = async () => {
      try {
        let newData = [];
        if (roles.includes("PMO")) {
          const res = await axios.post(
            "http://localhost:5000/api/deliverable/get-grp-submission-dept",
            {
              deliverableId,
              userId,
            }
          );
          console.log(res.data);
          newData = res.data.submissions;

          // if (!roles.includes("PMO")) {
          //   newData = res.data.submissions.filter(submission => {
          //     return submission.supervisorId == userId;
          //   });
          // }
        }
        if (roles.includes("SUPERVISOR")) {
          const res = await axios.post(
            "http://localhost:5000/api/deliverable/get-grp-submission-sup",
            {
              deliverableId,
              userId,
            }
          );
          console.log(res.data);
          newData = res.data.submissions;
        }
        newData.filter(submission => {
          return submission.supervisorId == userId;
        });

        setSubmissionsData(
          newData.filter(s => {
            return s.submission.hasOwnProperty("name");
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getSubmissions();
  }, [userId, deliverableId, roles]);

  const downloadSubmission = async (e, file) => {
    e.preventDefault();
    try {
      let url = "http://localhost:5000/" + file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(submissionsData);
    const dataSource = submissionsData.map(item => {
      console.log(item);
      return {
        ...item,
        status: item.submission.status,
        actions: (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              size="small"
              onClick={() => {
                history.push("/sup/deliverable/detail/" + item.id, {
                  deliverableId,
                  groupId: item.id,
                });
                console.log(item);
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
        name: "name",
        header: "Name",
        defaultFlex: 1,
      },
      {
        name: "project",
        header: "Project Title",
        defaultFlex: 2,
        render: ({ value }) => {
          return value.title;
        },
      },

      {
        name: "submission",
        header: "Submited On",
        defaultFlex: 2,
        render: ({ value }) => {
          return new Date(value.createdAt).toDateString();
        },
      },
      {
        name: "submission",
        header: "File",
        defaultFlex: 2,
        render: ({ value }) => {
          // return value.name;
          return value ? (
            <Button
              onClick={() => {
                let url = "http://localhost:5000/" + value.name;
                let win = window.open(url, "_blank");
                win.focus();
              }}
            >
              {value.name}
            </Button>
          ) : (
            "None"
          );
        },
      },
      {
        name: "status",
        header: "Status",
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
        filterEditor: SelectFilter,
        filterEditorProps: {
          placeholder: "All",
          dataSource: [
            { id: "Revised", label: "Revised" },
            { id: "Approved", label: "Approved" },
            { id: "Pending", label: "Pending" },
          ],
        },
      },

      // {
      //   name: "project",
      //   header: "Project",
      //   defaultFlex: 2,
      //   render: ({ value }) => {
      //     return value ? value : "None";
      //   },
      // },

      {
        name: "actions",
        defaultFlex: 2,
        header: "Actions",
      },
    ];
    setGridCols(columns);
    setGridData(dataSource);
  }, [submissionsData, history]);

  const sendMailToStudents = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/send-mail",
        { deliverableId, userId }
      );
      console.log(res.data.get);
      if (res.data.get) {
        alert("Mail sent successfully");
      } else {
        alert("Mail not sent");
      }
    } catch (err) {
      console.log(err);
      alert("Error sending mail");
    }
  };

  return (
    <ReactDataGrid
      idProperty="id"
      columns={gridCols}
      // selected={selectedGroups}
      // checkboxColumn
      // onSelectionChange={onSelectionChange}
      defaultFilterValue={filterValue}
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
  //       <TableCell colSpan={3}>
  //         <Box>
  //            <Button
  //             variant="contained"
  //             type="submit"
  //             onClick={sendMailToStudents}
  //           >
  //             Send Mail
  //           </Button>
  //         </Box>
  //       </TableCell>
  //     </TableRow> */}
  //     {submissionsData.map((row, index) => (
  //       <TableRow key={row.id}>
  //         <TableCell>{row.name}</TableCell>
  //         {/* <TableCell>{row.members}</TableCell> */}
  //         <TableCell>
  //           {row.project.hasOwnProperty("title") && row.project.title
  //             ? row.project.title
  //             : "None"}
  //         </TableCell>
  //         <TableCell>
  //           {row.submission.createdAt
  //             ? new Date(row.submission.createdAt).toLocaleString()
  //             : "-"}
  //         </TableCell>
  //         <TableCell>
  //           {row.hasOwnProperty("submission") && row.submission.name ? (
  //             <form
  //               onSubmit={e => {
  //                 downloadSubmission(e, row.submission.name);
  //               }}
  //               className="form"
  //             >
  //               <Button variant="text" type="submit">
  //                 {row.submission.name}
  //               </Button>
  //             </form>
  //           ) : (
  //             <Typography variant="body">None</Typography>
  //           )}
  //         </TableCell>
  //       </TableRow>
  //     ))}
  //   </>
  // );
};

const DataBody2 = props => {
  const { showScheduleModal } = props;
  const userId = localStorage.getItem(USER_ID);
  const history = useHistory();
  const params = useParams();
  const deliverableId = params.id;
  const [schedulesData, setSchedulesData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);

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
        const schedules = res.data.schedules;
        schedules.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
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

  const handleDeleteSchedule = async id => {
    console.log("DEL", id);
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/evaluation/del-schedule/" + id
      );
      console.log(res.data);
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

  return (
    <>
      {schedulesData.length
        ? schedulesData.map(row => {
            const evaluators =
              row.committee && row.committee.evaluators
                ? row.committee.evaluators.map(evaluator => {
                    return evaluator.id;
                  })
                : [];
            const isEvaluator =
              evaluators.filter(user => user == userId).length == 1;
            const evalRole = localStorage
              .getItem(USER_ROLE)
              .includes("EVALUATOR");
            console.log("HELLO", userId, isEvaluator, evalRole);
            return (
              <>
                <TableRow key={row.id}>
                  <TableCell>
                    {row.group.id ? row.group.name : "None"}
                  </TableCell>
                  <TableCell>
                    {row.project.id ? row.project.name : "None"}
                  </TableCell>
                  <TableCell>
                    {row.group.supervisor.id
                      ? row.group.supervisor.name
                      : "None"}
                  </TableCell>
                  {/* <TableCell>
              <List>
                {row.members.map(member => (
                  <ListItem>{member.name}</ListItem>
                ))}
              </List>
            </TableCell>
            <TableCell>
              <List>
                {row.members.map(member => (
                  <ListItem style={{ fontSize: "12px" }}>
                    {member.rollNo}
                  </ListItem>
                ))}
              </List>
            </TableCell> */}
                  <TableCell>
                    {row.committee.id ? row.committee.name : "None"}
                  </TableCell>
                  <TableCell>
                    {row.date ? new Date(row.date).toDateString() : "None"}
                  </TableCell>
                  <TableCell align="right">
                    {/* <IconButton
                      onClick={() => {
                        handleEditSchedule(row.id);
                      }}
                      color="primary"
                      variant="outlined"
                    >
                      <EditIcon />
                    </IconButton> */}

                    <IconButton
                      style={{ marginRight: "1rem" }}
                      onClick={() => {
                        handleDeleteSchedule(row.id);
                      }}
                      color="error"
                      variant="outlined"
                    >
                      <DeleteIcon />
                    </IconButton>
                    {localStorage.getItem(USER_ROLE).includes("EVALUATOR") &&
                    isEvaluator ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          handleNavToEvaluationPage(row);
                        }}
                      >
                        Evaluate
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              </>
            );
          })
        : null}
    </>
  );
};

const SupervisorDeliverableDetail = props => {
  const isEligible =
    localStorage.getItem(USER_ROLE) &&
    localStorage.getItem(USER_ROLE).includes("SUPERVISOR");

  const roles = localStorage.getItem(USER_ROLE);
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
  const [supGroups, setSupGroups] = useState([]);
  const [exGroup, setExGroup] = useState(null);
  const [days, setDays] = useState([]);
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

  useEffect(() => {
    const getGroups = async () => {
      const userId = localStorage.getItem(USER_ID);
      try {
        const res2 = await axios.post(
          "http://localhost:5000/api/group/get-groups-sup/",
          {
            userId,
          }
        );
        console.log(res2.data.groups);
        setSupGroups(res2.data.groups);
      } catch (err) {
        console.log(err);
      }
    };
    getGroups();
  }, []);

  const selectGroupHandler = g => {
    setExGroup(g);
  };

  const handleExtension = async () => {
    const data = {
      groupId: exGroup,
      deliverableId: deliverableId,
      days: days,
      supervisorId: localStorage.getItem(USER_ID),
    };

    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/req-ex",
        data
      );
      console.log(res.data);
      setToastMessage("Extension request sent successfully");
      setShowToast(true);
      setExGroup("");
      setDays("");
    } catch (err) {
      console.log(err);
      setToastMessage("Extension request failed");
      setShowToast(true);
      setExGroup("");
      setDays("");
    }
  };
  if (!isEligible) return <Redirect to="/404" />;

  return (
    <>
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
              <Typography variant="h3">{deliverableData.title}</Typography>
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
            {roles.includes("SUPERVISOR") ? (
              <Box>
                <Box>
                  <Select
                    style={{ marginBottom: "1rem" }}
                    label="Group"
                    value={exGroup}
                    setValue={selectGroupHandler}
                    items={
                      supGroups.length
                        ? supGroups.map(g => ({
                            id: g.id.split("_").pop(),
                            value: g.id.split("_").pop(),
                            text: g.id,
                          }))
                        : []
                    }
                  />
                  <Select
                    style={{ marginBottom: "1rem" }}
                    label="Days"
                    items={[...Array(10 - 1 + 1).keys()]
                      .map(x => x + 1)
                      .map(a => ({
                        id: a,
                        value: a,
                        text: a,
                      }))}
                    value={days}
                    setValue={days => setDays(days)}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!days || !exGroup}
                    onClick={handleExtension}
                  >
                    Request Extension
                  </Button>
                </Box>
              </Box>
            ) : null}

            {roles.includes("PMO") ? (
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSettings}
                  color="primary"
                >
                  Settings
                </Button>
              </Box>
            ) : null}
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
              {roles.includes("PMO") ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={uploadTemplateFile}
                >
                  Upload
                </Button>
              ) : null}
            </Box>
          </Card>
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
              <Typography variant="h6">Submission Details</Typography>
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
          {/* <DataTable DataHead={DataHead} DataBody={DataBody} /> */}
          <DataBody />
          {/* <DataTable
            DataHead={DataHead}
            DataBody={() => <DataBody2 showScheduleModal={showScheduleModal} />}
          /> */}
        </Main>
      </ContainerFluid>
    </>
  );
};

export default SupervisorDeliverableDetail;
