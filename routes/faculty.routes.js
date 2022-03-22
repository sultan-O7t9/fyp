const {
  getAllSupervisors,
  registerFaculty,
} = require("../controllers/faculty.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.get("/get-supervisors", getAllSupervisors);
Router.post("/register", registerFaculty);

module.exports = Router;
