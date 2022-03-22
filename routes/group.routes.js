const {
  createGroup,
  getAllGroupsOfADepartment,
} = require("../controllers/group.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/create", verifyToken, createGroup);
Router.get("/get-all", verifyToken, getAllGroupsOfADepartment);

module.exports = Router;
