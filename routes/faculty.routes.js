// const {
//   getAllSupervisors,
//   registerFaculty,
// } = require("../controllers/faculty.controller");
const Faculty = require("../controllers/faculty.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.get("/get-supervisors", Faculty.getAllSupervisors);
Router.post("/register", Faculty.registerFaculty);

module.exports = Router;
