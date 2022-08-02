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

Router.post("/create", verifyToken, Group.createGroup);
// Router.get("/get/dept", verifyToken, Group.getGroupsByDepartment);
Router.get("/get/dept", Group.getGroupsByDepartment);

Router.get("/get-groups", Group.getAllGroups);
Router.get("/get-all", Group.getAllGroupsByFacultyDepartment);
Router.get("/get-student-group", verifyToken, Group.getGroupByStudent);
Router.delete("/delete/:id", verifyToken, Group.deleteGroup);
Router.put("/update", verifyToken, Group.editGroup);
Router.post("/upload-file", upload.single("file"), Group.uploadFile);
Router.post("/download-file", Group.downloadFile);

module.exports = Router;
