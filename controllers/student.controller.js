const jwt = require("jsonwebtoken");
const {
  FacultyMember,
  Faculty_Role,
  Role,
  Student,
  Department,
  Group,
  sequelize,
} = require("../models");
const { sendMail } = require("../utils/sendMails");
const Sequelize = require("sequelize");

// const Student = require("../models/Student");
// const FacultyMember = require("../models/FacultyMember");
// const Faculty_Role = require("../models/Faculty_Role");
require("dotenv").config();
var crypto = require("crypto");

module.exports.getStudents = async (req, res) => {
  const userId = req.user.id;
  console.log(req.user);
  try {
    const user = await Student.findOne({
      where: {
        rollNo: userId,
      },
    });
    const students = await Student.findAll({
      where: {
        departmentId: user.dataValues.departmentId,
        groupId: null,
      },
      attributes: ["name", "rollNo"],
    });
    res.json({
      message: "Students retrieved successfully",
      students,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error getting students",
      error: err,
    });
  }
};

module.exports.getAllStudents = async (req, res) => {
  const userId = req.user.id;
  console.log(req.user);
  try {
    const user = await FacultyMember.findOne({
      where: {
        id: userId,
      },
    });
    console.log(user.dataValues.departmentId);
    const students = await Student.findAll({
      where: {
        departmentId: user.dataValues.departmentId,
      },
      attributes: ["name", "rollNo", "groupId"],
    });
    console.log(students);
    const studentsWithGroups = students.filter(
      student => student.dataValues.groupId != null
    );
    const groups = await Group.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: studentsWithGroups.map(
            student => student.dataValues.groupId
          ),
        },
      },
      attributes: ["id", "name"],
    });
    res.json({
      message: "Students retrieved successfully",
      students: students.map(student => {
        return {
          ...student.dataValues,
          group: student.dataValues.groupId
            ? groups.find(
                group => group.dataValues.id === student.dataValues.groupId
              ).dataValues.name
            : null,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error getting students",
      error: err,
    });
  }
};

module.exports.createStudent = async (req, res) => {
  const facultyId = req.user.id;
  try {
    const facultyMember = await FacultyMember.findOne({
      where: {
        id: facultyId,
      },
    });
    console.log(facultyMember.dataValues.departmentId);
    //check if faculty member is pmo
    if (!facultyMember.dataValues.pmoOfDepartmentId)
      return res.status(403).send("You are not a Pmo");
    //check if any student already exists in db
    const existedStudents = await Student.findAll({
      where: {
        rollNo: {
          [Sequelize.Op.in]: req.body.students.map(student => student.rollNo),
        },
      },
    });
    if (existedStudents.length)
      await Student.destroy({
        where: {
          rollNo: {
            [Sequelize.Op.in]: req.body.students.map(student => student.rollNo),
          },
        },
      });

    console.log(
      req.body.students.map(student => parseInt(student.rollNo.slice(0, 2)))
    );
    const createdStudents = await Student.bulkCreate(
      req.body.students.map(student => ({
        name: student.name,
        rollNo: student.rollNo,
        leader: false,
        password: crypto.randomBytes(8).toString("hex").slice(0, 8),
        batchId: parseInt(student.rollNo.slice(0, 2)),
        departmentId: facultyMember.dataValues.departmentId,
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
    console.log("student", createdStudents);
    console.log(
      createdStudents.map(student => {
        return {
          email: student.dataValues.rollNo + "@uog.edu.pk",
          subject: "Ignore FYP Students Testing",
          body: `Testing...
           Your credentials are for: 
           Username: ${student.dataValues.rollNo}
           Password:${student.dataValues.password}`,
        };
      })
    );
    // return;
    //Send credentials to emails
    sendMail(
      createdStudents.map(student => {
        return {
          email: student.dataValues.rollNo + "@uog.edu.pk",
          subject: "PMO Students Testing",
          body: `Testing...
           Your credentials are: 
           Username: ${student.dataValues.rollNo}
           Password:${student.dataValues.password}`,
        };
      })
    );

    res.json({
      message: "Student registered successfully",
      students: createdStudents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error registering Student",
      error,
    });
  }
};
