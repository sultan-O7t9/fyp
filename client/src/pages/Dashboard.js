import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContainerFluid from "../components/ContainerFluid";
import ItemCard from "../components/ItemCard";
import Main from "../components/Main";
import jwt_decode from "jwt-decode";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { first_login, USER_ROLE } from "../utils/keys";

const Deliverables = [
  {
    id: 1,
    title: "Project Proposal",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 2,
    title: "Documentation and 30% Code",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
  {
    id: 3,
    title: "Working System",
    description: "Project Idea & Proposal",
    percentage: "4 out of 10",
  },
];
const Dashboard = () => {
  const [deliverables, setDeliverables] = useState([]);

  // const token = useSelector(state => state.auth.accessToken);
  const [role, setRole] = useState("");
  const history = useHistory();

  const fl = localStorage.getItem(first_login);

  useEffect(() => {
    // console.log(token);
    // const userRole = jwt_decode(token).role;
    if (
      localStorage.getItem(USER_ROLE) &&
      localStorage.getItem(USER_ROLE).includes("STUDENT")
    ) {
      // console.log(userRole);
      history.replace("/register-group");
    }
    if (
      localStorage.getItem(USER_ROLE) &&
      localStorage.getItem(USER_ROLE).includes("STUDENT")
    ) {
      history.replace("/admin/faculty");
    }
    // console.log(userRole);
    // setRole(userRole);
  }, [history]);
  // }, [history, token]);

  useEffect(() => {
    const getDeliverables = async () => {
      const res = await axios.get("/api/deliverable/get-all");
      console.log(res.data);
      setDeliverables(res.data.deliverables);
    };
    getDeliverables();
  }, []);

  if (fl === "true" && localStorage.getItem(USER_ROLE).includes("PMO")) {
    return <Redirect to="/reset-pass" />;
  }

  return (
    <div>
      {/* {!localStorage.getItem(accessToken) ? (
        // <Redirect to="/login" />
      ) : ( */}
      <ContainerFluid title="Dasboard" maxWidth="lg">
        <Main>
          <Box
            sx={{
              padding: "3rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {deliverables.map((deliverable, index) => {
              return (
                <ItemCard
                  key={deliverable.id}
                  index={"Deliverable " + (index + 1)}
                  item={deliverable}
                />
              );
            })}

            {localStorage.getItem(USER_ROLE) &&
            localStorage.getItem(USER_ROLE).includes("PMO") ? (
              <ItemCard
                index={""}
                manual={true}
                item={{ id: 1, title: "Communication", link: "/comm" }}
              />
            ) : null}
            {localStorage.getItem(USER_ROLE) &&
            localStorage.getItem(USER_ROLE).includes("PMO") ? (
              <ItemCard
                index={""}
                manual={true}
                item={{ id: 2, title: "Reports", link: "/rep" }}
              />
            ) : null}
            {localStorage.getItem(USER_ROLE) &&
            localStorage.getItem(USER_ROLE).includes("PMO") ? (
              <ItemCard
                index={""}
                styles={{ visibility: "hidden", cursor: "default" }}
                manual={true}
                item={{ id: 2, title: "", link: "/" }}
              />
            ) : null}
          </Box>
        </Main>
      </ContainerFluid>
      {/* )} */}
    </div>
  );
  // return <Redirect to="/register-group" />;
};

export default Dashboard;
