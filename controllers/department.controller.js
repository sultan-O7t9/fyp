const { Department, Admin } = require("../models");

class DepratmentController {
  static getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.findAll();
      res.json({
        message: "Departments fetched successfully",
        departments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting departments",
        error,
      });
    }
  };
  static createDepartment = async (req, res) => {
    const { id, name } = req.body;
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
        const dept = await Department.create({
          name,
        });
        res.json({
          message: "Department created successfully",
          dept,
        });
      } else
        res.status(400).json({
          message: "Invalid Admin Id",
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting departments",
        error,
      });
    }
  };
  static removeDepartment = async (req, res) => {
    const { id, deptId } = req.body;
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
        const dept = await Department.destroy({
          where: {
            id: deptId,
          },
        });
        res.json({
          message: "Department delted successfully",
          delete: true,
        });
      } else
        res.status(400).json({
          message: "Invalid Admin Id",
          delete: false,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting departments",
        delete: false,
        error,
      });
    }
  };
}
module.exports = DepratmentController;
