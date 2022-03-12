import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";

const Dashboard = () => {
  return (
    <ContainerFluid title="Dasboard">
      <Main>
        <Box sx={{ padding: "3rem" }}>
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </Box>
      </Main>
    </ContainerFluid>
  );
};

export default Dashboard;
