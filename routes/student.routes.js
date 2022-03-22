const {
  createStudent,
  getStudents,
  getAllStudents,
} = require("../controllers/student.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();
Router.get("/get-students", verifyToken, getStudents);
Router.get("/get-all", verifyToken, getAllStudents);
Router.post("/create-all", verifyToken, createStudent);

module.exports = Router;
