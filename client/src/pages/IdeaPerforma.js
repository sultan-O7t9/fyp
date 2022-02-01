import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { BackDrop, LoadingSpinner, Modal, Select } from "../components/UI";
import { FormPageLayout } from "../layouts";
import { createGroup } from "../store/actions/students";

const SUPERVISORS = [
  { id: 1, name: "Muhammad Ejaz" },
  { id: 2, name: "Kamran Shaukat" },
  { id: 3, name: "Gulsher Ali" },
  { id: 4, name: "Muhammad Ikram ul Haq" },
];

const IdeaPerforma = () => {
  const students = useSelector(state => state.students.students);
  const dispatch = useDispatch();

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [members, setMembers] = useState([]);
  const [leader, setLeader] = useState({});
  const [supervisor, setSupervisor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const selectMembersHandler = event => {
    console.log("Members", event.target.value);
    setMembers(event.target.value);
  };
  const selectLeaderHandler = event => {
    console.log("Leader", event.target.value);
    setLeader(event.target.value);
  };
  const selectSupervisorHandler = event => {
    console.log("Supervisor", event.target.value);
    setSupervisor(event.target.value);
  };

  const submitIdeaHandler = event => {
    event.preventDefault();
    console.log(students);
    setIsLoading(true);
    const data = {
      leader: leader,
      members: members,
      supervisor: supervisor,
      projectTitle: title,
      description: description,
    };
    console.log(data);
    dispatch(createGroup(data));
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const teamOptions = students.map(student => {
    return {
      id: student.rollNo,
      disabled: !!student.groupId,
      value: student.rollNo,
      label: student.rollNo + " (" + student.name.split(" ")[0] + ")",
    };
  });

  return (
    <FormPageLayout>
      <Card>
        <CardHeader color="purple" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">FYP Project Titles</h2>
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
                disabled={students.length === 0}
                multiple={true}
                label="Team"
                onSelect={selectMembersHandler}
                options={teamOptions}
              />
              <div className="w-full py-3"></div>
              <Select
                required
                disabled={members.length === 0}
                label="Leader"
                onSelect={selectLeaderHandler}
                options={members.map(member => {
                  return {
                    id: member,
                    value: member,
                    label:
                      students.find(student => student.rollNo === member)
                        .rollNo +
                      " (" +
                      students
                        .find(student => student.rollNo === member)
                        .name.split(" ")[0] +
                      ")",
                  };
                })}
              />
              <div className="w-full py-3"></div>
              <Select
                required
                label="Supervisor"
                disabled={members.length === 0}
                onSelect={selectSupervisorHandler}
                options={SUPERVISORS.map(supervisor => ({
                  id: supervisor.id,
                  value: supervisor.name,
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
                  color="lightBlue"
                  placeholder="Title"
                />
              </div>
              <div className="w-full lg:w-4/12 pr-4 mb-10 font-light">
                <Textarea
                  color="lightBlue"
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
            <BackDrop open={isLoading || showModal} onClick={() => {}}>
              {isLoading && <LoadingSpinner />}
              <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                title={"Group has been created"}
                actions={[
                  {
                    label: "OK",
                    color: "red",
                    onClick: () => {
                      setShowModal(false);
                      history.push("/dashboard/groups");
                    },
                  },
                ]}
              >
                <p color="blueGray">The Group has been created successfully.</p>
                <p>Check your e-mail for new account credentials.</p>
              </Modal>
            </BackDrop>
          </form>
        </CardBody>
      </Card>
    </FormPageLayout>
  );
};

export default IdeaPerforma;
