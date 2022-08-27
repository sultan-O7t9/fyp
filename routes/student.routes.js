// const {
//   createStudent,
//   getStudents,
//   getAllStudents,
// } = require("../controllers/student.controller");
const verifyToken = require("../utils/verifyToken");
const Student = require("../controllers/student.controller");
const Router = require("express").Router();
Router.get("/get-students", verifyToken, Student.getStudents);
Router.post(
  "/get-students-by-student",
  verifyToken,
  Student.getStudentsByStudent
);
Router.get("/get-all", verifyToken, Student.getAllStudents);
Router.post("/create-all", verifyToken, Student.createStudent);
Router.delete("/delete/:id", verifyToken, Student.deleteStudent);
module.exports = Router;
