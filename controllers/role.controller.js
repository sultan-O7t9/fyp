const sequelize = require("sequelize");
const { Role, Admin, Faculty_Role } = require("../models");

class RoleController {
  static getAllRolesByFaculty = async (req, res) => {
    try {
      const froles = await Faculty_Role.findAll({
        where: {
          facultyId: req.user.id,
        },
      });
      if (froles.length > 0) {
        const roles = await Role.findAll({
          where: {
            id: {
              [sequelize.Op.in]: froles.map(frole => frole.roleId),
            },
          },
        });

        res.json({
          message: "Roles fetched successfully",
          get: true,
          roles: roles.length ? roles.map(role => role.title) : [],
        });
      } else {
        res.json({
          message: "Roles fetched successfully",
          get: true,
          roles: [],
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error getting roles" });
    }
  };
  static getAllRoles = async (req, res) => {
    try {
      const Roles = await Role.findAll();
      res.json({
        message: "Roles fetched successfully",
        Roles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting Roles",
        error,
      });
    }
  };
  static createRole = async (req, res) => {
    const { id, title } = req.body;
    try {
      const admin = await Admin.findOne({
        where: {
          id: id,
        },
      });
      console.log(admin);
      if (admin) {
        if (id != admin.id) {
          throw new Error("Invalid Admin Id");
        }
        const dept = await Role.create({
          title,
        });
        res.json({
          message: "Role created successfully",
          dept,
        });
      } else
        res.status(400).json({
          message: "Invalid Admin Id",
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting Roles",
        error,
      });
    }
  };
  //   static removeRole = async (req, res) => {
  //     const { id, deptId } = req.body;
  //     try {
  //       const admin = await Admin.findOne({
  //         where: {
  //           id: id,
  //         },
  //       });
  //       console.log(admin);
  //       if (admin) {
  //         if (id != admin.id) {
  //           throw new Error("Invalid Admin Id");
  //         }
  //         const dept = await Role.destroy({
  //           where: {
  //             id: deptId,
  //           },
  //         });
  //         res.json({
  //           message: "Role delted successfully",
  //           delete: true,
  //         });
  //       } else
  //         res.status(400).json({
  //           message: "Invalid Admin Id",
  //           delete: false,
  //         });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json({
  //         message: "Error getting Roles",
  //         delete: false,
  //         error,
  //       });
  //     }
  //   };
}
module.exports = RoleController;
