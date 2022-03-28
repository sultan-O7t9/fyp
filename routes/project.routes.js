const { createProject } = require("../controllers/project.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/create", verifyToken, createProject);

module.exports = Router;
