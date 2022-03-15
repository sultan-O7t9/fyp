import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";
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
  return (
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
  );
};

export default Dashboard;
