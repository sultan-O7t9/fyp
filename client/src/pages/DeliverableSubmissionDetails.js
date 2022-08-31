import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  Switch,
  Table,
  TableCell,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerFluid from "../components/ContainerFluid";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Main from "../components/Main";
import MenuButton from "../components/MenuButton";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import UploadFile from "../components/UploadFile";
import Toast from "../components/Toast";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
// import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const DataHead = () => null;

const DataBody = ({ versionData }) => {
  const role = localStorage.getItem("USER_ROLE");
  const history = useHistory();

  const [deliverableData, setDeliverableData] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState({ name: "" });
  const [submissionData, setSubmissionData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [gridData, setGridData] = useState([]);
  const [gridCols, setGridCols] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [extensionData, setExtensionData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const deliverableRes = await axios.post(
          "http://localhost:5000/api/deliverable/get-grp-submission",
          {
            deliverableId: 1,
            groupId: localStorage.getItem("USER_ID"),
          }
        );
        console.log(deliverableRes.data.versions);
        if (deliverableRes.data.get)
          setSubmissionData(deliverableRes.data.versions.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [showUploadModal, showToast]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/deliverable/get/1"
        );
        console.log(res.data.deliverable);
        setDeliverableData(res.data.deliverable);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [showUploadModal]);

  useEffect(() => {
    const getExtensionInfo = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/deliverable/ex-get-grp",
          {
            deliverableId: 1,
            groupId: localStorage.getItem("USER_ID"),
          }
        );
        let ex = {};
        console.log(res.data);
        if (res.data.hasOwnProperty("extension")) ex = res.data.extension;
        setExtensionData(ex);
        console.log(ex);
      } catch (err) {
        console.log(err);
      }
    };
    getExtensionInfo();
  }, []);

  const downloadTemplateFile = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/get-template-file",
        { deliverableId: 1 }
      );
      console.log(res.data);
      let url = "http://localhost:5000/" + res.data.file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

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
                  justifyContent: "center",
                }}
              >
                {item.status == "Pending" ? (
                  <Button
                    style={{ marginRight: "1rem" }}
                    size="small"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setToDelete(item);
                    }}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                ) : null}
                <Button size="small" onClick={() => {}} variant="outlined">
                  Show Details
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
        header: "Supervisor Review",
        defaultFlex: 2,
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
        name: "eval_status",
        header: "Evaluation Status",
        defaultFlex: 2,
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
      // {
      //   name: "commented_doc",
      //   header: "Commented Doc By Supervisor",
      //   defaultFlex: 3,
      //   render: ({ value }) => {
      //     return value ? (
      //       <Button
      //         onClick={() => {
      //           let url = "http://localhost:5000/" + value;
      //           let win = window.open(url, "_blank");
      //           win.focus();
      //         }}
      //       >
      //         {value}
      //       </Button>
      //     ) : (
      //       "None"
      //     );
      //   },
      // },
      {
        name: "actions",
        defaultFlex: 2,
        header: "Actions",
      },
    ];
    setGridCols(columns);
    setGridData(dataSource);
  }, [history, submissionData]);

  const submitProposal = () => {
    console.log("Uploading template file");
    setShowUploadModal(true);
  };

  const handleSubmitFile = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("deliverableId", 1);
    data.append("groupId", localStorage.getItem("USER_ID"));
    data.append("projectId", localStorage.getItem("PROJECT_ID"));
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/deliverable/submit-grp-submission",
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

  const downloadVersionFile = async (e, file) => {
    e.preventDefault();
    try {
      let url = "http://localhost:5000/" + file;
      console.log(url);
      let win = window.open(url, "_blank");
      win.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteVersion = async file => {
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/deliverable/del-grp-submission/" + file
      );
      if (res.data.delete) {
        setShowToast(true);
        setToastMessage(file + " deleted successfully");
      }
      setShowDeleteModal(false);
    } catch (err) {
      console.log(err);
      setShowToast(true);
      setToastMessage("Error deleting " + file);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {showDeleteModal ? (
        <DeleteConfirmationDialog
          itemType="Group"
          item={toDelete.id}
          handleDelete={() => {
            deleteVersion(toDelete.name);
          }}
          setOpen={setShowDeleteModal}
        />
      ) : null}
      {showToast ? (
        <Toast open={showToast} setOpen={setShowToast} message={toastMessage} />
      ) : null}
      {showUploadModal ? (
        <UploadFile
          setFile={setFile}
          file={file}
          handleSubmitFile={handleSubmitFile}
          setDisplay={setShowUploadModal}
        />
      ) : null}

      <TableRow>
        <TableCell colSpan={2}>
          {/* <Typography variant="h4">{deliverableData.title}</Typography> */}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Deadline</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">
            {deliverableData.deadline
              ? extensionData.hasOwnProperty("days")
                ? new Date(
                    new Date(deliverableData.deadline).getTime() +
                      extensionData.days * 86400000
                  ).toUTCString()
                : new Date(deliverableData.deadline).toDateString()
              : "None"}
          </Typography>
        </TableCell>
      </TableRow>

      {deliverableData.template && deliverableData.deadline ? (
        <TableRow>
          <TableCell>
            <Typography variant="h6">Submission File</Typography>
          </TableCell>
          <TableCell>
            <form
              onSubmit={e => {
                downloadVersionFile(e, versionData.name);
              }}
              className="form"
            >
              <Button variant="text" type="submit">
                {versionData.name}
              </Button>
            </form>
          </TableCell>
        </TableRow>
      ) : null}
      <TableRow>
        <TableCell>
          <Typography variant="h6">Supervisor Endorsement</Typography>
        </TableCell>

        <TableCell>
          {versionData.status ? (
            versionData.status == "Approved" ? (
              <Typography
                variant="body"
                style={{
                  color: "green",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Approved
              </Typography>
            ) : versionData.status == "Revised" ? (
              <Typography
                variant="body"
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Revised
              </Typography>
            ) : (
              <Typography
                variant="body"
                style={{
                  color: "orange",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Pending
              </Typography>
            )
          ) : (
            <Typography
              variant="body"
              style={{
                color: "orange",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Pending
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {deliverableData.template && deliverableData.deadline ? (
        <TableRow>
          <TableCell>
            <Typography variant="h6">
              Commented Document by Supervisor
            </Typography>
          </TableCell>
          <TableCell>
            {versionData.commented_doc ? (
              <form
                onSubmit={e => {
                  downloadVersionFile(e, versionData.name);
                }}
                className="form"
              >
                <Button variant="text" type="submit">
                  {versionData.commented_doc}
                </Button>
              </form>
            ) : (
              <Typography variant="body">None</Typography>
            )}
          </TableCell>
        </TableRow>
      ) : null}
      <TableRow>
        <TableCell>
          <Typography variant="h6">Evaluation Status</Typography>
        </TableCell>

        <TableCell>
          {versionData.eval_status ? (
            versionData.eval_status == "Approved" ? (
              <Typography
                variant="body"
                style={{
                  color: "green",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Approved
              </Typography>
            ) : versionData.eval_status == "Revised" ? (
              <Typography
                variant="body"
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Revised
              </Typography>
            ) : (
              <Typography
                variant="body"
                style={{
                  color: "orange",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Pending
              </Typography>
            )
          ) : (
            <Typography
              variant="body"
              style={{
                color: "orange",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Pending
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {deliverableData.template && deliverableData.deadline ? (
        <TableRow>
          <TableCell>
            <Typography variant="h6">
              Commented Document by Evaluator
            </Typography>
          </TableCell>
          <TableCell>
            {versionData.eval_commented_doc ? (
              <form
                onSubmit={e => {
                  downloadVersionFile(e, versionData.name);
                }}
                className="form"
              >
                <Button variant="text" type="submit">
                  {versionData.commented_doc}
                </Button>
              </form>
            ) : (
              <Typography variant="body">None</Typography>
            )}
          </TableCell>
        </TableRow>
      ) : null}

      {/* <TableRow>
        <TableCell>
          <Typography variant="h6">Commented Document by Committee</Typography>
        </TableCell>
        <TableCell>
          {submissionData.length > 0 && versionData.eval_commented_doc ? (
            <Button
              onClick={() => {
                const win = window.open(
                  "http://localhost:5000/" +
                    submissionData[0].eval_commented_doc,
                  "_blank"
                );
                win.focus();
              }}
            >
              {submissionData[0].eval_commented_doc}
            </Button>
          ) : (
            <Typography variant="body">No Commented Document</Typography>
          )}
        </TableCell>
      </TableRow> */}
    </>
  );
};

const DeliverableSubmissionDetail = props => {
  const { deliverableId, data, setDisplay } = props;
  console.log(data);

  const groupName = localStorage.getItem("GROUP_NAME");
  return (
    <Backdrop
      sx={{
        color: "#000",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Container
        // title={groupName}
        maxWidth="lg"
        style={{ maxHeight: "95vh", overflowY: "auto" }}
      >
        <Main styles={{ padding: "1.5rem" }}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              onClick={() => {
                setDisplay(false);
              }}
            >
              <CancelIcon style={{ color: "red" }} fontSize="large" />
            </IconButton>
          </Box>
          <Box
            sx={{ marginBottom: "3rem" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* <Box>
            <Typography variant="h3">SE_18_1 Proposal</Typography>
          </Box> */}
            {/* <Box>
            <Button variant="contained" color="primary">
              Settings
            </Button>
          </Box> */}
          </Box>

          <DataTable
            DataHead={DataHead}
            DataBody={() => <DataBody versionData={data} />}
          />
        </Main>
      </Container>
    </Backdrop>
  );
};

export default DeliverableSubmissionDetail;
