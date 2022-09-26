import {
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../pages/auth.styles";
import Select from "./Select";
// import Select from "../components/Select";
// import styles from "./auth.styles";

const EditSchedule = props => {
  const { setDisplay, schedule, setToastMessage, setShowToast, deliverable } =
    props;
  console.log(deliverable);
  const [committee, setCommittee] = useState();
  const [evaluationDate, setEvaluationDate] = useState(
    schedule.date ? schedule.date.split("T")[0] : ""
  );
  const [groupItems, setGroupItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);
  console.log(schedule);
  return null;
  // const [students, setStudents] = useState([]);
  // const [supervisors, setSupervisors] = useState([]);
  // const [members, setMembers] = useState([]);
  // const [leader, setLeader] = useState("");
  // const [supervisor, setSupervisor] = useState("");

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:5000/api/committee/get-all"
  //         //   "http://localhost:5000/api/group/get-all/" +
  //         //     localStorage.getItem(USER_ID)
  //       );
  //       console.log("DETAILED GROUPS", res.data);
  //       setData(res.data.committees);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getData();
  // }, []);

  // useEffect(() => {
  //   setGroups([]);
  //   console.log(committee);
  //   if (!committee) return;

  //   const selectedCommitee = data.find(comm => comm.id === committee);

  //   if (!selectedCommitee) return;
  //   // console.log("SELECTED COMMITTEE", selectedCommitee);
  //   console.log("SELECTED COMMITTEE", selectedCommitee);
  //   const deliverableKey = "d" + deliverable.id;
  //   const committeeGroups = selectedCommitee.Groups
  //     ? selectedCommitee.Groups.map(group => ({
  //         id: group.id,
  //         text:
  //           group.name +
  //           " (" +
  //           group.members.map(member => member.rollNo).join(", ") +
  //           ")",
  //         value: group.id,
  //         schedules: group.schedules,
  //       })).filter(group => !group.schedules[deliverableKey])
  //     : [];
  //   console.log("COMMITTEE GROUPS", committeeGroups);

  //   setGroupItems(committeeGroups);
  // }, [data, committee, deliverable]);

  // useEffect(() => {
  //   console.log(schedule);
  //   const commItems = data
  //     ? data.map(committee => {
  //         const data = {
  //           id: committee.id,
  //           value: committee.id,
  //           text:
  //             committee.name +
  //             " (" +
  //             committee.members.map(member => member.name).join(", ") +
  //             ")",
  //         };
  //         console.log(data);
  //         return data;
  //       })
  //     : null;
  //   const comm = commItems.find(comm => comm.id == schedule.committee.id).id;
  //   console.log(comm);
  //   setCommittee(comm && comm.id ? comm.id : null);
  // }, [data, schedule]);

  // const selectCommitteeHandler = committee => {
  //   console.log("Comm", committee);
  //   setCommittee(committee);
  // };
  // const selectGroupsHandler = groups => {
  //   console.log("Groups", groups);
  //   setGroups(groups);
  // };

  // const handleEvaluationDateChange = e => {
  //   const ed = new Date(e.target.value);
  //   const dd = new Date(deliverable.deadline);
  //   setEvaluationDate("");
  //   if (ed < dd || ed.getDay() === 0 || ed.getDay() === 6) {
  //     setToastMessage("Invalid evaluation date.");
  //     setShowToast(true);
  //     console.log("NOT SET");
  //     return;
  //   }
  //   setEvaluationDate(e.target.value);
  // };

  // const handleEditSchedule = async () => {
  //   const data = {
  //     groups: groups,
  //     committee: committee,
  //     date: new Date(evaluationDate),
  //     deliverableId: deliverable.id,
  //   };
  //   console.log(data);
  //   try {
  //     const result = await axios.post(
  //       "http://localhost:5000/api/evaluation/schedule",
  //       data
  //     );
  //     console.log(result.data);
  //     if (result.data.create) {
  //       setToastMessage("Schedule added successfully.");
  //       setShowToast(true);
  //     } else {
  //       throw new Error("");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setToastMessage("Something went wrong");
  //     setShowToast(true);
  //   } finally {
  //     setEvaluationDate("");
  //     setGroups([]);
  //     setCommittee("");
  //     setDisplay(false);
  //   }
  // };

  // const committeeItems = data
  //   ? data.map(committee => {
  //       const data = {
  //         id: committee.id,
  //         value: committee.id,
  //         text:
  //           committee.name +
  //           " (" +
  //           committee.members.map(member => member.name).join(", ") +
  //           ")",
  //       };
  //       console.log(data);
  //       return data;
  //     })
  //   : null;

  // return (
  //   <Backdrop
  //     sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
  //     open={true}
  //   >
  //     <Container
  //       maxWidth="md"
  //       style={{ maxHeight: "80vh", overflowY: "scroll" }}
  //     >
  //       <Card style={styles.card}>
  //         <Typography variant="h5" style={styles.heading}>
  //           Edit Schedule
  //         </Typography>
  //         <Box>
  //           <Typography variant="h6">Evaluation Date</Typography>
  //           <Box style={{ margin: "0.5rem" }}>
  //             <TextField
  //               style={{ width: "100%" }}
  //               type="date"
  //               value={evaluationDate}
  //               onChange={handleEvaluationDateChange}
  //             />
  //           </Box>
  //         </Box>
  //         <Box style={{ marginTop: "0.5rem" }}>
  //           <Typography variant="h6">Committee</Typography>
  //           <Box style={{ margin: "0.5rem" }}>
  //             <Select
  //               required
  //               style={styles.input}
  //               multiple={false}
  //               label="Committee"
  //               value={committee}
  //               setValue={selectCommitteeHandler}
  //               items={committeeItems}
  //             />
  //           </Box>
  //         </Box>
  //         <Box>
  //           <Typography variant="h6">Groups</Typography>
  //           <Box style={{ margin: "0.5rem" }}>
  //             <Select
  //               required
  //               style={styles.input}
  //               multiple={true}
  //               label="Groups"
  //               value={groups}
  //               setValue={selectGroupsHandler}
  //               items={groupItems}
  //             />
  //           </Box>
  //         </Box>

  //         <Box>
  //           <Button
  //             variant="contained"
  //             disabled={!committee || !groups.length || !evaluationDate}
  //             onClick={handleEditSchedule}
  //           >
  //             Submit
  //           </Button>
  //           <Button
  //             variant="contained"
  //             color="error"
  //             style={{ marginLeft: "1rem" }}
  //             onClick={() => setDisplay(false)}
  //           >
  //             Cancel
  //           </Button>
  //         </Box>
  //       </Card>
  //     </Container>
  //   </Backdrop>
  // );
};

export default EditSchedule;
