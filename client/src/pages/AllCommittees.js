import {
  Backdrop,
  Button,
  CircularProgress,
  List,
  ListItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import ExportAsExcel from "../components/ExportAsExcel";
import Link from "../components/Link";
import Main from "../components/Main";
import ManageCommittee from "./ManageCommittee";

const DATA = {
  heads: ["Committee ID", "Members", "Groups"],
  data: [
    {
      id: "SE_18_1",
      members: ["Gulsher Ali", "Adeel Ahmed"],
      groups: ["SE_18_18", "SE_18_19"],
    },
    {
      id: "SE_18_2",
      members: ["Gulsher Ali", "Adeel Ahmed"],
      groups: ["SE_18_18", "SE_18_19"],
    },
    {
      id: "SE_18_3",
      members: ["Gulsher Ali", "Adeel Ahmed"],
      groups: ["SE_18_18", "SE_18_19"],
    },
  ],
};

const DataHead = ({ heads }) => {
  return (
    heads &&
    heads.map((head, index) => <TableCell key={index}>{head}</TableCell>)
  );
};

const DataBody = ({ data }) => {
  return (
    data &&
    data.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        {/* <TableCell>{row.members}</TableCell> */}
        <TableCell>
          {row.members && row.members.length > 0 ? (
            <List>
              {row.members.map(member => (
                <ListItem
                  style={{ padding: 0 }}
                  key={member + new Date().getTime()}
                >
                  <Link to="#" style={{ textDecoration: "none" }}>
                    {member}
                  </Link>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">None</Typography>
          )}
        </TableCell>
        <TableCell>
          {row.groups && row.groups.length > 0 ? (
            <List>
              {row.groups.map(group => (
                <ListItem
                  style={{ padding: 0 }}
                  key={group + new Date().getTime()}
                >
                  <Link to="#" style={{ textDecoration: "none" }}>
                    {group}
                  </Link>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">None</Typography>
          )}
        </TableCell>
        <TableCell>
          <Button variant="contained" color="primary" size="small">
            Edit
          </Button>
        </TableCell>
        {/* <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell> */}
      </TableRow>
    ))
  );
};

const AllCommittees = () => {
  const [heads, setHeads] = useState(["Committee ID", "Members", "Groups", ""]);
  //   const [body, setBody] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     setIsLoading(true);

  //     axios
  //       .get("http://localhost:5000/api/group/get-all")
  //       .then(res => {
  //         setBody(res.data.groups);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }, []);

  return <ManageCommittee />;

  return (
    <ContainerFluid>
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">Committees</Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary">
              Add Committee
            </Button>
          </Box>
        </Box>
        <DataTable
          DataHead={() => <DataHead heads={heads} />}
          DataBody={() => <DataBody data={DATA.data} />}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AllCommittees;
