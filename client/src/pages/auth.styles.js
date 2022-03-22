import { BG } from "../utils/Theme";

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: BG,
  },
  card: {
    display: "flex",
    padding: "1.5rem 1rem",
    flexDirection: "column",
    minWidth: "25.5rem",
  },
  heading: { marginBottom: "3.25rem" },
  input: { marginBottom: "1rem" },
};

export default styles;
