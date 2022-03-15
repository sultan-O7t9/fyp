import { List, ListItem, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";

const DATA = {
  heads: ["Group ID", "Members", "Project Title", "Supervisor"],
  data: [
    {
      id: "SE_18_1",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
    {
      id: "SE_18_2",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
    {
      id: "SE_18_3",
      members: ["18094198-079", "18094198-089", "18094198-048"],
      title: "Project 1",
      supervisor: "Supervisor 1",
    },
  ],
};

const DataHead = () => {
  return DATA.heads.map((head, index) => (
    <TableCell key={index}>{head}</TableCell>
  ));
};

const DataBody = () => {
  return DATA.data.map((row, index) => (
    <TableRow key={index}>
      <TableCell>{row.id}</TableCell>
      {/* <TableCell>{row.members}</TableCell> */}
      <TableCell>
        <List>
          {row.members.map(member => (
            <ListItem style={{ padding: 0 }} key={member}>
              <Link to="#" style={{ textDecoration: "none" }}>
                {member}
              </Link>
            </ListItem>
          ))}
        </List>
      </TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.supervisor}</TableCell>
    </TableRow>
  ));
};

const AllGroups = () => {
  return (
    <ContainerFluid
      title="Groups"
      appbarActions={[
        {
          name: "Download as excel",
          onClick: async () => {
            try {
              const res = await axios.get(
                "http://localhost:5000/api/auth/test"
              );
              console.log(res.data);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]}
    >
      <Main>
        <DataTable DataHead={DataHead} DataBody={DataBody} />
      </Main>
    </ContainerFluid>
  );
};

export default AllGroups;
