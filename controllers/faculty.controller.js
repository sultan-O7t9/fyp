const { Faculty_Role, Role, FacultyMember } = require("../models");
const sequelize = require("sequelize");

class FacultyController {
  static registerFaculty = async (req, res) => {
    const { email, password, name, departmentId, roles } = req.body;
    try {
      const defaultRole = await Role.findOne({
        where: {
          title: "SUPERVISOR",
        },
      });
      // const tempRoles = facultyRoles.map(role => role.dataValues.title);

      const facultyMember = await FacultyMember.create({
        email,
        password,
        name,
        departmentId,
        // pmoOfDepartmentId:
        // tempRoles && tempRoles.includes("PMO") ? departmentId : null,
      });
      await Faculty_Role.create({
        facultyId: facultyMember.dataValues.id,
        roleId: defaultRole.dataValues.id,
      });
      // await roles.forEach(async role => {
      //   await Faculty_Role.create({
      //     facultyId: facultyMember.id,
      //     roleId: role,
      //   });
      // });
      res.json({
        message: "Faculty Member registered successfully",
        facultyMember,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error registering Faculty Member",
        error,
      });
    }
  };

  static getAllSupervisors = async (req, res) => {
    // res.send(req.body);
    try {
      const role = await Role.findOne({
        where: {
          title: "SUPERVISOR",
        },
      });
      const supervisorsIds = await Faculty_Role.findAll({
        where: {
          roleId: role.id,
        },
      });
      const supervisors = await FacultyMember.findAll({
        where: {
          id: {
            [sequelize.Op.in]: supervisorsIds.map(
              supervisor => supervisor.dataValues.facultyId
            ),
          },
        },
        attributes: ["id", "name", "email", "committeeId"],
      });
      res.json({
        message: "Supervisors retrieved successfully",
        supervisors,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting supervisors",
        error: err,
      });
    }
  };

  static acceptGroupSupervision = async (req, res) => {
    // login
    // all groups of that supervisor will be shown.
    // supervisor can change status of group.
    // if status is approved, send email to students.
    // if status is rejected, set supervisorId to null and send email to students for choosing supervisor again.
    //Student will login using group account in the /choose-supervisor route.
    //All fields except supervisor will be disabled.
  };
}

module.exports = FacultyController;
