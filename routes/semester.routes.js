// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
const Semester = require("../controllers/semester.controller");
const { generateDocx } = require("../controllers/docx.controller");

const Router = require("express").Router();

Router.get("/get-all", Semester.getAllSemesters);
Router.post("/create", Semester.createSemester);

Router.post("/current", Semester.setCurrentSemester);
Router.get("/get-current", Semester.getCurrentSemester);
Router.get("/docx", generateDocx);
Router.post("/update-grp-sem", Semester.updateGroupSemester);
Router.get("/get-all-grp", Semester.getSemestersWithGroups);
Router.post("/send-mail", Semester.sendMailToStudents);
Router.post("/get-mails", Semester.getSentMails);
Router.post("/del-mails", Semester.deleteSentMails);

module.exports = Router;
