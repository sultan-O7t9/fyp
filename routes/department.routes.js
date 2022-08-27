// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
const Depratment = require("../controllers/department.controller");

const Router = require("express").Router();

Router.get("/get-all", Depratment.getAllDepartments);
Router.post("/create", Depratment.createDepartment);

Router.delete("/delete/:deptId", Depratment.removeDepartment);
Router.post("/update", Depratment.updateDepartment);

module.exports = Router;
