const {
  Faculty_Role,
  Role,
  FacultyMember,
  Admin,
  Department,
  Group,
  Committee,
} = require("../models");
const sequelize = require("sequelize");

class FacultyController {
  static removePMO = async (req, res) => {
    const { id, facultyId } = req.body;
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
        const faculty = await FacultyMember.findOne({
          where: {
            id: facultyId,
          },
        });
        console.log(faculty);

        if (faculty) {
          faculty.update({
            pmoOfDepartmentId: null,
          });
          const pmoRole = await Role.findOne({
            where: {
              title: "PMO",
            },
          });
          const facultyRole = await Faculty_Role.findOne({
            where: {
              facultyId: facultyId,
              roleId: pmoRole.id,
            },
          });
          await facultyRole.destroy();

          res.json({
            message: "PMO removed successfully",
            faculty,
          });
        } else {
          res.status(400).json({
            message: "Invalid Faculty Id",
          });
        }
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
  static assignPMO = async (req, res) => {
    const { id, facultyId, deptId } = req.body;
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
        const faculty = await FacultyMember.findOne({
          where: {
            id: facultyId,
          },
        });
        console.log(faculty);
        const dept = await Department.findOne({
          where: {
            id: deptId,
          },
        });
        if (!dept) throw new Error("Invalid Department Id");
        if (faculty) {
          faculty.update({
            pmoOfDepartmentId: dept.id,
          });
          const pmoRole = await Role.findOne({
            where: {
              title: "PMO",
            },
          });
          const facultyRole = await Faculty_Role.create({
            facultyId: faculty.id,
            roleId: pmoRole.id,
          });

          res.json({
            message: "PMO assigned successfully",
            faculty,
          });
        } else {
          res.status(400).json({
            message: "Invalid Faculty Id",
          });
        }
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

  // static assignCommittee = async (req, res) => {
  //   const {id,facultyId,committeeId}=req.body;
  //   try {
  //     const admin = await Admin.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });
  //     console.log(admin);
  //     if (admin) {
  //       if (id != admin.id) {
  //         throw new Error("Invalid Admin Id");
  //       }
  //       const faculty = await FacultyMember.findOne({
  //         where: {
  //           id: facultyId,
  //         },
  //       });
  //       console.log(faculty);
  //       if(faculty){
  //         faculty.update({
  //           committeeId: committeeId,
  //         });
  //         res.json({
  //           message: "Faculty updated successfully",
  //           faculty,
  //         });
  //       }else{
  //         res.status(400).json({
  //           message: "Invalid Faculty Id",
  //         });
  //       }
  //     } else
  //       res.status(400).json({
  //         message: "Invalid Admin Id",
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       message: "Error getting Roles",
  //       error,
  //     });
  //   }
  // }
  // static assignGroup = async (req, res) => {
  //   const {id,facultyId,groupId}=req.body;
  //   try {
  //     const admin = await Admin.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });
  //     console.log(admin);
  //     if (admin) {
  //       if (id != admin.id) {
  //         throw new Error("Invalid Admin Id");
  //       }
  //       const faculty = await FacultyMember.findOne({
  //         where: {
  //           id: facultyId,
  //         },
  //       });
  // }
  static removeFaculty = async (req, res) => {
    const { id, facultyId } = req.body;

    try {
      const admin = await Admin.findOne({
        where: {
          id: id,
        },
      });
      if (admin) {
        if (id != admin.id) {
          throw new Error("Invalid Admin Id");
        }
        const faculty = await FacultyMember.findOne({
          where: {
            id: facultyId,
          },
        });
        if (faculty) {
          const groups = await Group.findAll({
            where: {
              supervisorId: facultyId,
            },
          });
          if (groups.length > 0) {
            await Promise.all(
              groups.map(async group => {
                group.update({
                  supervisorId: null,
                });
              })
            );
          }
          const facultyRoles = await Faculty_Role.findAll({
            where: {
              facultyId: facultyId,
            },
          });
          if (facultyRoles.length > 0) {
            await Promise.all(
              facultyRoles.map(async facultyRole => {
                facultyRole.destroy();
              })
            );
          }

          await faculty.destroy();
          res.json({
            message: "Faculty removed successfully",
            delete: true,
          });
        } else {
          res.status(400).json({
            message: "Invalid Faculty Id",
            delete: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting Faculties",
        error,
      });
    }
  };
  static registerFaculty = async (req, res) => {
    const { email, password, name, departmentId, roles, role, id } = req.body;

    try {
      const admin = await Admin.findOne({
        where: {
          id: id,
        },
      });
      if (admin) {
        if (id != admin.id) {
          throw new Error("Invalid Admin Id");
        }

        const defaultRole = await Role.findOne({
          where: {
            title: "SUPERVISOR",
          },
        });
        // const tempRoles = facultyRoles.map(role => role.dataValues.title);
        const dept = await Department.findOne({
          where: {
            id: departmentId,
          },
        });
        if (!dept) throw new Error("Invalid Department Id");
        const facultyMember = await FacultyMember.create({
          email,
          password,
          name,
          departmentId: dept.id,
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
      } else throw new Error("Invalid Admin Id");
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
