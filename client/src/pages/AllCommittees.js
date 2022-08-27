import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

const DataBody = ({ data, editCommittee, setData }) => {
  const deleteCommittee = async id => {
    const response = await axios.delete(
      `http://localhost:5000/api/committee/delete/${id}`
    );
    if (response.data.delete) {
      setData(data => data.filter(committee => committee.id !== id));
    }
  };

  return (
    data &&
    data.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        {/* <TableCell>{row.members}</TableCell> */}
        <TableCell>
          {row.members && row.members.length > 0 ? (
            <List>
              {row.members.map(member => (
                <ListItem style={{ padding: 0 }} key={member.id}>
                  <Typography to="#" style={{ textDecoration: "none" }}>
                    {member.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">None</Typography>
          )}
        </TableCell>
        <TableCell>
          {row.Groups && row.Groups.length > 0 ? (
            <List>
              {row.Groups.map(group => (
                <ListItem style={{ padding: 0 }} key={group.id}>
                  <Link
                    to={"/groups/" + group.id}
                    style={{ textDecoration: "none" }}
                  >
                    {group.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">None</Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {/* <IconButton
            onClick={() => {
              editCommittee(row);
            }}
            color="primary"
            variant="outlined"
          >
            <EditIcon />
          </IconButton> */}

          <IconButton
            onClick={() => {
              deleteCommittee(row.id);
            }}
            color="error"
            variant="outlined"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
        {/* <TableCell>{row.supervisor ? row.supervisor : "None"}</TableCell> */}
      </TableRow>
    ))
  );
};

const AllCommittees = () => {
  const [heads, setHeads] = useState(["Committee ID", "Members", "Groups", ""]);
  const [showAddCommittee, setShowAddCommittee] = useState(false);
  const [body, setBody] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("http://localhost:5000/api/committee/get-all")
      .then(res => {
        console.log(res.data);
        setBody(res.data.committees);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showAddCommittee]);

  // return <ManageCommittee />;

  const addCommitteeHandler = committee => {
    console.log(committee);
    setShowAddCommittee(committee ? committee : true);
  };

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <ContainerFluid>
      {showAddCommittee ? (
        <ManageCommittee
          committee={showAddCommittee}
          setDisplay={setShowAddCommittee}
        />
      ) : null}
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
            <Button
              variant="contained"
              color="primary"
              onClick={addCommitteeHandler}
            >
              Add Committee
            </Button>
          </Box>
        </Box>
        <DataTable
          DataHead={() => <DataHead heads={heads} />}
          DataBody={() => (
            <DataBody
              editCommittee={addCommitteeHandler}
              data={body}
              setData={setBody}
            />
          )}
        />
      </Main>
    </ContainerFluid>
  );
};

export default AllCommittees;
