import {
  Backdrop,
  Box,
  Button,
  Card,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Select from "../components/Select";
import MainAppbar from "../components/MainAppbar";
// import Styles from ";
import axios from "axios";
import RadioButtonGroup from "../components/RadioButtonGroup";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/auth";
import Styles from "../pages/auth.styles";

const AddProject = props => {
  const { groupId, setDisplay } = props;
  const typeItems = [
    { label: "Research", value: "research" },
    { label: "Development", value: "development" },
  ];
  const techItems = [
    { label: "Object Oriented", value: "object oriented" },
    { label: "Structured", value: "structured" },
  ];
  const platformItems = [
    { label: "Web", value: "web" },
    { label: "Distributed", value: "distributed" },
    { label: "Desktop", value: "desktop" },
    { label: "Setup Configurations", value: "setup configurations" },
    { label: "Other", value: "Other" },
  ];
  // const [students, setStudents] = useState([]);
  const [title, setTitle] = useState("");
  // const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(typeItems[0].value);
  const [tech, setTech] = useState(techItems[0].value);
  const [platform, setPlatform] = useState(platformItems[0].value);
  const history = useHistory();
  // const params=useParams();
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/group/get-student-group")
  //     .then(res => {
  //       setGroupId(res.data.group.id);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);

  // const selectMembersHandler = members => {
  //   if (members.length > 3) {
  //     return;
  //   }
  //   setMembers(members);
  //   console.log(members);
  // };
  // const selectLeaderHandler = leader => {
  //   console.log("Leader", leader);
  //   setLeader(leader);
  // };

  // const teamItems = students.map(student => {
  //   return {
  //     id: student.rollNo,
  //     value: student.rollNo,
  //     text: student.rollNo,
  //   };
  // });

  const submitTitleHandler = async () => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/project/create",
        {
          title: title,
          groupId: groupId,
          description: description,
          type: type,
          dev_tech: tech,
          platform: platform,
        }
      );
      console.log(result.data);
      if (result.data.project) {
        setDisplay(false);
      }
    } catch (error) {
      console.log(error);
      setDisplay(false);
    }
  };

  return (
    <>
      {/* <Box style={Styles.container}> */}
      <Backdrop
        sx={{ color: "#000", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Card style={Styles.card}>
          <Typography
            variant="h5"
            style={{ ...Styles.heading, marginBottom: "1rem" }}
          >
            Project Details
          </Typography>

          <TextField
            style={Styles.input}
            label="Project Title"
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            style={Styles.input}
            label="Project Description"
            multiline
            minRows={5}
            onChange={e => setDescription(e.target.value)}
          />
          <RadioButtonGroup
            label="Project Type"
            defaultValue={type}
            onChange={e => {
              setType(e.target.value);
            }}
            items={typeItems}
          />
          <RadioButtonGroup
            label="Development Technology"
            defaultValue={tech}
            onChange={e => {
              setTech(e.target.value);
            }}
            items={techItems}
          />
          <RadioButtonGroup
            label="Platform"
            defaultValue={platform}
            onChange={e => {
              setPlatform(e.target.value);
            }}
            items={platformItems}
          />
          <Button
            size="large"
            variant="contained"
            disabled={!title || !description}
            onClick={submitTitleHandler}
          >
            Submit
          </Button>
          <Button
            style={{ marginTop: "1rem" }}
            size="large"
            variant="contained"
            color="error"
            onClick={() => {
              setDisplay(false);
            }}
          >
            Cancel
          </Button>
        </Card>
      </Backdrop>

      {/* </Box> */}
    </>
  );
};

export default AddProject;
