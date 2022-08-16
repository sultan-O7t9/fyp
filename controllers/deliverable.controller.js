require("dotenv").config();

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");
const dir = path.join(__dirname, "../uploads");
const sequelize = require("sequelize");
var crypto = require("crypto");
const { sendMail } = require("../utils/sendMails");
const {
  Department,
  Admin,
  FacultyMember,
  Deliverable,
  Version,
  Group,
  Project,
  Student,
} = require("../models");
const { Op } = require("sequelize");

class DeliverableController {
  static getAllDeliverables = async (req, res) => {
    try {
      const deliverables = await Deliverable.findAll();
      res.json({
        message: "Deliverables fetched successfully",
        deliverables,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting deliverables",
        error,
        get: false,
      });
    }
  };
  static createDeliverable = async (req, res) => {
    try {
      const { title } = req.body;
      const deliverable = await Deliverable.create({
        title,
      });
      res.json({
        message: "Deliverable created successfully",
        deliverable,
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error creating deliverable",
        error,
        create: false,
      });
    }
  };
  static addTemplateFile = async (req, res) => {
    const { file } = req;
    const { deliverableId } = req.body;
    console.log(deliverableId);
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });

      //   console.log(file);
      //   fileExtension = file.detectedFileExtension;
      //   console.log("EX", fileExtension);
      if (
        file.detectedFileExtension != ".docx" ||
        file.detectedFileExtension != ".doc"
      )
        new Error("Invalid file type");
      const title = deliverable.title;

      const fileName =
        title.replace(" ", "_") +
        "_template_" +
        new Date().getYear() +
        new Date().getMonth() +
        new Date().getDay() +
        "." +
        file.originalname.split(".").pop();
      // await pipeline(
      //   file.buffer,
      //   fs.createWriteStream(`${__dirname}/../uploads/${fileName}`)
      // );
      //   const filePath = `${__dirname}/../uploads/${fileName}`;
      //   const filePath = `${dir}/${fileName}`;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });
      await deliverable.update({
        template: fileName,
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

  static downloadTemplateFile = async (req, res) => {
    const { deliverableId } = req.body;
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      const fileName = deliverable.template;
      //   const filePath = `${__dirname}/../uploads/${fileName}`;
      //   const filePath = `/uploads/${fileName}`;
      //   const filePath = `${dir}/${fileName}`;
      const filePath = path.join(dir, fileName);

      console.log(filePath);
      //   res.download(filePath);
      //   res.sendFile(filePath);
      res.status(200).json({
        message: "File downloaded successfully",
        download: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error downloading file",
        error,
        download: false,
      });
    }
  };
  static getDeliverableById = async (req, res) => {
    try {
      const { id } = req.params;
      const deliverable = await Deliverable.findOne({
        where: {
          id,
        },
      });

      res.json({
        message: "Deliverable fetched successfully",
        deliverable: {
          id: deliverable.id,
          title: deliverable.title,
          template: deliverable.template,
          deadline: deliverable.deadline,
          email: {
            body: deliverable.emailbody,
            subject: deliverable.emailsubject,
          },
        },
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting deliverable",
        error,
        get: false,
      });
    }
  };
  static editDeliverable = async (req, res) => {
    const { deliverableId, deadline, email } = req.body;
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      await deliverable.update({
        deadline,
        emailbody: email.body,
        emailsubject: email.subject,
      });
      res.json({
        message: "Deliverable updated successfully",
        deliverable,
        update: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error editing deliverable",
        error,
        edit: false,
      });
    }
  };
  static getGroupDeliverableSubmission = async (req, res) => {
    const { deliverableId, groupId } = req.body;
    try {
      // console.log(deliverableId, groupId);
      // try{}
      const versions = await Version.findAll({
        where: {
          deliverableId,
          groupId,
        },
      });
      console.log(versions.dataValues);

      res.json({
        message: "Versions fetched successfully",
        versions,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting versions",
        error,
        get: false,
      });
    }
  };
  static getGroupDeliverableSubmission = async (req, res) => {
    const { deliverableId, groupId } = req.body;
    try {
      // console.log(deliverableId, groupId);
      // try{}
      const versions = await Version.findAll({
        where: {
          deliverableId,
          groupId,
        },
      });
      console.log(versions.dataValues);

      res.json({
        message: "Versions fetched successfully",
        versions,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting versions",
        error,
        get: false,
      });
    }
  };
  static getGroupsDeliverableSubmissionByDept = async (req, res) => {
    const { deliverableId, userId } = req.body;
    try {
      // console.log(deliverableId, groupId);
      // try{}
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const deptId = faculty.dataValues.departmentId;
      const groups = await Group.findAll({
        // where: {
        //   departmentId: deptId,
        //   // pmoOfDepartmentId: deptId,

        // },
        where: {
          [Op.or]: [{ departmentId: deptId }, { supervisorId: userId }],
        },
      });
      console.log(groups.dataValues);
      //   console.log(Op.in);
      //   const projects = await Project.findAll({
      //     where: {
      //       id: Op.in(groups.map(group => group.dataValues.projectId)),
      //     },
      //   });
      //   const versions = await Version.findAll({
      //     where: {
      //       deliverableId,
      //       groupId: Op.in(groups.map(group => group.dataValues.id)),
      //     },
      //   });
      const subs = [];
      //   for (const group of groups) {
      //     subs.push({
      //       group: group.dataValues,
      //       versions: versions.filter(
      //         version => version.dataValues.groupId === group.dataValues.id
      //       ),
      //       project: projects.find(
      //         project => project.dataValues.id === group.dataValues.projectId
      //       ),
      //     });
      //   }

      await Promise.all(
        groups.map(async group => {
          const versions = await Version.findAll({
            where: {
              deliverableId,
              groupId: group.dataValues.id,
            },
          });
          versions.sort((a, b) => {
            return new Date(a.dataValues.id) - new Date(b.dataValues.id);
          });
          //   versions.reverse();
          const project = await Project.findOne({
            where: {
              id: group.dataValues.projectId,
            },
          });
          const data = {
            ...group.dataValues,
            submission: versions.pop(),
            project: project.dataValues,
          };
          subs.push(data);
        })
      );
      //   console.log(subs);
      //   const submissions = await Version.findAll({
      //     where: {
      //       deliverableId,
      //       groupId: {
      //         [Op.in]: groups.map(group => group.id),
      //       },
      //     },
      //   });
      //   console.log(submissions.dataValues);
      //   console.log(versions.dataValues);

      res.json({
        message: "Versions fetched successfully",
        submissions: subs,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting versions",
        error,
        get: false,
      });
    }
  };
  static getGroupsDeliverableSubmissionBySupervisor = async (req, res) => {
    const { deliverableId, userId } = req.body;
    try {
      // console.log(deliverableId, groupId);
      // try{}

      const groups = await Group.findAll({
        where: {
          supervisorId: userId,
        },
      });
      //   console.log(Op.in);
      //   const projects = await Project.findAll({
      //     where: {
      //       id: Op.in(groups.map(group => group.dataValues.projectId)),
      //     },
      //   });
      //   const versions = await Version.findAll({
      //     where: {
      //       deliverableId,
      //       groupId: Op.in(groups.map(group => group.dataValues.id)),
      //     },
      //   });
      const subs = [];
      //   for (const group of groups) {
      //     subs.push({
      //       group: group.dataValues,
      //       versions: versions.filter(
      //         version => version.dataValues.groupId === group.dataValues.id
      //       ),
      //       project: projects.find(
      //         project => project.dataValues.id === group.dataValues.projectId
      //       ),
      //     });
      //   }

      await Promise.all(
        groups.map(async group => {
          const versions = await Version.findAll({
            where: {
              deliverableId,
              groupId: group.dataValues.id,
            },
          });
          versions.sort((a, b) => {
            return new Date(a.dataValues.id) - new Date(b.dataValues.id);
          });
          //   versions.reverse();
          const project = await Project.findOne({
            where: {
              id: group.dataValues.projectId,
            },
          });
          const data = {
            ...group.dataValues,
            submission: versions.pop(),
            project: project.dataValues,
          };
          subs.push(data);
        })
      );
      //   console.log(subs);
      //   const submissions = await Version.findAll({
      //     where: {
      //       deliverableId,
      //       groupId: {
      //         [Op.in]: groups.map(group => group.id),
      //       },
      //     },
      //   });
      //   console.log(submissions.dataValues);
      //   console.log(versions.dataValues);

      res.json({
        message: "Versions fetched successfully",
        submissions: subs,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting versions",
        error,
        get: false,
      });
    }
  };
  static submitGroupDeliverableSubmission = async (req, res) => {
    const { file } = req;
    const { deliverableId, groupId, projectId } = req.body;
    console.log(deliverableId, groupId, projectId);
    console.log(file);
    try {
      const submittedVersion = await Version.create({
        deliverableId,
        groupId,
        projectId,
      });
      const fileTitle = file.originalname;
      const versionId = submittedVersion.id;
      const title = fileTitle.split(".")[0] + "_" + versionId;
      const extension = fileTitle.split(".").pop();
      const fileName = title + "" + "." + extension;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });
      await submittedVersion.update({
        name: fileName,
      });

      res.json({
        message: "File uploaded successfully as " + fileName,
        upload: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error submitting version",
        error,
        submit: false,
      });
    }
  };
  static downloadGroupDeliverableSubmission = async (req, res) => {
    const { versionId } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      const fileName = version.name;
      const filePath = path.join(dir, fileName);
      console.log(filePath);
      res.status(200).json({
        message: "File downloaded successfully",
        download: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error downloading file",
        error,
        download: false,
      });
    }
  };
  static sendMailToStudents = async (req, res) => {
    const { deliverableId, userId } = req.body;

    try {
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      const subject = deliverable.dataValues.emailsubject;
      const body = deliverable.dataValues.emailbody;
      const deptId = faculty.dataValues.pmoOfDepartmentId;
      const students = await Student.findAll({
        departmentId: deptId,
      });
      const filteredStudents = students.filter(
        student => student.dataValues.departmentId == deptId
      );
      sendMail(
        filteredStudents.map(student => {
          return {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            subject: subject + " Ignore",
            body: `
          ${body}


          Regards,
          ${faculty.dataValues.name}
          `,
          };
        })
      );

      res.json({
        message: "Email sent successfully",
        get: true,
      });
    } catch (err) {
      // members.map(student => {
      //   return {
      //     email: student.dataValues.rollNo + "@uog.edu.pk",
      //     subject: "Ignore - FYP Groups",
      //     body: `Testing...
      //      Your group has been created, successfully.
      //      Group members:
      //         ${members.map(member => member.dataValues.rollNo).join(", ")}

      //      Your credentials are:
      //         Username: ${group.dataValues.name}
      //         Password:${group.dataValues.password}
      //      Login to submit your FYP Idea.
      //      `,
      //   };
      // })

      console.log(err);
      res.status(500).json({
        message: "Error sending mail",
        error,
        send: false,
      });
    }
  };
}
module.exports = DeliverableController;
