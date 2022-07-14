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
Router.post("/create", verifyToken, Group.createGroup);
// Router.get("/get/dept", verifyToken, Group.getGroupsByDepartment);
Router.get("/get/dept", Group.getGroupsByDepartment);
Router.get("/get-all", verifyToken, Group.getAllGroupsByFacultyDepartment);
Router.get("/get-student-group", verifyToken, Group.getGroupByStudent);
Router.delete("/delete/:id", verifyToken, Group.deleteGroup);
Router.put("/update", verifyToken, Group.editGroup);

module.exports = Router;
