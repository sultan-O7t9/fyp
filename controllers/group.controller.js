require("dotenv").config();

const { Group, Student, Department, FacultyMember } = require("../models");
const sequelize = require("sequelize");
var crypto = require("crypto");
const { sendMail } = require("../utils/sendMails");

module.exports.createGroup = async (req, res) => {
  try {
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

      sendMail(
        members.map(student => {
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

      await members.map(async member => {
        await member.update({
          password: null,
        });
      });

      //TODO:
      //Sign in as supervisor
      //Display groups on dashbaord
      //Allow accept and reject supervision.
      //If supervisor accepts, send email to students
      //If reject set supervisorId to null and send email to students for choosing supervisor again.

      res.json({
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

module.exports.getSupervisorGroups = async (req, res) => {
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
module.exports.getAllGroupsOfADepartment = async (req, res) => {
  const userId = req.user.id;
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
        if (group.dataValues.projectId) {
          const project = await group.getProject();
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
          project: group.dataValues.project,
          members: group.dataValues.members,
          supervisor: supervisor.dataValues.name,
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
module.exports.approveGroupRequest = async (req, res) => {};
