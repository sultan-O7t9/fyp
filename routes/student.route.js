const { createStudent } = require("../controllers/student.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/create", verifyToken, createStudent);

module.exports = Router;
