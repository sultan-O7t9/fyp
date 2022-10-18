const {
  Faculty_Role,
  Role,
  FacultyMember,
  Admin,
  Department,
  Group,
  Committee,
  PMO,
} = require("../models");
const sequelize = require("sequelize");
const { sendMail } = require("../utils/sendMails");
const { hashPassword } = require("../utils/hashPassword");

class FacultyController {
  static getAllSupervisorById = async (req, res) => {
    const { id } = req.body;
    console.log("facultyID", id);
    try {
      const faculty = await FacultyMember.findOne({
        where: {
          id: id,
        },
      });
      console.log(faculty);
      res.json({
        message: "Supervisor retrieved successfully",
        faculty: faculty,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
      });
    }
  };
  // static removePMO = async (req, res) => {
  //   const { id, facultyId } = req.body;
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

  //       if (faculty) {
  //         faculty.update({
  //           pmoOfDepartmentId: null,
  //         });
  //         const pmoRole = await Role.findOne({
  //           where: {
  //             title: "PMO",
  //           },
  //         });
  //         const facultyRole = await Faculty_Role.findOne({
  //           where: {
  //             facultyId: facultyId,
  //             roleId: pmoRole.id,
  //           },
  //         });
  //         await facultyRole.destroy();

  //         res.json({
  //           message: "PMO removed successfully",
  //           faculty,
  //         });
  //       } else {
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
  // };
  static assignPMO = async (req, res) => {
    const { facultyId, deptId } = req.body;
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
        const faculty = await FacultyMember.findOne({
          where: {
            id: facultyId,
          },
        });
        console.log(faculty);
        const havePMO = await PMO.findOne({
          where: {
            deptId: deptId,
          },
        });

        const dept = await Department.findOne({
          where: {
            id: deptId,
          },
        });
        if (!dept) throw new Error("Invalid Department Id");
        if (faculty) {
          const pmoRole = await Role.findOne({
            where: {
              title: "PMO",
            },
          });
          if (havePMO) {
            await havePMO.destroy();

            const preRole = await Faculty_Role.findOne({
              where: {
                facultyId: havePMO.pmoId,
                roleId: pmoRole.id,
              },
            });
            await havePMO.destroy();
          }

          const facultyRole = await Faculty_Role.findOne({
            where: {
              facultyId: facultyId,
              roleId: pmoRole.id,
            },
          });
          if (!facultyRole) {
            const facultyRole = await Faculty_Role.create({
              facultyId: faculty.id,
              roleId: pmoRole.id,
            });
          }

          const pmo = await PMO.create({
            pmoId: faculty.id,
            deptId: deptId,
          });

          res.json({
            message: "PMO assigned successfully",
            assign: true,
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
    const facultyId = req.params.id;

    console.log(facultyId);

    try {
      // const admin = await Admin.findOne({
      //   where: {
      //     id: id,
      //   },
      // });

      // if (admin)

      if (true) {
        // if (id != admin.id) {
        //   throw new Error("Invalid Admin Id");
        // }
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
        delete: false,
      });
    }
  };
  static registerFaculty = async (req, res) => {
    const {
      email,
      password,
      name,
      department,
      roles,
      role,
      id,
      departmentId,
      designation,
    } = req.body;

    console.log(req.body, "REGISTER");
    try {
      // const admin = await Admin.findOne({
      //   where: {
      //     id: id,
      //   },
      // });
      // if (admin)
      const hashedPass = await hashPassword(password);
      if (true) {
        // if (id != admin.id) {
        //   throw new Error("Invalid Admin Id");
        // }

        const defaultRole = await Role.findOne({
          where: {
            title: "SUPERVISOR",
          },
        });
        console.log(defaultRole.dataValues);
        // const tempRoles = facultyRoles.map(role => role.dataValues.title);
        const dept = await Department.findOne({
          where: {
            id: departmentId,
          },
        });
        console.log("On DEPT");
        console.log("DEPT", dept.dataValues);
        if (!dept) throw new Error("Invalid Department Id");
        const facultyMember = await FacultyMember.create({
          email,
          password: hashedPass,
          name,
          designation,
          departmentId: dept.id,
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

        if (facultyMember) {
          sendMail(
            null,
            [facultyMember].map(faculty => {
              return {
                // email: faculty.dataValues.email,
                email: "18094198-079@uog.edu.pk",
                subject: "Faculty Member Registration",
                body: `
                
                 Your account has been created, successfully.
                    
                 Your credentials are: 
                    Email: ${faculty.dataValues.email}
                    Password:${hashedPass}
                 `,
              };
            })
          );
        }

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
        attributes: [
          "id",
          "name",
          "email",
          "committeeId",
          "departmentId",
          "password",
          "designation",
        ],
      });
      await Promise.all(
        supervisors.map(async supervisor => {
          const department = await Department.findOne({
            where: {
              id: supervisor.dataValues.departmentId,
            },
          });
          if (department)
            supervisor.dataValues.department = department.dataValues.name;
          else supervisor.dataValues.department = null;
          return supervisor;
        })
      );
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
  static getAllSupervisorsOnly = async (req, res) => {
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
        attributes: ["id", "name", "email", "committeeId", "departmentId"],
      });
      await Promise.all(
        supervisors.map(async supervisor => {
          const department = await Department.findOne({
            where: {
              id: supervisor.dataValues.departmentId,
            },
          });
          supervisor.dataValues.department = department.dataValues.name;
          return supervisor;
        })
      );
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

  static getAllSupervisorsList = async (req, res) => {
    // res.send(req.body);
    try {
      const faculty = await FacultyMember.findAll({
        // where: {
        //   pmoOfDepartmentId: null,
        // },
      });
      res.json({
        message: "Supervisors retrieved successfully",
        faculty,
        fetched: true,
      });
    } catch (error) {
      res.json({
        error: error,
        fetched: false,
        message: "Unable to fetch supervisors",
      });
    }
  };

  static updateFaculty = async (req, res) => {
    const {
      id,
      name,
      email,
      password,
      departmentId,
      committeeId,
      designation,
    } = req.body;
    try {
      const faculty = await FacultyMember.findOne({
        where: {
          id: id,
        },
      });
      const hashedPass = await hashPassword(password);
      if (faculty) {
        await faculty.update({
          name: name ? name : faculty.dataValues.name,
          password: password ? hashedPass : faculty.dataValues.password,
          designation: designation
            ? designation
            : faculty.dataValues.designation,
          departmentId: departmentId
            ? departmentId
            : faculty.dataValues.departmentId,
          committeeId: committeeId
            ? committeeId
            : faculty.dataValues.committeeId,
        });

        sendMail(
          null,
          [faculty].map(faculty => {
            return {
              // email: faculty.dataValues.email,
              email: "18094198-079@uog.edu.pk",
              subject: "Faculty Member Registration",
              body: `
              
               Your account has been updated, successfully.
                  
               Your credentials are: 
                  Email: ${faculty.dataValues.email}
                  Password:${faculty.dataValues.password}
               `,
            };
          })
        );

        res.json({
          message: "Faculty updated successfully",
          faculty,
        });
      } else {
        throw new Error("Invalid Faculty Id");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error updating faculty",
        error: err,
      });
    }
  };
  static updateEmailPassword = async (req, res) => {
    const { userId, mailPassword } = req.body;
    try {
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const hashedPass = await hashPassword(mailPassword);
      if (faculty) {
        await faculty.update({
          mailPassword: mailPassword
            ? mailPassword
            : faculty.dataValues.mailPassword,
        });

        // sendMail(
        //   [faculty].map(faculty => {
        //     return {
        //       // email: faculty.dataValues.email,
        //       email: "18094198-079@uog.edu.pk",
        //       subject: "Faculty Member Registration",
        //       body: `

        //        Your account has been updated, successfully.

        //        Your credentials are:
        //           Email: ${faculty.dataValues.email}
        //           Password:${faculty.dataValues.password}
        //        `,
        //     };
        //   })
        // );

        res.json({
          message: "Password updated successfully",
          mail: true,
          faculty,
        });
      } else {
        throw new Error("Invalid Faculty Id");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error updating faculty",
        error: err,
      });
    }
  };
  static changePassword = async (req, res) => {
    const { userId, password } = req.body;
    try {
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const hashedPass = await hashPassword(password);
      if (faculty) {
        await faculty.update({
          password: password ? hashedPass : faculty.dataValues.password,
          first_login: false,
        });

        // sendMail(
        //   [faculty].map(faculty => {
        //     return {
        //       // email: faculty.dataValues.email,
        //       email: "18094198-079@uog.edu.pk",
        //       subject: "Faculty Member Registration",
        //       body: `

        //        Your account has been updated, successfully.

        //        Your credentials are:
        //           Email: ${faculty.dataValues.email}
        //           Password:${faculty.dataValues.password}
        //        `,
        //     };
        //   })
        // );

        res.json({
          message: "Password updated successfully",
          mail: true,
          faculty,
        });
      } else {
        throw new Error("Invalid Faculty Id");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error updating faculty",
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
