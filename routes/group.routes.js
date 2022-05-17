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
Router.get("/get-all", verifyToken, Group.getAllGroupsOfADepartment);
Router.get("/get-student-group", verifyToken, Group.getGroupByStudent);
Router.delete("/delete/:id", verifyToken, Group.deleteGroup);
Router.put("/update", verifyToken, Group.editGroup);

module.exports = Router;
