// const {
//   getAllSupervisors,
//   registerFaculty,
// } = require("../controllers/faculty.controller");
const Faculty = require("../controllers/faculty.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.get("/get-supervisors", Faculty.getAllSupervisors);
Router.get("/get-supervisors-only", Faculty.getAllSupervisorsOnly);
Router.get("/get-supervisor-all", Faculty.getAllSupervisorsList);

Router.post("/register", Faculty.registerFaculty);
Router.patch("/update", Faculty.updateFaculty);
Router.patch("/pmo/assign", Faculty.assignPMO);
Router.patch("/pmo/remove", Faculty.removePMO);
Router.delete("/delete/:id", Faculty.removeFaculty);

module.exports = Router;
