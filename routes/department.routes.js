const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.get("/get-all", getAllDepartments);

module.exports = Router;
