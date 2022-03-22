const {
  FacultyMember,
  Department,
  Group,
  Committee,
  Student,
  Role,
  Faculty_Role,
} = require("../models");
const sequelize = require("sequelize");

module.exports.getAllCommittees = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  //in res
  // [{
  //     id,department,members,group
  // }]
  try {
    const pmo = await FacultyMember.findOne({
      where: {
        id: req.user.id,
      },
    });
    const committees = await Committee.findAll({
      where: {
        departmentId: pmo.dataValues.departmentId,
      },
      include: [
        {
          model: FacultyMember,
          // as: "facultyId",
          attributes: ["id", "name"],
        },
        {
          model: Group,
          // as: "group",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json({ committees });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.createCommittee = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  // in req.body:
  // {members: [id],
  // groups: [name]}
  //in res
  // {
  //     id: comittee.name,
  //     department:Pmo Department,
  //     members:[{name:"",email:"",id}],
  //     groups:[{name:"",id}],
  // }

  //get PMO from id, and depratment name from departmentId
  //set comittee name to random
  //set comittee Id in groups to comittee.id where groups.name in req.body.groups
  //set comittee Id in facultymembers to comittee.id where members.id in req.body.members
  //set committee name to c_department.name_comittee.id
  try {
    const pmo = await FacultyMember.findOne({
      where: {
        id: req.user.id,
      },
    });
    const department = await Department.findOne({
      where: {
        id: pmo.dataValues.departmentId,
      },
    });
    const comittee = await Committee.create({
      name: `${department.dataValues.name}_${Math.floor(
        Math.random() * 100
      )}_${new Date().getTime()}`,
      departmentId: department.dataValues.id,
    });
    await comittee.update({
      name: `C_${department.dataValues.name}_${comittee.dataValues.id}`,
      departmentId: department.dataValues.id,
    });

    const groups = await Group.findAll({
      where: {
        name: {
          [sequelize.Op.in]: req.body.groups,
        },
      },
    });
    const students = await Student.findAll({
      where: {
        groupId: {
          [sequelize.Op.in]: groups.map(group => group.dataValues.id),
        },
      },
    });

    const members = await FacultyMember.findAll({
      where: {
        id: {
          [sequelize.Op.in]: req.body.members,
        },
      },
    });
    const evaluatorRole = await Role.findOne({
      where: {
        title: "EVALUATOR",
      },
    });
    members.forEach(async member => {
      await Faculty_Role.create({
        facultyId: member.dataValues.id,
        roleId: evaluatorRole.dataValues.id,
      });
    });

    groups.forEach(group => {
      group.update({
        committeeId: comittee.id,
      });
    });
    students.forEach(student => {
      student.update({
        committeeId: comittee.id,
      });
    });

    members.forEach(member => {
      member.update({
        committeeId: comittee.id,
      });
    });

    res.json({
      message: "Committee created successfully",
      comittee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating committee",
      error,
    });
  }
};
module.exports.updateCommittee = async (req, res) => {
  //reset everything related to that committee
  //then reassign everything according to req.body
  // we get members[id], groups[name], committee.id from req.body
  try {
    const committee = await Committee.findOne({
      where: {
        id: req.body.committeeId,
      },
    });
    const groups = await Group.findAll({
      where: {
        committeeId: req.body.committeeId,
      },
    });
    groups.forEach(async group => {
      await group.update({
        committeeId: null,
      });
    });

    // console.log(newGroups);

    const students = await Student.findAll({
      where: {
        committeeId: req.body.committeeId,
      },
    });
    students.forEach(async student => {
      await student.update({
        committeeId: null,
      });
    });

    const members = await FacultyMember.findAll({
      where: {
        committeeId: req.body.committeeId,
      },
    });
    members.forEach(async member => {
      await member.update({
        committeeId: null,
      });
    });
    const evaluatorRole = await Role.findOne({
      where: {
        title: "EVALUATOR",
      },
    });

    const membersRole = await Faculty_Role.findAll({
      where: {
        facultyId: {
          [sequelize.Op.in]: members.map(member => member.dataValues.id),
        },
        roleId: evaluatorRole.dataValues.id,
      },
    });
    membersRole.forEach(async memberRole => {
      await memberRole.destroy();
    });

    const newMembers = await FacultyMember.findAll({
      where: {
        id: {
          [sequelize.Op.in]: req.body.members,
        },
      },
    });
    newMembers.forEach(async member => {
      await member.update({
        committeeId: req.body.committeeId,
      });
    });
    newMembers.forEach(async member => {
      await Faculty_Role.create({
        facultyId: member.dataValues.id,
        roleId: evaluatorRole.dataValues.id,
      });
    });

    const newGroups = await Group.findAll({
      where: {
        name: {
          [sequelize.Op.in]: req.body.groups,
        },
      },
    });
    newGroups.forEach(async group => {
      await group.update({
        committeeId: req.body.committeeId,
      });
    });
    const newStudents = await Student.findAll({
      where: {
        groupId: {
          [sequelize.Op.in]: newGroups.map(group => group.dataValues.id),
        },
      },
    });
    newStudents.forEach(async student => {
      await student.update({
        committeeId: req.body.committeeId,
      });
    });

    res.json({
      message: "Committee updated successfully",
      committee: {
        name: committee.dataValues.name,
        id: committee.dataValues.id,
        groups: newGroups.map(group => group.dataValues.name),
        members: newMembers.map(member => member.dataValues.id),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating committee",
      error,
    });
  }
};
module.exports.deleteCommittee = async (req, res) => {
  try {
    const committee = await Committee.findOne({
      where: {
        id: req.params.id,
      },
    });
    const groups = await Group.findAll({
      where: {
        committeeId: req.params.id,
      },
    });
    groups.forEach(async group => {
      await group.update({
        committeeId: null,
      });
    });
    const students = await Student.findAll({
      where: {
        committeeId: req.params.id,
      },
    });
    students.forEach(async student => {
      await student.update({
        committeeId: null,
      });
    });
    const members = await FacultyMember.findAll({
      where: {
        committeeId: req.params.id,
      },
    });
    members.forEach(async member => {
      await member.update({
        committeeId: null,
      });
    });
    const evaluatorRole = await Role.findOne({
      where: {
        title: "EVALUATOR",
      },
    });
    const membersRole = await Faculty_Role.findAll({
      where: {
        facultyId: {
          [sequelize.Op.in]: members.map(member => member.dataValues.id),
        },
        roleId: evaluatorRole.dataValues.id,
      },
    });
    membersRole.forEach(async memberRole => {
      await memberRole.destroy();
    });
    await committee.destroy();
    res.json({
      delete: true,
      message: "Committee deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting committee",
      error,
    });
  }
};
