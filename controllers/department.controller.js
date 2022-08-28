const {
  Department,
  Admin,
  FacultyMember,
  Batch,
  Faculty_Role,
  PMO,
} = require("../models");

class DepratmentController {
  static getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.findAll();

      const detailedDepartments = await Promise.all(
        departments.map(async department => {
          const pmoOfDept = await PMO.findOne({
            where: {
              deptId: department.id,
            },
          });
          let pmo;
          if (pmoOfDept)
            pmo = await FacultyMember.findOne({
              where: {
                id: pmoOfDept.pmoId,
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
    const title = name;
    function onlyCapitalLetters(str) {
      let newStr = "";

      for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[A-Z]/)) {
          newStr += str[i];
        }
      }
      return newStr;
    }
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
          title,
          name: onlyCapitalLetters(name),
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
    const { deptId } = req.params;
    try {
      const dept = await Department.findOne({
        where: {
          id: deptId,
        },
      });
      if (dept) {
        const pmoDept = await PMO.findOne({
          where: {
            deptId: deptId,
          },
        });
        if (pmoDept) {
          const pmo = await FacultyMember.findOne({
            where: {
              id: pmoDept.pmoId,
            },
          });
          if (pmo) {
            const faculty_role = await Faculty_Role.findOne({
              where: {
                facultyId: pmo.id,
                roleId: 1,
              },
            });
            if (faculty_role) {
              await faculty_role.destroy();
            }
          }

          await pmoDept.destroy();
        }
        await dept.destroy();
      }
      res.json({
        message: "Department removed successfully",
        remove: true,
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
  static updateDepartment = async (req, res) => {
    const { title, id } = req.body;
    try {
      const dept = await Department.findOne({
        where: {
          id: id,
        },
      });

      if (dept) {
        function onlyCapitalLetters(str) {
          let newStr = "";

          for (let i = 0; i < str.length; i++) {
            if (str[i].match(/[A-Z]/)) {
              newStr += str[i];
            }
          }
          return newStr;
        }
        await dept.update({
          title: title,
          name: onlyCapitalLetters(title),
        });
      }
      res.json({
        message: "Department updated successfully",
        update: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error updating departments",
        update: false,
        error,
      });
    }
  };
}
module.exports = DepratmentController;
