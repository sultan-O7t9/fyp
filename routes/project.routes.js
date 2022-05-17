// const { createProject } = require("../controllers/project.controller");
const verifyToken = require("../utils/verifyToken");
const Project = require("../controllers/project.controller");
const Router = require("express").Router();

Router.post("/create", verifyToken, Project.createProject);

module.exports = Router;
