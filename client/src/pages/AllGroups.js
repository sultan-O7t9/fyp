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
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import AddSemester from "../components/AddSemester";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import GroupExportTable from "../components/GroupExportTable";
import GroupsDataBody from "../components/GroupsDataBody";
import GroupsDataHead from "../components/GroupsDataHead";
import ImportFromExcel from "../components/ImportFromExcel";
import Link from "../components/Link";
import Main from "../components/Main";
import Select from "../components/Select";
import Toast from "../components/Toast";
import { USER_ID, USER_ROLE } from "../utils/keys";
import styles from "./auth.styles";
import ManageGroup from "./ManageGroup";

// const DATA = {
//   heads: ["Group ID", "Members", "Project Title", "Supervisor"],
//   data: [
//     {
//       id: "SE_18_1",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//     {
//       id: "SE_18_2",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//     {
//       id: "SE_18_3",
//       members: ["18094198-079", "18094198-089", "18094198-048"],
//       title: "Project 1",
//       supervisor: "Supervisor 1",
//     },
//   ],
// };

const AllGroups = () => {
  const isPMO = localStorage.getItem(USER_ROLE).includes("PMO");

  const [heads, setHeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManageGroup, setShowManageGroup] = useState(false);

  useEffect(() => {
    const getCurrSemData = async () => {
      try {
        const res = await axios.get("/api/sem/get-current");
        const cs = res.data.semester;
        setCurrentSemester(cs.id);
      } catch (err) {
        console.log(err);
      }
    };
    getCurrSemData();
  }, [isPMO, showManageGroup, showAddSemester]);
  useEffect(() => {
    const getAllSemData = async () => {
      try {
        const res = await axios.get("/api/sem/get-all");
        const cs = res.data.semesters;
        setSemesters(
          cs.length
            ? cs
                .map(s => ({
                  id: s.id,
                  text: s.title,
                  value: s.id,
                }))
                .concat({
                  id: null,
                  text: "None",
                  value: null,
                })
            : [{ id: null, text: "None", value: null }]
        );
      } catch (err) {
        console.log(err);
      }
    };
    getAllSemData();
  }, [isPMO, showAddSemester, showManageGroup]);

  useEffect(() => {
    const headers = [
      "Group ID",
      "Members",
      "",
      "Project Title",
      "Supervisor",
      "Booklets Status",
      "Booklets Comment",
      "",
      "",
    ];
    setHeads(headers);
  }, [isPMO, showManageGroup, showAddSemester]);

  useEffect(() => {
    setIsLoading(true);
    const getGroups = async () => {
      try {
        let filteredGroups = [];
        if (localStorage.getItem(USER_ROLE).includes("PMO")) {
          const res = await axios.post("/api/group/get-groups/", {
            userId: localStorage.getItem(USER_ID),
          });
          console.log(res.data.groups);
          filteredGroups = currentSemester
            ? res.data.groups.filter(g => g.semesterId === currentSemester)
            : res.data.groups;
        } else if (localStorage.getItem(USER_ROLE).includes("SUPERVISOR")) {
          const userId = localStorage.getItem(USER_ID);
          console.log("USER_ID", userId);
          const res2 = await axios.post("/api/group/get-groups-sup/", {
            userId,
          });
          console.log(res2.data);
          filteredGroups = currentSemester
            ? res2.data.groups.filter(g => g.semesterId === currentSemester)
            : res2.data.groups;
        }
        setBody(filteredGroups);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getGroups();

    // axios
    //   .get( "/api/group/get-groups/")
    //   .then(res => {
    //     console.log(res.data.groups);
    //     let filteredGroups = currentSemester
    //       ? res.data.groups.filter(g => g.semesterId === currentSemester)
    //       : res.data.groups;
    //     if (localStorage.getItem(USER_ROLE).includes("SUPERVISOR")) {
    //       filteredGroups = filteredGroups.filter(
    //         g => g.supervisorId != localStorage.getItem(USER_ID)
    //       );
    //       console.log(filteredGroups);
    //     }
    //     setBody(filteredGroups);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, [showManageGroup, currentSemester, showAddSemester, selectedSemester]);

  const editGroupHandler = group => {
    setShowManageGroup(group ? group : true);
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
  const importDataHandler = async importedData => {
    console.log(importedData);
    // return;

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
      item.includes("epartment")
    );
    const indexOfGroup = importedData.heads.findIndex(item =>
      item.includes("roup")
    );
    const indexOfSupervisor = importedData.heads.findIndex(item =>
      item.includes("visor")
    );
    console.log(importedData.data[0][indexOfSupervisor]);

    // console.log(indexOfRoll, indexOfName);
    // //this will show us which column contains roll no and name
    // console.log(indexOfRoll, indexOfName);
    const dataHeads = [
      importedData.heads[indexOfRoll],
      importedData.heads[indexOfName],
      importedData.heads[indexOfDepartment],
      importedData.heads[indexOfGroup],
      importedData.heads[indexOfSupervisor],
    ];
    const uniqueGroups = [
      ...new Set(importedData.data.map(d => d[indexOfGroup])),
    ];
    console.log(uniqueGroups);

    const groups = uniqueGroups.map(item => {
      console.log(item);
      return {
        groupId: item,
        members: importedData.data
          .filter(d => d[indexOfGroup] === item)
          .map(d => {
            return d[indexOfRoll];
          }),
        leader: importedData.data.filter(d => d[indexOfGroup] === item)[0][
          indexOfRoll
        ],
        department: importedData.data.filter(d => d[indexOfGroup] === item)[0][
          indexOfDepartment
        ],
        supervisorName: importedData.data.filter(
          d => d[indexOfGroup] === item
        )[0][indexOfSupervisor],
      };
    });

    // const students = importedData.data
    //   .map(item => {
    //     if (item[indexOfRoll] && item[indexOfName]&& item[indexOfDepartment]&& item[indexOfGroup]) {
    //       return {
    //         rollNo: item[indexOfRoll],
    //         name: item[indexOfName],
    //       };
    //     else return null;
    //   })
    //   .filter(item => item != null);
    // const alreadyCreatedStudents = body.map(item => item.rollNo);
    // const studentsToCreate = students.filter(
    //   item => !alreadyCreatedStudents.includes(item.rollNo)
    // );
    console.log(groups);
    // return;
    //Now send request to server and create studetns there, render the response array in table
    try {
      const response = await axios.post("/api/group/create-many", {
        groups,
        userId: localStorage.getItem(USER_ID),
      });
      console.log(response.data);
      if (response.status === 200) {
        setIsLoading(false);
        setHeads(dataHeads);
        setToastMessage("Groups imported successfully");
        setOpen(true);
        // setBody(response.data.students);
        // setRefresh(refresh => !refresh);
      }
    } catch (error) {
      setIsLoading(false);
      setToastMessage("Groups imported successfully");
      setOpen(true);
      setHeads(dataHeads);
      console.log(error);
    }
  };

  const selectCurrentSemesterHandler = async sem => {
    setCurrentSemester(sem);
    try {
      const res = axios.post("/api/sem/current", {
        semesterId: sem,
      });
      console.log(res.data);
      setToastMessage("Current Semester changed successfully");
      setOpen(true);
    } catch (err) {
      console.log(err);
      setToastMessage("Error changing current semester");
      setOpen(true);
    }
  };
  const selectSelectedSemesterHandler = async sem => {
    setSelectedSemester(sem);
    console.log(sem, selectedGroups);
    const data = {
      groups: selectedGroups,
      semesterId: sem,
    };
    try {
      const res = axios.post("/api/sem/update-grp-sem", data);
      console.log(res.data);
      // setCurrentSemester(sem);
      setToastMessage("Semester of selected groups changed successfully");
      setOpen(true);
    } catch (err) {
      console.log(err);
      setToastMessage("Error changing semester of selected groups");
      setOpen(true);
    }
  };

  return (
    <>
      {open ? (
        <Toast open={open} setOpen={setOpen} message={toastMessage} />
      ) : null}
      {showAddSemester ? <AddSemester setDisplay={setShowAddSemester} /> : null}
      <ContainerFluid maxWidth="xl">
        {showManageGroup ? (
          <ManageGroup
            group={showManageGroup}
            setDisplay={setShowManageGroup}
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
              <Typography variant="h3">Groups</Typography>
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {localStorage.getItem(USER_ROLE).includes("PMO") ? (
                <Box style={{ marginBottom: ".5rem" }}>
                  <ImportFromExcel
                    label="Import Groups"
                    importData={importDataHandler}
                    // disabled={body.length > 0}
                  />
                </Box>
              ) : null}
              {body.length > 0 ? (
                <>
                  {/* <GroupExportTable
                    label="Export Groups"
                    filename={("groups_" + new Date().toLocaleString()).replace(
                      " ",
                      "_"
                    )}
                    // head={heads.filter(head => head !== "Booklets Comment")}
                    head={heads}
                    body={body.map(row => ({
                      id: row.id,
                      members: row.members.map(member => member.rollNo),
                      project: row.project ? row.project.title : "None",
                      supervisor: row.supervisor ? row.supervisor : "None",
                      booklets: row.bookletsStatus
                        ? row.bookletsStatus
                        : "None",
                      bookletsComment: row.bookletsComment
                        ? row.bookletsComment
                        : "",
                    }))}
                  /> */}
                </>
              ) : null}
              {localStorage.getItem(USER_ROLE).includes("PMO") ? (
                <Button
                  style={{ marginTop: ".5rem" }}
                  variant="contained"
                  color="primary"
                  onClick={() => editGroupHandler()}
                >
                  Add Group
                </Button>
              ) : null}
            </Box>
          </Box>
          {localStorage.getItem(USER_ROLE).includes("PMO") ? (
            <>
              <Box sx={{ marginBottom: "3rem" }}>
                <Box
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                  }}
                >
                  <Typography variant="h6">Semester</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowAddSemester(true);
                    }}
                  >
                    Add New Semester
                  </Button>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <Select
                    label="Current Semester"
                    defaultValue={null}
                    style={styles.input}
                    value={currentSemester}
                    setValue={selectCurrentSemesterHandler}
                    items={semesters}
                  />
                </Box>
              </Box>
              {selectedGroups.length ? (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <Typography variant="h6">
                    {" "}
                    Set semester of selected groups to:{" "}
                  </Typography>
                  <Select
                    label="Semesters"
                    style={styles.input}
                    defaultValue={null}
                    value={selectedSemester}
                    setValue={selectSelectedSemesterHandler}
                    items={semesters}
                  />
                </Box>
              ) : null}
            </>
          ) : (
            <Box
              style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                width: "50%",
              }}
            >
              <Typography variant="h6">
                Current Semester:{" "}
                {semesters && semesters.length && currentSemester
                  ? semesters.find(sem => sem.id == currentSemester).text
                  : "None"}
              </Typography>
            </Box>
          )}

          {/* <DataTable
          // DataHead={() => <GroupsDataHead heads={heads} />}
          
          )} */}

          <GroupsDataBody
            isPMO={isPMO}
            data={body}
            setData={setBody}
            selected={selectedGroups}
            setSelected={setSelectedGroups}
            editGroup={editGroupHandler}
          />
        </Main>
      </ContainerFluid>
    </>
  );
};

export default AllGroups;
