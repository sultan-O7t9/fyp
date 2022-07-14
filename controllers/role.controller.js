const { Role, Admin } = require("../models");

class RoleController {
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
