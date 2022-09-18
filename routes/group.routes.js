// const {
//   createGroup,
//   getAllGroupsOfADepartment,
//   deleteGroup,
//   editGroup,
//   getGroupByStudent,
// } = require("../controllers/group.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();
const Group = require("../controllers/group.controller");
const multer = require("multer");
const upload = multer();

// Router.post("/assign-sup", verifyToken, Group.assignSupervisorToGroups);
Router.post("/create", verifyToken, Group.createGroup);
Router.post("/create-many", verifyToken, Group.createManyGroups);
// Router.get("/get/dept", verifyToken, Group.getGroupsByDepartment);
Router.get("/get/dept", Group.getGroupsByDepartment);
Router.post("/change/password", Group.changePassword);

Router.get("/get-groups", Group.getAllGroups);
Router.post("/get-groups-sup", Group.getAllGroupsBySup);
Router.get("/get/:id", Group.getGroupById);
Router.get("/get-all/:id", Group.getAllGroupsByFacultyDepartment);
Router.get("/get-student-group", verifyToken, Group.getGroupByStudent);
Router.delete("/delete/:id", verifyToken, Group.deleteGroup);
Router.put("/update", verifyToken, Group.editGroup);
Router.post("/upload-file", upload.single("file"), Group.uploadFile);
Router.post("/download-file", Group.downloadFile);
Router.post("/submit-proposal", Group.submitProposal);
Router.post("/change-booklet-status", Group.changeBookletStatus);
Router.post("/change-booklet-comment", Group.changeBookletComment);

module.exports = Router;
