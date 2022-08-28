const sequelize = require("sequelize");

const { Semester, Group } = require("../models");

// Router.post("/current", Semester.setCurrentSemester);

class SemesterController {
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
