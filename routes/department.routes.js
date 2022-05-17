// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
const Depratment = require("../controllers/department.controller");

const Router = require("express").Router();

Router.get("/get-all", Depratment.getAllDepartments);

module.exports = Router;
