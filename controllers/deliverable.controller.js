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
  Semester,
  EvaluationLog,
  CommitteeReview,
} = require("../models");
const { Op } = require("sequelize");

class DeliverableController {
  static setLogs = async (req, res) => {
    const { deliverableId, groupId, text } = req.body;
    try {
      const log = await EvaluationLog.create({
        text,
        deliverableId,
        groupId,
      });
      res.status(200).json({
        message: "Log created successfully",
        log,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting Logs",
        error,
        get: false,
      });
    }
  };
  static getLogs = async (req, res) => {
    const { deliverableId, groupId } = req.body;
    try {
      const logs = await EvaluationLog.findAll({
        where: {
          deliverableId,
          groupId,
        },
      });
      res.status(200).json(logs);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting Logs",
        error,
        get: false,
      });
    }
  };
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
    const { deliverableId, deadline, email, userId } = req.body;
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      const emailSubject = email.subject
        ? email.subject
        : `Submission of ${
            deliverableId == 1
              ? "Final Year Project's Proposal"
              : deliverableId == 2
              ? " Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation"
              : "D3 (Complete Document incl. Test Document and User Manual along with Working System)"
          } - FYP `;
      const emailBody = email.body
        ? email.body
        : `The deadline and template file to submit ${
            deliverableId == 1
              ? "FYP Proposal"
              : deliverableId == 2
              ? "Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation"
              : "Complete Documentation incl. D2 chapters, Test Document and User Manual(D3) along with 30% Implementation"
          } has been updated on PMS. Login for further details.
      
      Submission Procedure:
          1. ${
            deliverableId == 1
              ? "Docx file of FYP Proposal"
              : "Zip file including docx file of Documentation and zip file of code"
          }  should be uploaded against Deliverable ${deliverableId}.
          2. The file name should be the same as your project title.
          3. Submit required docs before/on the deadline.
      `;
      await deliverable.update({
        deadline,
        emailbody: emailBody,
        emailsubject: emailSubject,
      });
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });

      // const subject = deliverable.dataValues.emailsubject
      //   ? deliverable.dataValues.emailsubject
      //   : "Deliverable " + deliverableId + " has been updated";
      // const body = deliverable.dataValues.emailbody
      //   ? deliverable.dataValues.emailbody
      //   : "Deliverable " +
      //     deliverableId +
      //     " has been updated. Log in to the system to view the updated details";
      // const deptId = faculty.dataValues.departmentId;
      // const students = await Student.findAll({
      //   departmentId: deptId,
      // });
      const currentSemester = await Semester.findOne({
        where: {
          current: true,
        },
      });
      let groups;
      if (currentSemester)
        groups = await Group.findAll({
          where: {
            semesterId: currentSemester.dataValues.id,
          },
        });
      else {
        const pmo = await PMO.findAll({
          where: {
            pmoId: userId,
          },
        });

        const depts = await Department.findAll({
          where: {
            id: {
              [sequelize.Op.in]: pmo.map(p => p.dataValues.deptId),
            },
          },
        });
        groups = await Group.findAll({
          where: {
            departmentId: {
              [sequelize.Op.in]: depts.map(d => d.dataValues.id),
            },
          },
        });
      }
      // const filteredStudents = students.filter(
      //   student => student.dataValues.departmentId == deptId
      // );
      const filteredStudents = await Student.findAll({
        where: {
          groupId: {
            [sequelize.Op.in]: groups.map(g => g.dataValues.id),
          },
        },
      });

      sendMail(
        filteredStudents.map(student => {
          return {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            subject: emailSubject,
            body: `
          ${emailBody}

          Regards,
          ${faculty.dataValues.name}
          `,
          };
        })
      );

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
    console.log("-----------------------------REQ");
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
      const committeeReview = await CommitteeReview.findOne({
        where: {
          deliverableId,
          groupId,
        },
      });

      res.json({
        message: "Versions fetched successfully",
        versions: versions.map(version => ({
          ...version,
          committeeReview: version.status == "Approved" ? committeeReview : {},
        })),
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
    console.log("------------------REQ3");
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
      // console.log(versions.dataValues);
      const committeeReview = await CommitteeReview.findOne({
        where: {
          deliverableId,
          groupId,
        },
      });

      res.json({
        message: "Versions fetched successfully",
        versions: versions.map(version => ({
          ...version.dataValues,
          committeeReview: version.status == "Approved" ? committeeReview : {},
        })),

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
    console.log("-------------------REQ2");
    try {
      // console.log(deliverableId, groupId);
      // try{}
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const deptId = faculty.dataValues.departmentId;
      // const groups = await Group.findAll({
      //   where: {
      //     [Op.or]: [{ departmentId: deptId }, { supervisorId: userId }],
      //   },
      // });
      const groups = await Group.findAll({
        where: {
          supervisorId: userId,
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
            submission: versions.length > 0 ? versions.pop() : {},
            project: project
              ? project.dataValues
              : {
                  id: null,
                  title: null,
                  description: null,
                },
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
  static deleteGroupDeliverableSubmission = async (req, res) => {
    const { file } = req.params;
    try {
      console.log(file);
      // const path = `${__dirname}/../uploads/${file}`;
      // console.log(path);
      const version = await Version.findOne({
        where: {
          name: file,
        },
      });
      await version.destroy();
      // fs.unlink(path, err => {
      //   if (err) throw err;
      //   console.log("file deleted");
      // });
      res.json({
        message: "Version deleted successfully",
        version,
        delete: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error deleting version",
        error,
        delete: false,
      });
    }
  };
  static getGroupsDeliverableSubmissionBySupervisor = async (req, res) => {
    console.log("------------------REQ4");
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
            submission: versions.length > 0 ? versions.pop() : {},
            project: project
              ? project.dataValues
              : {
                  id: null,
                  title: null,
                  description: null,
                },
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
  static getGroupsDeliverableSubmissionByCurrentSemester = async (req, res) => {
    console.log("---------------------------------------");
    const { deliverableId } = req.body;
    console.table({ ID: deliverableId });
    try {
      // console.log(deliverableId, groupId);
      // try{}

      const currentSemester = await Semester.findOne({
        where: {
          current: true,
        },
      });
      console.log(currentSemester.id);
      if (currentSemester) {
        const groups = await Group.findAll({
          where: {
            semesterId: currentSemester.dataValues.id,
          },
        });
        console.log(groups.map(g => g.name));

        const subs = [];

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
              submission: versions.length > 0 ? versions.pop() : {},
              project: project
                ? project.dataValues
                : {
                    id: null,
                    title: null,
                    description: null,
                  },
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
      } else {
        res.json({
          message: "Versions fetched successfully",
          submissions: [],
          get: true,
        });
      }
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
    const { deliverableId, userId, groups } = req.body;

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

      // const currentSemester = await Semester.findOne({
      //   where: {
      //     current: true,
      //   },
      // });
      // let groups;
      // if (currentSemester)
      //   groups = await Group.findAll({
      //     where: {
      //       semesterId: currentSemester.dataValues.id,
      //     },
      //   });
      // else {
      //   const pmo = await PMO.findAll({
      //     where: {
      //       pmoId: userId,
      //     },
      //   });

      //   const depts = await Department.findAll({
      //     where: {
      //       id: {
      //         [sequelize.Op.in]: pmo.map(p => p.dataValues.deptId),
      //       },
      //     },
      //   });
      //   groups = await Group.findAll({
      //     where: {
      //       departmentId: {
      //         [sequelize.Op.in]: depts.map(d => d.dataValues.id),
      //       },
      //     },
      //   });
      // }
      // const filteredStudents = students.filter(
      //   student => student.dataValues.departmentId == deptId
      // );
      const filteredStudents = await Student.findAll({
        where: {
          groupId: {
            [sequelize.Op.in]: groups,
          },
        },
      });

      sendMail(
        filteredStudents.map(student => {
          return {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            subject: subject,
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
