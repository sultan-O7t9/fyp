import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "../components/Select";
import MainAppbar from "../components/MainAppbar";
import Styles from "./auth.styles";
import axios from "axios";
import RadioButtonGroup from "../components/RadioButtonGroup";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/auth";
import { refreshToken, USER_ID } from "../utils/keys";

const SubmitProjectTitle = () => {
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
  const dispatch = useDispatch();
  // const params=useParams();
  const groupId = localStorage.getItem(USER_ID);
  if (!groupId) history.replace("/group");
  // useEffect(() => {
  //   axios
  //     .get( "/api/group/get-student-group")
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
      const result = await axios.post("/api/project/create", {
        title: title,
        groupId: groupId,
        description: description,
        type: type,
        dev_tech: tech,
        platform: platform,
      });
      console.log(result.data);
      if (result.data.project) {
        history.replace("/main/student");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutHandler = async () => {
    try {
      const response = await axios.post("/api/auth/logout", {
        token: localStorage.getItem(refreshToken),
      });
      if (response.data.logout) {
        dispatch(logoutUser());
        history.replace("/group");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MainAppbar />
      <Box style={Styles.container}>
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
        </Card>
      </Box>
    </>
  );
};

export default SubmitProjectTitle;
