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

const AddSemester = props => {
  const { setDisplay, semesters, setToastMessage, setShowToast } = props;
  // console.log(deliverable);
  const [newSemester, setNewSemester] = useState("");
  const [semester, setSemester] = useState([]);
  const [year, setYear] = useState([]);
  const [startYear, setStartYear] = useState([]);
  const [endYear, setEndYear] = useState([]);

  // const [students, setStudents] = useState([]);
  // const [supervisors, setSupervisors] = useState([]);
  // const [members, setMembers] = useState([]);
  // const [leader, setLeader] = useState("");
  // const [supervisor, setSupervisor] = useState("");

  const selectSemesterHandler = sem => {
    console.log("sem", sem);
    setSemester(sem);
  };
  const selectYearHandler = yr => {
    console.log("yr", yr);
    setYear(yr);
  };
  const selectStartYearHandler = yr => {
    console.log("yr", yr);
    setStartYear(yr);
  };
  const selectEndYearHandler = yr => {
    console.log("yr", yr);
    setEndYear(yr);
  };

  const handleAddSemester = async () => {
    console.log(
      "NEW SEMESTER",
      `${semester}-${year - 2000}`,
      startYear,
      endYear
    );
    try {
      const res = await axios.post("http://localhost:5000/api/sem/create", {
        title: `${semester}-${year - 2000}`,
        session: `${startYear}-${endYear}`,
      });
      console.log("RES", res.data);
      setDisplay(false);
    } catch (error) {
      console.log(error);
    }
  };

  const yearItems = [
    ...Array(
      new Date().getFullYear() + 20 - new Date().getFullYear() - 6 + 1
    ).keys(),
  ]
    .map(x => x + new Date().getFullYear() - 6)
    .map(yr => {
      return {
        id: yr,
        value: yr,
        text: yr,
      };
    });
  const startYearItems = [
    ...Array(
      new Date().getFullYear() + 20 - new Date().getFullYear() - 6 + 1
    ).keys(),
  ]
    .map(x => x + new Date().getFullYear() - 6)
    .map(yr => {
      return {
        id: yr,
        value: yr,
        text: yr,
      };
    });
  console.log(startYearItems);
  const endYearItems = [
    ...Array(
      new Date().getFullYear() + 20 - new Date().getFullYear() - 6 + 1
    ).keys(),
  ]
    .map(x => x + new Date().getFullYear() - 6)
    .map(yr => {
      return {
        id: yr,
        value: yr,
        text: yr,
      };
    })
    .filter(yr => yr.id >= startYear + 4);
  console.log(endYearItems);

  return (
    <Backdrop
      sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Container maxWidth="md" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Card style={styles.card}>
          <Typography variant="h5" style={styles.heading}>
            Add New Semester
          </Typography>
          <Box>
            <Box>
              {/* <TextField
                style={{ width: "100%" }}
                type="date"
                value={newSemester}
                onChange={handleNewSemesterChange}
              /> */}
              <Select
                required
                // style={{ width: "100%" }}

                label="Semester"
                value={semester}
                setValue={selectSemesterHandler}
                items={["Spring", "Fall"].map(semester => {
                  return {
                    id: semester,
                    value: semester,
                    text: semester,
                  };
                })}
              />
              <Box style={{ marginTop: "1rem" }}>
                <Select
                  required
                  // style={{ width: "100%" }}

                  label="Year"
                  value={year}
                  setValue={selectYearHandler}
                  //Array(end-start+1)
                  items={yearItems}
                />
              </Box>
              <Typography variant="h6" style={{ marginTop: "1rem" }}>
                Session
              </Typography>
              <Box style={{ marginTop: "1rem" }}>
                <Select
                  required
                  // style={{ width: "100%" }}

                  label="Starting Year"
                  value={startYear}
                  setValue={selectStartYearHandler}
                  //Array(end-start+1)
                  items={startYearItems}
                />
              </Box>
              <Box style={{ marginTop: "1rem" }}>
                <Select
                  required
                  // style={{ width: "100%" }}

                  label="Ending Year"
                  value={endYear}
                  setValue={selectEndYearHandler}
                  //Array(end-start+1)
                  items={endYearItems}
                />
              </Box>
            </Box>
          </Box>

          <Box style={{ marginTop: "1rem" }}>
            <Button variant="contained" onClick={handleAddSemester}>
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: "1rem" }}
              onClick={() => setDisplay(false)}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Container>
    </Backdrop>
  );
};

export default AddSemester;
