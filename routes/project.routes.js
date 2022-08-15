// const { createProject } = require("../controllers/project.controller");
const verifyToken = require("../utils/verifyToken");
const Project = require("../controllers/project.controller");
const Router = require("express").Router();

Router.post("/create", Project.createProject);
Router.get("/get-grp/:id", Project.getProjectByGroup);
// Router.post("grp", Project.getProjectByGroup);
// Router.post("/")
module.exports = Router;
