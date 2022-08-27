import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  TableCell,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Toast from "../components/Toast";
import RadioButtonGroup from "../components/RadioButtonGroup";

const DataHead = () => null;

const DataBody = props => {
  const { groupInfo } = props;
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();
  const [projectDetails, setProjectDetails] = useState({});
  const [toast, setToast] = useState(false);
  const [tMsg, setTMsg] = useState("");
  const [bookletComment, setBookletComment] = useState("");
  // const [modal, setModal] = useState(false);
  const params = useParams();
  const groupId = params.id;
  // console.log(id);
  // const [groupInfo, setGroupInfo] = useState({});

  const isSupervisor =
    localStorage.getItem("USER_ROLE").includes("SUPERVISOR") &&
    groupInfo.hasOwnProperty("supervisor") &&
    groupInfo.supervisor.id == localStorage.getItem("USER_ID");
  const isPmo = localStorage.getItem("USER_ROLE").includes("PMO");

  const [pmoEvaluationData, setPmoEvaluationData] = useState({});
  const [pmoMarks, setPmoMarks] = useState("");
  const [pmoRemarks, setPmoRemarks] = useState("");

  const [supEvaluationData, setSupEvaluationData] = useState({});
  const [supMarks, setSupMarks] = useState("");
  const [supRemarks, setSupRemarks] = useState("");

  useEffect(() => {
    if (supEvaluationData.remarks) setSupRemarks(supEvaluationData.remarks);
  }, [supEvaluationData]);
  useEffect(() => {
    if (pmoEvaluationData.remarks) setPmoRemarks(pmoEvaluationData.remarks);
  }, [pmoEvaluationData]);

  useEffect(() => {
    if (!supEvaluationData.students) return;
    const students = supEvaluationData.students;
    const marks = {};
    students.forEach(student => {
      marks[student.rollNo] = student.marks;
    });
    setSupMarks(marks);
  }, [supEvaluationData]);
  useEffect(() => {
    if (!pmoEvaluationData.students) return;
    const students = pmoEvaluationData.students;
    const marks = {};
    students.forEach(student => {
      marks[student.rollNo] = student.marks;
    });
    setPmoMarks(marks);
  }, [pmoEvaluationData]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/evaluation/sup-evaluation",
          { groupId: groupId }
        );
        console.log(response.data);
        setSupEvaluationData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  useEffect(() => {
    //get project Data,
    const getProjectDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/project/get-grp/" + groupId
        );
        console.log(res.data);
        setProjectDetails(res.data.project);
      } catch (err) {
        console.log(err);
      }
    };
    getProjectDetails();
  }, [groupId]);

  useEffect(() => {
    const getEvaluationData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/evaluation/pmo-evaluation",
          { groupId: groupId }
        );
        console.log(response.data);
        setPmoEvaluationData(response.data.group);
        // console.log(DATA.group);
        // setEvalData(DATA.group);
      } catch (err) {
        console.log(err);
      }
    };
    getEvaluationData();
  }, [groupId]);

  const changeSupMarks = (rollNo, marks) => {
    if (marks < 0) return;
    if (marks > 40) return;
    const newMarks = { ...supMarks, [rollNo]: marks };
    setSupMarks(newMarks);
  };
  const changePmoMarks = (rollNo, marks) => {
    if (marks < 0) return;
    if (marks > 20) return;
    const newMarks = { ...pmoMarks, [rollNo]: marks };
    setPmoMarks(newMarks);
  };

  const handleSupMarks = async () => {
    // const data = {
    //   groupId: groupId,
    //   remarks: supRemarks,
    //   students: supMarks.keys().map(rollNo => {
    //     return { rollNo: rollNo, marks: supMarks[rollNo] };
    //   }),
    // };
    const students = [...supEvaluationData.students];

    students.forEach(student => {
      student.marks = supMarks[student.rollNo];
    });
    const data = {
      groupId: groupId,
      remarks: supRemarks,
      students: students,
    };
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-sup-evaluation",
        data
      );
      console.log(res.data);
      setTMsg("Marks updated successfully");
      setToast(true);
    } catch (err) {
      setTMsg("Error updating marks");
      setToast(true);
      console.log(err);
    }
  };
  const handlePmoMarks = async () => {
    const students = [...pmoEvaluationData.students];

    students.forEach(student => {
      student.marks = pmoMarks[student.rollNo];
    });
    const data = {
      groupId: groupId,
      remarks: pmoRemarks,
      students: students,
    };
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/evaluation/add-pmo-evaluation",
        data
      );
      console.log(res.data);
      setTMsg("Marks updated successfully");
      setToast(true);
    } catch (err) {
      setTMsg("Error updating marks");
      setToast(true);
      console.log(err);
    }
  };

  const handleDetailedReport = () => {
    history.push("/report", groupInfo);
  };

  useEffect(() => {
    console.log(groupInfo);
    // setBookletStatus(groupInfo.bookletsStatus);
    setBookletComment(groupInfo.bookletsComment);
  }, [groupInfo]);

  const changeBookletStatus = async (id, status) => {
    const data = {
      groupId: id,
      status: status,
    };
    // console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/group/change-booklet-status",
        data
      );
      // console.log("STATUS", response.data.group.bookletsStatus);
      // setBookletStatus(response.data.group.bookletsStatus);
      setTMsg(
        "Booklet Status changed to " + response.data.group.bookletsStatus
      );
      setToast(true);
    } catch (error) {
      console.log(error);
    }
  };
  const changeBookletComment = async id => {
    const data = {
      groupId: id,
      comment: bookletComment,
    };

    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/group/change-booklet-comment",
        data
      );
      if (res.data.comment === true) {
        setTMsg("Comment Added Successfully");
        setToast(true);
      }
    } catch (error) {
      console.log(error);
      setTMsg(error.message);
      setToast(true);
    }

    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/group/change-booklet-status",
    //     data
    //   );
    //   setBookletStatus(response.data.group.bookletsStatus === "Approved");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <>
      {toast ? <Toast open={toast} setOpen={setToast} message={tMsg} /> : null}

      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Group Leader</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" to="#">
            {groupInfo.hasOwnProperty("leader") ? (
              groupInfo.leader
            ) : (
              <Typography variant="body1" style={{ color: "red" }}>
                No Leader Assigned
              </Typography>
            )}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Group Members</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("members") &&
          groupInfo.members.length > 0 ? (
            groupInfo.members.map(member => (
              <Typography key={member} variant="body1" to="#">
                {member}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Members Added
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Supervisor</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("supervisor") &&
          groupInfo.supervisor.name ? (
            <Typography to="#" variant="body1">
              {groupInfo.supervisor.name}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Supervisor Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Evaluation Committee</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("committee") && groupInfo.committee.name ? (
            <Typography to="#" variant="body1">
              {groupInfo.committee.name}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Committee Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {localStorage.getItem("USER_ROLE").includes("PMO") ? (
        <TableRow>
          <TableCell colSpan={1}>
            <Typography variant="h6">Booklets</Typography>
          </TableCell>
          <TableCell>
            <RadioButtonGroup
              label=""
              defaultValue={groupInfo.bookletsStatus}
              // value={bookletStatus}
              onChange={e => {
                changeBookletStatus(groupInfo.id, e.target.value);

                console.log(e.target.value);
              }}
              items={[
                { label: "Approved", value: "Approved" },
                { label: "Pending", value: "Pending" },
                { label: "Not Submitted", value: "Not Submitted" },
              ]}
            />
          </TableCell>
          <TableCell>
            <TextareaAutosize
              minRows={3}
              value={bookletComment}
              onChange={e => {
                setBookletComment(e.target.value);
              }}
            />
            <Button
              variant="contained"
              size="small"
              // disabled={!bookletComment}
              onClick={() => {
                changeBookletComment(groupInfo.id);
              }}
            >
              Add Comment
            </Button>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell>
            {groupInfo.hasOwnProperty("bookletsStatus") ? (
              <Typography
                to="#"
                variant="body1"
                style={{
                  color:
                    groupInfo.bookletsStatus === "Approved"
                      ? "green"
                      : groupInfo.bookletsStatus === "Pending"
                      ? "orange"
                      : "red",
                }}
              >
                {groupInfo.bookletsStatus}
              </Typography>
            ) : (
              <Typography variant="body1" style={{ color: "red" }}>
                Not Submitted
              </Typography>
            )}
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell colSpan={3}>{""}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <Typography variant="h4">Project Details</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Project Title</Typography>
        </TableCell>
        <TableCell>
          {groupInfo.hasOwnProperty("project") && groupInfo.project.title ? (
            <Typography variant="body1">{groupInfo.project.title}</Typography>
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              No Project Assigned
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {groupInfo.hasOwnProperty("project") &&
      groupInfo.project.title &&
      projectDetails.hasOwnProperty("title") ? (
        <>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h6">Project Description</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {projectDetails.description}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h6">Project Type</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">{projectDetails.type}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h6">Project Platform</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {projectDetails.platform[0].toUpperCase() +
                  projectDetails.platform.slice(1)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h6">Development Technology</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {projectDetails.dev_tech
                  .split(" ")
                  .map(word => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </Typography>
            </TableCell>
          </TableRow>
        </>
      ) : null}
      {/* <TableRow>
        <TableCell>
          <Typography variant="h6">Project Proposal</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project Documentation</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Working System</Typography>
        </TableCell>
        <TableCell>
          <MenuButton />
        </TableCell>
        {role === "SUPERVISOR" || role == "EVALUATOR" ? (
          <TableCell>
            <Button
              onClick={() => {
                history.push("/groups/proposal/12");
              }}
            >
              Show Details
            </Button>
          </TableCell>
        ) : null}
      </TableRow> */}
      <TableRow>
        <TableCell colSpan={3}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <Typography variant="h4">PMO Evaluation</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Project Management Office (Sub-section total:20)
          </Typography>
          <Typography>Meetings Deadlines, Attending Workshops</Typography>
        </TableCell>
      </TableRow>
      {/* {localStorage.getItem("USER_ROLE").includes("PMO") ? (*/}
      <>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>Total Marks</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Marks Obtained</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Remarks</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell style={{ display: "flex" }}>
            {pmoEvaluationData.students && pmoEvaluationData.students.length
              ? pmoEvaluationData.students.map(student => (
                  <div
                    style={{
                      fontWeight: "bold",
                      width: "6rem",
                      marginRight: "1rem",
                    }}
                  >
                    {student.rollNo}
                  </div>
                ))
              : null}
          </TableCell>
          <TableCell colSpan={1}>{""}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>20</TableCell>
          <TableCell>
            {pmoEvaluationData.students && pmoEvaluationData.students.length
              ? pmoEvaluationData.students.map(student => {
                  const value = pmoMarks[student.rollNo]
                    ? pmoMarks[student.rollNo]
                    : 0;
                  return (
                    <>
                      {isPmo ? (
                        <TextField
                          style={{ width: "6rem", marginRight: "1rem" }}
                          value={value}
                          onChange={e => {
                            changePmoMarks(student.rollNo, e.target.value);
                          }}
                        />
                      ) : (
                        <Typography
                          style={{
                            width: "6rem",
                            marginRight: "1rem",
                            display: "inline-block",
                          }}
                        >
                          {value}
                        </Typography>
                      )}
                    </>
                  );
                })
              : null}
          </TableCell>
          <TableCell>
            {isPmo ? (
              <TextareaAutosize
                minRows={4}
                value={pmoRemarks}
                onChange={e => setPmoRemarks(e.target.value)}
              />
            ) : (
              <Typography variant="body1">{pmoRemarks}</Typography>
            )}
          </TableCell>
        </TableRow>

        {isPmo ? (
          <TableRow>
            <TableCell colSpan={3}>
              <Button
                onClick={handlePmoMarks}
                variant="contained"
                color="primary"
                size="large"
                style={{ display: "block" }}
              >
                Save{" "}
              </Button>
            </TableCell>
          </TableRow>
        ) : null}
      </>
      {/* Supervisor Marks */}
      <TableRow>
        <TableCell colSpan={3}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <Typography variant="h4">Supervisor Evaluation</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Supervisor (Sub-section total: 40)
          </Typography>
          <Typography>Meetings, Project Progress</Typography>
        </TableCell>
      </TableRow>

      <>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>Total Marks</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Marks Obtained</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Remarks</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell style={{ display: "flex" }}>
            {supEvaluationData.students && supEvaluationData.students.length
              ? supEvaluationData.students.map(student => (
                  <div
                    style={{
                      fontWeight: "bold",
                      width: "6rem",
                      marginRight: "1rem",
                    }}
                  >
                    {student.rollNo}
                  </div>
                ))
              : null}
          </TableCell>
          <TableCell colSpan={1}>{""}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>40</TableCell>
          <TableCell>
            {supEvaluationData.students && supEvaluationData.students.length
              ? supEvaluationData.students.map(student => {
                  const value = supMarks[student.rollNo]
                    ? supMarks[student.rollNo]
                    : 0;
                  return (
                    <>
                      {isSupervisor ? (
                        <TextField
                          style={{ width: "6rem", marginRight: "1rem" }}
                          value={value}
                          onChange={e => {
                            changeSupMarks(student.rollNo, e.target.value);
                          }}
                        />
                      ) : (
                        <Typography
                          style={{
                            width: "6rem",
                            marginRight: "1rem",
                            display: "inline-block",
                          }}
                        >
                          {value}
                        </Typography>
                      )}
                    </>
                  );
                })
              : null}
          </TableCell>
          <TableCell>
            {isSupervisor ? (
              <TextareaAutosize
                minRows={4}
                value={supRemarks}
                onChange={e => setSupRemarks(e.target.value)}
              />
            ) : (
              <Typography variant="body1">{supRemarks}</Typography>
            )}
          </TableCell>
        </TableRow>

        {isSupervisor ? (
          <TableRow>
            <TableCell colSpan={3}>
              <Button
                onClick={handleSupMarks}
                variant="contained"
                color="primary"
                size="large"
                style={{ display: "block" }}
              >
                Save{" "}
              </Button>
            </TableCell>
          </TableRow>
        ) : null}
      </>
      <TableRow>
        <TableCell colSpan={3}>
          {/* <Typography variant="h6">
            Detailed Report
          </Typography> */}
          <Button variant="contained" onClick={handleDetailedReport}>
            Show Detailed Report
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

const GroupDetail = () => {
  const [groupInfo, setGroupInfo] = useState({});

  const params = useParams();
  const groupId = params.id;
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/group/get/" + groupId
        );
        console.log(res.data);
        setGroupInfo(res.data.group);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [groupId]);
  return (
    <>
      <ContainerFluid title="">
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3">
                {groupInfo.hasOwnProperty("name") ? groupInfo.name : ""}
              </Typography>
            </Box>
            {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
          </Box>

          <DataTable
            DataHead={DataHead}
            DataBody={() => <DataBody groupInfo={groupInfo} />}
          />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default GroupDetail;
