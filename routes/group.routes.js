const {
  createGroup,
  getAllGroupsOfADepartment,
  deleteGroup,
  editGroup,
  getGroupByStudent,
} = require("../controllers/group.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/create", verifyToken, createGroup);
Router.get("/get-all", verifyToken, getAllGroupsOfADepartment);
Router.get("/get-student-group", verifyToken, getGroupByStudent);
Router.delete("/delete/:id", verifyToken, deleteGroup);
Router.put("/update", verifyToken, editGroup);

module.exports = Router;
