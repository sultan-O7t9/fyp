const {
  FacultyMember,
  Department,
  Group,
  Committee,
  Student,
  Role,
  Faculty_Role,
  EvaluationSchedule,
  Version,
} = require("../models");
const sequelize = require("sequelize");

class CommitteeClass {
  static getAllCommittees = async (req, res) => {
    // TODO:
    //in req.user: PMO.id
    //in res
    // [{
    //     id,department,members,group
    // }]
    try {
      const pmo = await FacultyMember.findOne({
        where: {
          id: req.user.id,
        },
      });
      const committees = await Committee.findAll({
        where: {
          departmentId: pmo.dataValues.departmentId,
        },
      });

      const detailedCommittees = await Promise.all(
        committees.map(async committee => {
          const members = await FacultyMember.findAll({
            where: {
              committeeId: committee.dataValues.id,
            },
          });
          const groups = await Group.findAll({
            where: {
              committeeId: committee.dataValues.id,
            },
          });
          const Groups = await Promise.all(
            groups.map(async group => {
              const schedules = await EvaluationSchedule.findAll({
                where: {
                  groupId: group.dataValues.id,
                },
              });
              const versions = await Version.findAll({
                where: {
                  groupId: group.dataValues.id,
                },
              });

              const members = await Student.findAll({
                where: {
                  groupId: group.dataValues.id,
                },
              });
              return {
                id: group.dataValues.id,
                name: group.dataValues.name,
                members: members.map(member => ({
                  rollNo: member.dataValues.rollNo,
                  name: member.dataValues.name,
                })),
                versions: versions.length
                  ? versions.map(version => ({
                      id: version.dataValues.id,
                      deliverableId: version.dataValues.deliverableId,

                      eval_status: version.dataValues.eval_status,
                      status: version.dataValues.status,
                    }))
                  : [],

                schedules: {
                  d1: schedules.find(
                    schedule => schedule.dataValues.deliverableId == 1
                  )
                    ? true
                    : false,
                  d2: schedules.find(
                    schedule => schedule.dataValues.deliverableId == 2
                  )
                    ? true
                    : false,
                  d3: schedules.find(
                    schedule => schedule.dataValues.deliverableId == 3
                  )
                    ? true
                    : false,
                },
              };
            })
          );

          return {
            id: committee.dataValues.id,
            name: committee.dataValues.name,
            members: members,
            Groups: Groups,
          };
        })
      );

      res.json({ committees: detailedCommittees });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  static createCommittee = async (req, res) => {
    // TODO:
    //in req.user: PMO.id
    // in req.body:
    // {members: [id],
    // groups: [name]}
    //in res
    // {
    //     id: comittee.name,
    //     department:Pmo Department,
    //     members:[{name:"",email:"",id}],
    //     groups:[{name:"",id}],
    // }

    //get PMO from id, and depratment name from departmentId
    //set comittee name to random
    //set comittee Id in groups to comittee.id where groups.name in req.body.groups
    //set comittee Id in facultymembers to comittee.id where members.id in req.body.members
    //set committee name to c_department.name_comittee.id
    try {
      const pmo = await FacultyMember.findOne({
        where: {
          id: req.user.id,
        },
      });
      const department = await Department.findOne({
        where: {
          id: pmo.dataValues.departmentId,
        },
      });
      const comittee = await Committee.create({
        name: `${department.dataValues.name}_${Math.floor(
          Math.random() * 100
        )}_${new Date().getTime()}`,
        departmentId: department.dataValues.id,
      });
      await comittee.update({
        name: `C_${department.dataValues.name}_${comittee.dataValues.id}`,
        departmentId: department.dataValues.id,
      });

      const groups = await Group.findAll({
        where: {
          name: {
            [sequelize.Op.in]: req.body.groups,
          },
        },
      });
      const students = await Student.findAll({
        where: {
          groupId: {
            [sequelize.Op.in]: groups.map(group => group.dataValues.id),
          },
        },
      });

      const members = await FacultyMember.findAll({
        where: {
          id: {
            [sequelize.Op.in]: req.body.members,
          },
        },
      });
      const evaluatorRole = await Role.findOne({
        where: {
          title: "EVALUATOR",
        },
      });
      await Promise.all(
        members.map(async member => {
          await Faculty_Role.create({
            facultyId: member.dataValues.id,
            roleId: evaluatorRole.dataValues.id,
          });
        })
      );

      await Promise.all(
        groups.map(async group => {
          await group.update({
            committeeId: comittee.dataValues.id,
          });
        })
      );

      // groups.forEach(group => {
      //   group.update({
      //     committeeId: comittee.id,
      //   });
      // });
      await Promise.all(
        students.map(async student => {
          await student.update({
            committeeId: comittee.dataValues.id,
          });
        })
      );
      // students.forEach(student => {
      //   student.update({
      //     committeeId: comittee.id,
      //   });
      // });

      await Promise.all(
        members.map(async member => {
          await member.update({
            committeeId: comittee.dataValues.id,
          });
        })
      );
      // members.forEach(member => {
      //   member.update({
      //     committeeId: comittee.id,
      //   });
      // });

      res.json({
        message: "Committee created successfully",
        comittee,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error creating committee",
        error,
      });
    }
  };

  static updateCommittee = async (req, res) => {
    //reset everything related to that committee
    //then reassign everything according to req.body
    // we get members[id], groups[name], committee.id from req.body
    try {
      const committee = await Committee.findOne({
        where: {
          id: req.body.committeeId,
        },
      });
      const groups = await Group.findAll({
        where: {
          committeeId: req.body.committeeId,
        },
      });
      for (let i = 0; i < groups.length; i++) {
        await groups[i].update({
          committeeId: null,
        });
      }

      // await Promise.all(
      //   groups.map(async group => {
      //     await group.update({
      //       committeeId: null,
      //     });
      //   })
      // );
      // groups.forEach(async group => {
      //   await group.update({
      //     committeeId: null,
      //   });
      // });

      // console.log(newGroups);

      const students = await Student.findAll({
        where: {
          committeeId: req.body.committeeId,
        },
      });
      await Promise.all(
        students.map(async student => {
          await student.update({
            committeeId: null,
          });
        })
      );

      // students.forEach(async student => {
      //   await student.update({
      //     committeeId: null,
      //   });
      // });

      const members = await FacultyMember.findAll({
        where: {
          committeeId: req.body.committeeId,
        },
      });
      await Promise.all(
        members.map(async member => {
          await member.update({
            committeeId: null,
          });
        })
      );

      // members.forEach(async member => {
      //   await member.update({
      //     committeeId: null,
      //   });
      // });
      const evaluatorRole = await Role.findOne({
        where: {
          title: "EVALUATOR",
        },
      });

      const membersRole = await Faculty_Role.findAll({
        where: {
          facultyId: {
            [sequelize.Op.in]: members.map(member => member.dataValues.id),
          },
          roleId: evaluatorRole.dataValues.id,
        },
      });
      await Promise.all(
        membersRole.map(async memberRole => {
          await memberRole.destroy();
        })
      );

      // membersRole.forEach(async memberRole => {
      //   await memberRole.destroy();
      // });

      const newMembers = await FacultyMember.findAll({
        where: {
          id: {
            [sequelize.Op.in]: req.body.members,
          },
        },
      });
      await Promise.all(
        newMembers.map(async newMember => {
          await newMember.update({
            committeeId: req.body.committeeId,
          });
        })
      );
      // newMembers.forEach(async member => {
      //   await member.update({
      //     committeeId: req.body.committeeId,
      //   });
      // });
      await Promise.all(
        newMembers.map(async newMember => {
          await Faculty_Role.create({
            facultyId: newMember.dataValues.id,
            roleId: evaluatorRole.dataValues.id,
          });
        })
      );
      // newMembers.forEach(async member => {
      //   await Faculty_Role.create({
      //     facultyId: member.dataValues.id,
      //     roleId: evaluatorRole.dataValues.id,
      //   });
      // });

      const newGroups = await Group.findAll({
        where: {
          name: {
            [sequelize.Op.in]: req.body.groups,
          },
        },
      });
      await Promise.all(
        newGroups.map(async newGroup => {
          await newGroup.update({
            committeeId: req.body.committeeId,
          });
        })
      );
      console.log(newGroups);
      // newGroups.forEach(async group => {
      //   await group.update({
      //     committeeId: req.body.committeeId,
      //   });
      // });
      const newStudents = await Student.findAll({
        where: {
          groupId: {
            [sequelize.Op.in]: newGroups.map(group => group.dataValues.id),
          },
        },
      });
      await Promise.all(
        newStudents.map(async newStudent => {
          await newStudent.update({
            committeeId: req.body.committeeId,
          });
        })
      );
      // newStudents.forEach(async student => {
      //   await student.update({
      //     committeeId: req.body.committeeId,
      //   });
      // });

      res.json({
        message: "Committee updated successfully",
        committee: {
          name: committee.dataValues.name,
          id: committee.dataValues.id,
          groups: newGroups.map(group => group.dataValues.name),
          members: newMembers.map(member => member.dataValues.id),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error updating committee",
        error,
      });
    }
  };

  static deleteCommittee = async (req, res) => {
    try {
      const committee = await Committee.findOne({
        where: {
          id: req.params.id,
        },
      });
      const groups = await Group.findAll({
        where: {
          committeeId: req.params.id,
        },
      });
      await Promise.all(
        groups.map(async group => {
          await group.update({
            committeeId: null,
          });
          const schedules = await EvaluationSchedule.findAll({
            where: {
              groupId: group.dataValues.id,
            },
          });
          console.log(
            schedules.map(schedule => ({
              id: schedule.dataValues.id,
              groupId: schedule.dataValues.groupId,
            }))
          );
          await Promise.all(
            schedules.map(async schedule => {
              await schedule.destroy();
            })
          );
        })
      );
      // groups.forEach(async group => {
      //   await group.update({
      //     committeeId: null,
      //   });
      // });
      const students = await Student.findAll({
        where: {
          committeeId: req.params.id,
        },
      });
      await Promise.all(
        students.map(async student => {
          await student.update({
            committeeId: null,
          });
        })
      );

      // students.forEach(async student => {
      //   await student.update({
      //     committeeId: null,
      //   });
      // });
      const members = await FacultyMember.findAll({
        where: {
          committeeId: req.params.id,
        },
      });
      await Promise.all(
        members.map(async member => {
          await member.update({
            committeeId: null,
          });
        })
      );
      // members.forEach(async member => {

      //   await member.update({
      //     committeeId: null,
      //   });
      // });
      const evaluatorRole = await Role.findOne({
        where: {
          title: "EVALUATOR",
        },
      });
      const membersRole = await Faculty_Role.findAll({
        where: {
          facultyId: {
            [sequelize.Op.in]: members.map(member => member.dataValues.id),
          },
          roleId: evaluatorRole.dataValues.id,
        },
      });
      await Promise.all(
        membersRole.map(async memberRole => {
          await memberRole.destroy();
        })
      );

      // membersRole.forEach(async memberRole => {
      //   await memberRole.destroy();
      // });
      await committee.destroy();
      res.json({
        delete: true,
        message: "Committee deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error deleting committee",
        error,
      });
    }
  };
}

module.exports = CommitteeClass;
