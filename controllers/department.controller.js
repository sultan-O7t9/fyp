const { Department, Admin, FacultyMember, Batch } = require("../models");

class DepratmentController {
  static getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.findAll();

      const detailedDepartments = await Promise.all(
        departments.map(async department => {
          const pmo = await FacultyMember.findOne({
            where: {
              pmoOfDepartmentId: department.id,
            },
          });
          return {
            ...department.dataValues,
            pmo: pmo ? pmo.dataValues.name : null,
            pmoId: pmo ? pmo.dataValues.id : null,
          };
        })
      );
      res.json({
        message: "Departments fetched successfully",
        departments: detailedDepartments,
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
    const { name } = req.body;
    try {
      // const admin = await Admin.findOne({
      //   where: {
      //     id: id,
      //   },
      // });
      // console.log(admin);
      // if (admin) {
      if (true) {
        // if (id != admin.id) {
        //   throw new Error("Invalid Admin Id");
        // }
        const dept = await Department.create({
          name,
        });
        const batch = await Batch.findOne({
          where: {
            batchCode: new Date().getYear() + 1896 - 2000,
          },
        });
        if (batch) {
          await batch.update({
            departmentId: dept.dataValues.id,
          });
        } else {
          await Batch.create({
            batchCode: new Date().getYear() + 1896 - 2000,
            departmentId: dept.dataValues.id,
          });
        }
        res.json({
          message: "Department created successfully",
          dept,
          create: true,
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
        create: false,
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
