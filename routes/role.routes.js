// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
const Role = require("../controllers/role.controller");

const Router = require("express").Router();

Router.get("/get", Role.getAllRoles);
Router.post("/create", Role.createRole);

module.exports = Router;
