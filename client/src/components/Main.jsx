import { Card } from "@mui/material";

const Main = props => {
  const { children } = props;
  return <Card style={{ height: "100%" }}>{children}</Card>;
};

export default Main;
