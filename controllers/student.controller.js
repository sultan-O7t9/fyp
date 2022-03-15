const jwt = require("jsonwebtoken");
const { FacultyMember, Faculty_Role, Role, Student } = require("../models");
// const Student = require("../models/Student");
// const FacultyMember = require("../models/FacultyMember");
// const Faculty_Role = require("../models/Faculty_Role");
require("dotenv").config();
var crypto = require("crypto");
module.exports.createStudent = async (req, res) => {
  try {
    // const student = await Student.create({
    //   name,
    //   rollNo,
    //   leader: false,
    //   password: crypto.randomBytes(8).toString("hex"),
    // });
    console.log(req.body);
    const students = await Student.bulkCreate(
      req.body.students.map(student => ({
        name: student.name,
        rollNo: student.rollNo,
        leader: false,
        password: crypto.randomBytes(8).toString("hex").slice(0, 8),
      }))
    );
    // const students = await Promise.all(
    //   req.body.students.map(async studentData => {
    //     const student = await Student.create({
    //       name: studentData.name,
    //       rollNo: studentData.rollNo,
    //       leader: false,
    //       password: crypto.randomBytes(8).toString("hex"),
    //     });
    //     return student;
    //   })
    // );
    console.log("DONE");
    res.json({
      message: "Student registered successfully",
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error registering Student",
      error,
    });
  }
};
