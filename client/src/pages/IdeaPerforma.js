import React from "react";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Input from "@material-tailwind/react/Input";
import Textarea from "@material-tailwind/react/Textarea";
import FormPage from "../layouts/FormPage";
import Select from "../components/UI/Form/Select";
import { useState } from "react";

const SUPERVISORS = [
  { id: 1, name: "Muhammad Ejaz" },
  { id: 2, name: "Kamran Shaukat" },
  { id: 3, name: "Gulsher Ali" },
  { id: 4, name: "Muhammad Ikram ul Haq" },
];

const STUDENTS = [
  { rollNo: "18094198-048", name: "Ranya Muqadas" },
  { rollNo: "18094198-075", name: "Fiza Ansar" },
  { rollNo: "18094198-077", name: "Ammad Bajwa" },
  { rollNo: "18094198-079", name: "Sultan Muhammad" },
  { rollNo: "18094198-082", name: "Umer Naqeeb" },
  { rollNo: "18094198-089", name: "Ali Ikram" },
  { rollNo: "18094198-096", name: "Afham Hanif" },
  { rollNo: "18094198-118", name: "Muneeb Arfan" },
];

export default function IdeaPerforma() {
  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState({});
  const [supervisor, setSupervisor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const selectMembersHandler = event => {
    setMembers(event.target.value);
  };
  const selectLeaderHandler = event => {
    setLeader(event.target.value);
  };
  const selectSupervisorHandler = event => {
    setSupervisor(event.target.value);
  };

  const selectTeamOptions = STUDENTS.map(student => {
    return {
      id: student.rollNo,
      value: student,
      label: student.name.split(" ")[0] + " - " + student.rollNo.split("-")[1],
    };
  });

  const submitIdeaHandler = event => {
    event.preventDefault();
    const data = {
      members: members,
      leader: leader.rollNo,
      supervisor: supervisor.name,
      title: title,
      description: description,
    };
    console.log(data);
    setMembers([]);
    setLeader({});
    setSupervisor("");
    setTitle("");
    setDescription("");
  };

  return (
    <FormPage>
      <Card>
        <CardHeader color="purple" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">FYP Project Titles</h2>
            {/* <Button
              color="transparent"
              buttonType="link"
              size="lg"
              style={{ padding: 0 }}
            >
              Settings
            </Button> */}
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={submitIdeaHandler}>
            <h6 className="text-purple-500 text-sm mt-3 mb-6 font-light uppercase">
              Team Members
            </h6>
            <div className="w-full flex flex-col ">
              <Select
                required
                multiple={true}
                label="Team"
                onSelect={selectMembersHandler}
                options={selectTeamOptions}
              />
              <div className="w-full py-3"></div>
              <Select
                required
                disabled={members.length === 0}
                label="Leader"
                onSelect={selectLeaderHandler}
                options={members.map(member => ({
                  id: member.rollNo,
                  value: member,
                  label:
                    member.name.split(" ")[0] +
                    " - " +
                    member.rollNo.split("-")[1],
                }))}
              />
              <div className="w-full py-3"></div>
              <Select
                required
                label="Supervisor"
                onSelect={selectSupervisorHandler}
                options={SUPERVISORS.map(supervisor => ({
                  id: supervisor.id,
                  value: supervisor,
                  label: supervisor.name,
                }))}
              />
            </div>
            <h6 className="text-purple-500 text-sm my-6 font-light uppercase">
              Project Details
            </h6>
            <div className="flex flex-wrap mt-10">
              <div className="w-full lg:w-12/12 mb-10 font-light">
                <Input
                  type="text"
                  required
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  color="purple"
                  placeholder="Title"
                />
              </div>
              <div className="w-full lg:w-4/12 pr-4 mb-10 font-light">
                <Textarea
                  color="purple"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  minLength="20"
                  required
                  placeholder="Project Description"
                />
              </div>
            </div>
            <Button
              color="lightBlue"
              buttonType="filled"
              size="lg"
              rounded={false}
              block={true}
              iconOnly={false}
              ripple="light"
              type={"submit"}
            >
              <Icon name="save" size="sm" /> Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </FormPage>
  );
}
