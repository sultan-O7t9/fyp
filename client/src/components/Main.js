import { Card } from "@mui/material";

const Main = props => {
  const { children, styles } = props;
  return <Card style={{ height: "100%", ...styles }}>{children}</Card>;
};

export default Main;
