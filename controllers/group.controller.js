require("dotenv").config();

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

const {
  Group,
  Student,
  Department,
  FacultyMember,
  Project,
  Admin,
  Committee,
} = require("../models");
const sequelize = require("sequelize");
var crypto = require("crypto");
const { sendMail } = require("../utils/sendMails");

class GroupController {
  static changePassword = async (req, res) => {
    const { groupId, password } = req.body;
    try {
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      const members = await Student.findAll({
        where: {
          groupId: group.id,
        },
      });

      await group.update({
        password: password,
      });

      sendMail(
        members.map(student => {
          return {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            subject: "Ignore - FYP Groups",
            body: `Testing...
             Your group has been updated.
             Group members:
                ${members.map(member => member.dataValues.rollNo).join(", ")} 
                
             Your credentials are: 
                Username: ${group.dataValues.name}
                Password:${group.dataValues.password}
             `,
          };
        })
      );

      return res.status(200).send({
        message: "Password changed successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  };
  static getGroupByStudent = async (req, res) => {
    const studentId = req.user.id;
    try {
      const student = await Student.findOne({
        where: {
          rollNo: studentId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: student.dataValues.groupId,
        },
      });
      res.json({
        message: "Group fetched successfully",
        group: {
          id: group.dataValues.name,
          members: group.dataValues.members,
          // leader:group.dataValues.leader,
          supervisor: group.dataValues.supervisorId,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting group",
        error: err,
      });
    }
  };
  static changeBookletStatus = async (req, res) => {
    const { groupId, status } = req.body;
    console.log(status);
    try {
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      await group.update({
        bookletsStatus: status,
      });
      res.json({
        message: "Booklet status changed successfully",
        group,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting group",
        error: err,
      });
    }
  };
  static changeBookletComment = async (req, res) => {
    const { groupId, comment } = req.body;
    try {
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      await group.update({
        bookletsComment: comment,
      });
      console.log(group);
      res.json({
        message: "Booklet comment changed successfully",
        comment: true,
        group,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting group",
        error: err,
        comment: false,
      });
    }
  };
  static getGroupById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const group = await Group.findOne({
        where: {
          id: id,
        },
      });
      console.log(group);
      const supervisor = await FacultyMember.findOne({
        where: {
          id: group.dataValues.supervisorId,
        },
      });
      const members = await Student.findAll({
        where: {
          groupId: id,
        },
      });
      const committee = await Committee.findOne({
        where: {
          id: group.dataValues.committeeId,
        },
      });
      const project = await Project.findOne({
        where: {
          id: group.dataValues.projectId,
        },
      });
      if (group)
        res.json({
          message: "Group fetched successfully",
          group: {
            id: group.dataValues.id,
            name: group.dataValues.name,
            members: members.map(member => member.dataValues.rollNo),
            leader: members.find(member => member.dataValues.leader == 1)
              .dataValues.rollNo,
            supervisor: supervisor.dataValues,
            committee: committee ? committee.dataValues : {},
            project: project ? project.dataValues : {},
          },
        });
      else
        res.status(404).json({
          message: "Group not found",
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting group",
        error: err,
      });
    }
  };

  static deleteGroup = async (req, res) => {
    const groupId = req.params.id;
    try {
      const group = await Group.findOne({
        where: {
          name: groupId,
        },
      });
      const students = await Student.findAll({
        where: {
          groupId: group.dataValues.id,
        },
      });
      await Promise.all(
        students.map(async student => {
          await student.update({
            groupId: null,
            leader: false,
          });
        })
      );

      await Group.destroy({
        where: {
          name: groupId,
        },
      });
      res.json({ delete: true, message: "Group deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error deleting group",
        error: err,
      });
    }
  };

  static editGroup = async (req, res) => {
    const { members, leader, supervisor, id } = req.body;
    console.log(req.body);
    // return res.status(200);
    try {
      const group = await Group.findOne({
        where: {
          name: id,
        },
      });
      const students = await Student.findAll({
        where: {
          groupId: group.dataValues.id,
        },
      });
      await Promise.all(
        students.map(async student => {
          await student.update({
            groupId: null,
            leader: false,
          });
        })
      );

      // students.forEach(async student => {
      //   await student.update({
      //     groupId: null,
      //   });
      // });

      const currentSupervisor = await FacultyMember.findOne({
        where: {
          id: group.dataValues.supervisorId,
        },
      });

      const newMembers = await Student.findAll({
        where: {
          rollNo: {
            [sequelize.Op.in]: members,
          },
        },
      });
      await Promise.all(
        newMembers.map(async member => {
          await member.update({
            groupId: group.dataValues.id,
            leader: member.dataValues.rollNo === leader,
          });
          console.log(member.dataValues);
        })
      );

      const groupLeader = newMembers.find(
        member => member.dataValues.rollNo === leader
      );
      await groupLeader.update({
        leader: true,
      });

      if (currentSupervisor.dataValues.id != req.body.supervisor) {
        await currentSupervisor.update({
          groupId: null,
        });
        const newSupervisor = await FacultyMember.findOne({
          where: {
            id: req.body.supervisor,
          },
        });
        await group.update({
          supervisorId: newSupervisor.dataValues.id,
        });

        // newMembers.forEach(async member => {
        //   await member.update({
        //     groupId: group.id,
        //   });
        // });
        res.json({
          message: "Group updated successfully",
          group: {
            id: group.dataValues.name,
            members: newMembers.map(student => ({
              rollNo: student.dataValues.rollNo,
              name: student.dataValues.name,
            })),
            leader: leader,
            supervisor: newSupervisor.dataValues.id,
          },
        });
      } else {
        res.json({
          message: "Group updated successfully",
          group: {
            id: group.dataValues.name,
            members: members,
            leader: leader,
            supervisor: supervisor,
          },
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error updating group",
        error: err,
      });
    }
  };

  static createGroup = async (req, res) => {
    const { id, role } = req.user;

    try {
      if (role.includes("STUDENT")) {
        if (!req.body.members.includes(id)) {
          return res.status(400).json({
            message: "You are not part of the group",
          });
        }
      }
      const members = await Student.findAll({
        where: {
          rollNo: {
            [sequelize.Op.in]: req.body.members,
          },
        },
      });
      console.log("members", members);
      const leader = members.find(
        student => student.dataValues.rollNo === req.body.leader
      );
      console.log(leader);

      const group = await Group.create({
        name: leader.dataValues.name + leader.dataValues.rollNo,
        supervisorId: req.body.supervisor,
        departmentId: leader.dataValues.departmentId,
        password: crypto.randomBytes(8).toString("hex").slice(0, 8),
      });
      console.log(group);
      if (group) {
        await Promise.all(
          members.map(async member => {
            await member.update({
              groupId: group.id,
            });
          })
        );
        await leader.update({
          leader: true,
        });
        const department = await Department.findOne({
          where: {
            id: leader.dataValues.departmentId,
          },
        });
        await group.update({
          name: `${department.dataValues.name}_${leader.dataValues.batchId}_${group.id}`,
        });
        const leaderStudent = members.find(
          student => student.dataValues.leader == 1
        );
        console.log(leaderStudent);

        sendMail(
          [leaderStudent].map(student => {
            return {
              email: student.dataValues.rollNo + "@uog.edu.pk",
              subject: "Ignore - FYP Groups",
              body: `Testing...
               Your group has been created, successfully.
               Group members:
                  ${members.map(member => member.dataValues.rollNo).join(", ")} 
                  
               Your credentials are: 
                  Username: ${group.dataValues.name}
                  Password:${group.dataValues.password}
               Login to submit your FYP Idea.
               `,
            };
          })
        );

        // await members.map(async member => {
        //   await member.update({
        //     password: null,
        //   });
        // });

        //TODO:
        //Sign in as supervisor
        //Display groups on dashbaord
        //Allow accept and reject supervision.
        //If supervisor accepts, send email to students
        //If reject set supervisorId to null and send email to students for choosing supervisor again.

        res.json({
          register: true,
          message: "Group created successfully",
          group,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error creating group",
        error,
      });
    }
  };

  static getSupervisorGroups = async (req, res) => {
    const userId = req.user.id;
    try {
      const groups = await Group.findAll({
        where: {
          supervisorId: userId,
        },
      });
      res.json({
        message: "Groups fetched successfully",
        groups,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting groups",
        error,
      });
    }
  };

  static getGroupsByDepartment = async (req, res) => {
    const { id, deptId } = req.body;
    console.log(req.body);

    try {
      const admin = await Admin.findOne({
        where: {
          id,
        },
      });
      console.log(admin);
      if (admin) {
        const groups = await Group.findAll({
          where: {
            departmentId: deptId,
          },
        });
        res.json({
          message: "Groups fetched successfully",
          groups,
        });
      } else {
        res.status(400).json({
          message: "You are not an admin",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting groups",
        error,
      });
    }
  };

  static getAllGroupsByFacultyDepartment = async (req, res) => {
    let userId = req.user ? req.user.id : req.params.id;

    try {
      const facultyMember = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });

      const groups = await Group.findAll({
        where: {
          departmentId: facultyMember.dataValues.departmentId,
        },
      });

      const detailedGroups = await Promise.all(
        groups.map(async group => {
          const supervisor = await FacultyMember.findOne({
            where: {
              id: group.dataValues.supervisorId,
            },
          });
          let committee = null;
          if (group.dataValues.committeeId) {
            committee = await Committee.findOne({
              where: {
                id: group.dataValues.committeeId,
              },
            });
            const committeeMembers = await FacultyMember.findAll({
              where: {
                committeeId: group.dataValues.committeeId,
              },
            });
            committee = {
              ...committee.dataValues,
              members: committeeMembers,
            };
          }
          const department = await Department.findOne({
            where: {
              id: group.dataValues.departmentId,
            },
          });
          if (group.dataValues.projectId) {
            const project = await Project.findOne({
              where: {
                id: group.dataValues.projectId,
              },
            });
            group.dataValues.project = project.dataValues.title;
          } else {
            group.dataValues.project = null;
          }
          //Get members
          const members = await group.getStudents();
          group.dataValues.members = members.map(member => {
            return {
              rollNo: member.dataValues.rollNo,
              name: member.dataValues.name,
              email: member.dataValues.email,
              leader: member.dataValues.leader,
            };
          });

          return {
            id: group.dataValues.name,
            committeeId: group.dataValues.committeeId,
            committee: committee ? committee : null,
            project: group.dataValues.project,
            members: group.dataValues.members,
            supervisor: supervisor.dataValues.name,
            supervisorId: group.dataValues.supervisorId,
            bookletsStatus: group.dataValues.bookletsStatus,
            bookletsComment: group.dataValues.bookletsComment,
            department: department.dataValues.name,
          };
        })
      );

      res.json({
        message: "Groups fetched successfully",
        groups: detailedGroups,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting groups",
        error,
      });
    }
  };

  static getAllGroups = async (req, res) => {
    try {
      const groups = await Group.findAll();
      const detailedGroups = await Promise.all(
        groups.map(async group => {
          const supervisor = await FacultyMember.findOne({
            where: {
              id: group.dataValues.supervisorId,
            },
          });
          const department = await Department.findOne({
            where: {
              id: group.dataValues.departmentId,
            },
          });
          if (group.dataValues.projectId) {
            const project = await Project.findOne({
              where: {
                id: group.dataValues.projectId,
              },
            });
            group.dataValues.project = project.dataValues.title;
          } else {
            group.dataValues.project = null;
          }
          //Get members
          const members = await group.getStudents();
          group.dataValues.members = members.map(member => {
            return {
              rollNo: member.dataValues.rollNo,
              name: member.dataValues.name,
              email: member.dataValues.email,
              leader: member.dataValues.leader,
            };
          });

          return {
            id: group.dataValues.name,
            committeeId: group.dataValues.committeeId,
            project: group.dataValues.project,
            members: group.dataValues.members,
            supervisor: supervisor.dataValues.name,
            bookletsStatus: group.dataValues.bookletsStatus,
            department: department.dataValues.name,
            bookletsComment: group.dataValues.bookletsComment,
          };
        })
      );

      res.json({
        message: "Groups fetched successfully",
        groups: detailedGroups,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting groups",
        error,
      });
    }
  };

  static approveGroupRequest = async (req, res) => {};

  static uploadFile = async (req, res) => {
    const { file } = req;
    try {
      console.log(file);
      if (file.detectedFileExtension != ".pdf") new Error("Invalid file type");
      const fileName = `123.pdf`;
      // await pipeline(
      //   file.buffer,
      //   fs.createWriteStream(`${__dirname}/../uploads/${fileName}`)
      // );
      const filePath = `${__dirname}/../uploads/${fileName}`;
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });

      res.json({
        message: "File uploaded successfully as " + fileName,
        upload: true,
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

  static submitProposal = async (req, res) => {};

  static downloadFile = async (req, res) => {
    const fileName = req.body.name;
    try {
      const filePath = `${__dirname}/../uploads/${fileName}`;
      res.download(filePath);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error downloading file",
        error,
        download: false,
      });
    }
  };
}

module.exports = GroupController;
