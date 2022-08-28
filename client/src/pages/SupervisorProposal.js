import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  Switch,
  TableCell,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { Box } from "@mui/system";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import RadioButtonGroup from "../components/RadioButtonGroup";
import UploadFile from "../components/UploadFile";

const DataHead = () => null;

const DataBody = props => {
  const { deliverableId, groupId, projectTitle } = props;
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();
  const [modal, setModal] = useState(false);

  const [submissionData, setSubmissionData] = useState({});

  const [gridData, setGridData] = useState([]);
  const [gridCols, setGridCols] = useState([]);
  const [latestSub, setLatestSub] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState({});
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const deliverableRes = await axios.post(
          "http://localhost:5000/api/deliverable/get-grp-submission",
          {
            deliverableId: deliverableId,
            groupId: groupId,
          }
        );
        console.log(deliverableRes.data.versions);

        if (deliverableRes.data.get) {
          setSubmissionData(deliverableRes.data.versions.reverse());
          const latest = deliverableRes.data.versions.reverse()[0];
          console.log(latest);
          setLatestSub(latest);
          // setStatus(latest.status);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [deliverableId, groupId, showUploadModal, status]);

  useEffect(() => {
    setComment(latestSub.comment);
  }, [latestSub]);

  useEffect(() => {
    const data = [];
    const dataSource = submissionData.length
      ? submissionData.map(item => {
          return {
            ...item,
            actions: (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  size="small"
                  onClick={() => {}}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
              </div>
            ),
          };
        })
      : [];
    const columns = [
      // {
      //   name: "id",
      //   header: "ID",
      //   defaultVisible: false,
      // },
      {
        name: "name",
        header: "File",
        defaultFlex: 2,
        render: ({ value }) => {
          return (
            <Button
              onClick={() => {
                let url = "http://localhost:5000/" + value;
                let win = window.open(url, "_blank");
                win.focus();
              }}
            >
              {value}
            </Button>
          );
        },
      },
      {
        name: "status",
        header: "Endorsement",
        defaultFlex: 1,
        render: ({ value }) => {
          const color =
            value == "Approved"
              ? "green"
              : value == "Pending"
              ? "orange"
              : "red";
          return (
            <div
              style={{
                color: color,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: "comment",
        header: "Comment",
        defaultFlex: 2,
        render: ({ value }) => (value ? value : "None"),
      },
      {
        name: "commented_doc",
        header: "Commented Document",
        defaultFlex: 2,
        render: ({ value }) => {
          return value ? (
            <Button
              onClick={() => {
                let url = "http://localhost:5000/" + value;
                let win = window.open(url, "_blank");
                win.focus();
              }}
            >
              {value}
            </Button>
          ) : (
            "None"
          );
        },
      },
      // {
      //   name: "actions",
      //   defaultFlex: 1,
      //   header: "Actions",
      // },
    ];
    setGridCols(columns);
    setGridData(dataSource);
  }, [deliverableId, groupId, submissionData]);

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("versionId", latestSub.id);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/sup-add-doc",
        data
      );
      console.log("file:", res.data);
      if (res.data.upload) setShowUploadModal(false);
      setFile({ name: "" });
      // setName(res.data.file);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComment = async () => {
    console.log(comment);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/sup-add-comment",
        {
          versionId: latestSub.id,
          comment: comment,
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateStatus = async (id, status) => {
    const data = {
      versionId: id,
      status: status,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/deliverable/sup-change-status",
        data
      );
      console.log(response.data);
      if (response.data.version) setStatus(status);
      // setTMsg(
      //   "Booklet Status changed to " + response.data.group.bookletsStatus
      // );
      // setToast(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}
      <TableRow>
        <TableCell>
          <Typography variant="h6">Project</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body1">{projectTitle}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Submission File</Typography>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => {
              let url = "http://localhost:5000/" + latestSub.name;
              let win = window.open(url, "_blank");
              win.focus();
            }}
          >
            {latestSub.name}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Endorsement</Typography>
        </TableCell>
        <TableCell>
          <RadioButtonGroup
            label=""
            // defaultValue={}
            value={latestSub.status}
            // defaultValue={latestSub.status}
            onChange={e => {
              handleUpdateStatus(latestSub.id, e.target.value);

              console.log(e.target.value);
            }}
            items={[
              { label: "Approved", value: "Approved" },
              { label: "Pending", value: "Pending" },
              { label: "Revised", value: "Revised" },
            ]}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Comment</Typography>
        </TableCell>
        <TableCell>
          <Box>
            <TextareaAutosize
              minRows={4}
              // placeholder="Maximum 4 rows"
              // defaultValue={latestSub.comment}
              value={comment}
              onChange={e => {
                setComment(e.target.value);
              }}
              style={{ width: "100%" }}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Add Comment
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Commented Document</Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
              padding: "0 2rem",
              maxWidth: "600px",
            }}
          >
            <Box>
              {latestSub.commented_doc ? (
                <Button
                  onClick={() => {
                    let url =
                      "http://localhost:5000/" + latestSub.commented_doc;
                    let win = window.open(url, "_blank");
                    win.focus();
                  }}
                >
                  {latestSub.commented_doc}
                </Button>
              ) : (
                <Typography variant="body1">None</Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setShowUploadModal(true);
              }}
            >
              Upload
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell>
          
        </TableCell>
      </TableRow> */}
      {/* <TableRow>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("changes saved");
            }}
          >
            Save Changes
          </Button>
        </TableCell>
      </TableRow> */}
      <TableRow>
        <TableCell colSpan={2}>
          <Typography variant="h6">Version History</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <ReactDataGrid
            idProperty="id"
            columns={gridCols}
            // selected={selectedGroups}
            // checkboxColumn
            // onSelectionChange={onSelectionChange}
            dataSource={gridData}
            rowHeight={100}
            style={{
              height: "calc(100vh - 230px)",
            }}
          />
        </TableCell>
        {/* <TableCell colSpan={2}>
          {submissionData.length > 0 ? (
            <ul>
              {submissionData.map((submission, index) => (
                <li key={index}>
                  <form
                    onSubmit={e => {
                      downloadVersionFile(e, submission.name);
                    }}
                    className="form"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button variant="text" type="submit">
                        {submission.name}
                      </Button>
                      <IconButton
                        onClick={() => {
                          console.log("deleting " + submission.name);
                          deleteVersion(submission.name);
                        }}
                        color="error"
                        variant="outlined"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body">No submissions</Typography>
          )}
          
        </TableCell> */}
      </TableRow>
    </>
  );
};

const SupervisorProposal = () => {
  const params = useParams();
  const history = useHistory();
  const { deliverableId, groupId } = history.location.state;
  const [groupInfo, setGroupInfo] = useState({});

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/group/get/${groupId}`
        );
        setGroupInfo(res.data.group);
      } catch (err) {
        console.log(err);
      }
    };
    getGroupData();
  }, [deliverableId, groupId]);

  return (
    <ContainerFluid title={"Deliverable " + deliverableId}>
      <Main styles={{ padding: "1.5rem" }}>
        <Box
          sx={{ marginBottom: "3rem" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h3">{groupInfo.name}</Typography>
          </Box>
          {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
        </Box>

        <DataTable
          DataHead={DataHead}
          DataBody={() => (
            <DataBody
              deliverableId={deliverableId}
              groupId={groupId}
              projectTitle={
                groupInfo && groupInfo.project && groupInfo.project.title
                  ? groupInfo.project.title
                  : "None"
              }
            />
          )}
        />
      </Main>
    </ContainerFluid>
  );
};

export default SupervisorProposal;
