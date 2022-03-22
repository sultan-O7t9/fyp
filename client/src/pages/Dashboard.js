import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";

const Deliverables = [
  {
    id: 1,
    title: "Project Proposal",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 2,
    title: "Project Proposal",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 3,
    title: "Project Proposal",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
];
const Dashboard = () => {
  const token = useSelector(state => state.auth.accessToken);
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = jwt_decode(token).role;
    console.log(userRole);
    setRole(userRole);
  }, [token]);

  return !role.includes("STUDENT") ? (
    <ContainerFluid title="Dasboard">
      <Main>
        <Box sx={{ padding: "3rem" }}>
          {Deliverables.map((deliverable, index) => {
            return (
              <ItemCard
                key={deliverable.id}
                index={"Deliverable " + (index + 1)}
                item={deliverable}
              />
            );
          })}
        </Box>
      </Main>
    </ContainerFluid>
  ) : (
    <Redirect to="/register-group" />
  );
};

export default Dashboard;
