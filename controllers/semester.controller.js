const sequelize = require("sequelize");

const { Semester, Group, FacultyMember, Student } = require("../models");
const { sendMail } = require("../utils/sendMails");

// Router.post("/current", Semester.setCurrentSemester);

class SemesterController {
  static sendMailToStudents = async (req, res) => {
    const { message, subject, groups, userId } = req.body;
    try {
      const students = await Student.findAll({
        where: {
          groupId: {
            [sequelize.Op.in]: groups,
          },
        },
      });
      const faculty = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });

      sendMail(
        students.map(student => {
          return {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            subject: subject,
            body: `
          ${message}


          Regards,
          ${faculty.dataValues.name}
          `,
          };
        })
      );

      res.json({
        message: "Mail sent successfully",
        mail: true,
        students,
      });
    } catch (err) {
      res.json({
        message: "Error in sending mail",
        err,
      });
    }
  };
  static updateGroupSemester = async (req, res) => {
    const { groups, semesterId } = req.body;
    try {
      //   await Group.updateMany(
      //     { semesterId: semesterId },
      //     {
      //       where: {
      //         id: {
      //           [sequelize.Op.in]: groups,
      //         },
      //       },
      //     }
      //   );

      //   const newGroups = await Group.findAll({
      //     where: {
      //       name: {
      //         [sequelize.Op.in]: groups,
      //       },
      //     },
      //   });
      //   await Promise.all(
      //     newGroups.map(async newGroup => {
      //       await newGroup.update({
      //         semesterId: semesterId,
      //       });
      //     })
      //   );
      await Promise.all(
        groups.map(async group => {
          const grp = await Group.findOne({
            where: {
              id: group,
            },
          });
          if (grp) {
            await grp.update({
              semesterId: semesterId,
            });
          }
        })
      );
      console.log("updated");
      res.json({
        message: "Groups updated successfully",
        update: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating semester" });
    }
  };
  static createSemester = async (req, res) => {
    const { title } = req.body;
    try {
      const semester = await Semester.create({
        title,
      });
      res.json({
        message: "Semester created successfully",
        create: true,
        semester,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating semester",
        error,
        create: false,
      });
    }
  };
  static getSemestersWithGroups = async (req, res) => {
    try {
      const semesters = await Semester.findAll();
      if (semesters) {
        const groups = await Group.findAll({
          attributes: ["id", "name", "semesterId"],
        });
        res.json({
          message: "Semesters retrieved successfully",
          get: true,
          semesters: semesters.map(semester => {
            return {
              ...semester.dataValues,
              groups: groups.filter(group => group.semesterId === semester.id),
              // .concat([
              //   {
              //     id: null,
              //     name: "All",
              //   },
              // ]),
            };
          }),
        });
      } else {
        res.json({
          message: "No semesters found",
          get: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error getting semesters",
        error,
        get: false,
      });
    }
  };
  static getAllSemesters = async (req, res) => {
    try {
      const semesters = await Semester.findAll();
      res.json({
        message: "Semesters retrieved successfully",
        get: true,
        semesters,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting semesters",
        error,
        get: false,
      });
    }
  };
  static getCurrentSemester = async (req, res) => {
    try {
      const semester = await Semester.findOne({
        where: {
          current: true,
        },
      });
      res.json({
        message: "Semesters retrieved successfully",
        get: true,
        semester,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error getting semesters",
        error,
        get: false,
      });
    }
  };
  static setCurrentSemester = async (req, res) => {
    const { semesterId } = req.body;
    try {
      const previousSemester = await Semester.findAll({
        where: {
          current: true,
        },
      });
      if (previousSemester) {
        await Promise.all(
          previousSemester.map(async semester => {
            await semester.update({
              current: false,
            });
          })
        );
      }
      const semester = await Semester.findOne({
        where: {
          id: semesterId,
        },
      });
      if (semester) {
        await semester.update({
          current: true,
        });
      } else {
        throw new Error("Semester not found");
      }
      res.json({
        message: "Semester set as current successfully",
        set: true,
        semester,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error setting current semester",
        error,
        set: false,
      });
    }
  };
}
module.exports = SemesterController;
