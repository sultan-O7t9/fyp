const {
  Department,
  Admin,
  FacultyMember,
  Batch,
  Faculty_Role,
  PMO,
  Version,
} = require("../models");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");

// var fs = require('fs');
const pdf = require("html-pdf");
const sequelize = require("sequelize");
const { sendMail, sendMailWithAttachment } = require("../utils/sendMails");

const dir = path.join(__dirname, "../uploads");

class VersionController {
  static addComment = async (req, res) => {
    const { versionId, comment } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      if (!version) {
        return res.status(404).json({
          message: "Version not found",
        });
      }
      await version.update({
        comment,
      });

      res.json({
        message: "Comment added successfully",
        version,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error adding comment",
        error: err,
      });
    }
  };
  static changeEndorsementStatus = async (req, res) => {
    const { versionId, status } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      if (!version) {
        return res.status(404).json({
          message: "Version not found",
        });
      }
      if (status == "Approved") {
        await version.update({
          commented_doc: null,
        });
      }
      await version.update({
        status: status,
      });

      res.json({
        message: "Endorsement status changed successfully",
        version,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error changing endorsement status",
        error: err,
      });
    }
  };
  static uploadCommentedDoc = async (req, res) => {
    const { file } = req;
    const { versionId } = req.body;
    // console.log(deliverableId);
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });

      const fileTitle = file.originalname;
      //   const version_id = submittedVersion.id;
      const title = fileTitle.split(".")[0];
      const extension = fileTitle.split(".").pop();
      const fileName =
        title +
        "_comm" +
        (new Date().getHours() +
          new Date().getMinutes() +
          new Date().getMonth() +
          new Date().getYear() +
          new Date().getDay() +
          new Date().getSeconds()) +
        "." +
        extension;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });

      await version.update({
        commented_doc: fileName,
      });

      res.json({
        message: "File uploaded successfully as " + fileName,
        upload: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error uploading file",
        error,
        upload: false,
      });
    }
  };

  static shareSchedule = async (req, res) => {
    const { tables, deliverableId, deliverableData, dim } = req.body;

    try {
      const students = deliverableData.map(sch =>
        sch.group.groupMembers.map(student => student.rollNo + "@uog.edu.pk")
      );
      const studentsList = students.flat();
      const committees = deliverableData.map(sch =>
        sch.committee.evaluators.map(evaluator => evaluator.id)
      );
      const evalsList = [...new Set(committees.flat())];
      const evaluators = await FacultyMember.findAll({
        where: {
          id: {
            [sequelize.Op.or]: evalsList,
          },
        },
      });
      const committeeMembers = evaluators.map(evaluator => evaluator.email);
      // for(student of students)
      console.log(studentsList, committeeMembers);
      const allRecipiants = studentsList.concat(committeeMembers);
      console.log(allRecipiants);
      //
      const html = tables;
      console.log(html);
      const options = {
        height: dim.height + "px", // allowed units: mm, cm, in, px
        width: dim.width + "px",
      };
      console.log(options);
      console.log(dir);
      const filePath = path.join(
        dir,
        "Sched_" + new Date().getTime().toString() + ".pdf"
      );

      const fileName = new Date().getTime().toString() + ".html";
      const filePathHTML = path.join(dir, fileName);
      fs.writeFileSync(filePathHTML, html, err => {
        if (err) throw err;
      });
      const htmlFile = fs.readFileSync(filePathHTML, "utf8");
      pdf.create(htmlFile, options).toFile(filePath, function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
        sendMailWithAttachment(
          ["18094198-079@uog.edu.pk"].map(student => {
            return {
              email: student,
              subject: "Schedule for Deliverable " + deliverableId,
              html: html,
              path: filePathHTML,
              // name: "Sched_Deliverable_" + deliverableId + ".pdf",
              body: `
              The Evaluation Schedule for Deliverable ${deliverableId} is attached below.
               `,
            };
          })
        );
        console.log("Email sent");
      });

      res.json({
        message: "Schedule shared successfully",
        share: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error sharing schedule",
        error,
        upload: false,
      });
    }
  };
}
module.exports = VersionController;
