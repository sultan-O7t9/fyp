const sequelize = require("sequelize");
const {
  Evaluation,
  EvaluationType,
  EvaluationSchedule,
  FacultyMember,
  Committee,
  Student,
  Group,
  Project,
  ProposalEvaluation,
  D2Evaluation,
  D3Evaluation,
  SupervisorEvaluation,
  PmoEvaluation,
} = require("../models");

class EvaluationController {
  static getPMOEvaluationByGroup = async (req, res) => {
    const { groupId, projectId } = req.body;
    try {
      //get evaluation type
      const evaluationType = await EvaluationType.findOne({
        where: {
          name: "Project Management Office",
        },
      });
      //get evaluation
      const evaluation = await Evaluation.findOne({
        where: {
          groupId: groupId,
          projectId: projectId,
          evaluationTypeId: evaluationType.id,
        },
      });
      if (evaluation)
        res.status(200).json({
          evaluation: {
            ...evaluation.dataValues,
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
          message: "Evaluation retrieved successfully",
          get: true,
        });
      else
        res.status(200).json({
          message: "Evaluation not found",
          get: false,
          evaluation: {
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getSupervisorEvaluationByGroup = async (req, res) => {
    const { groupId, projectId } = req.body;
    try {
      //get evaluation type
      const evaluationType = await EvaluationType.findOne({
        where: {
          name: "Supervisor",
        },
      });
      //get evaluation
      const evaluation = await Evaluation.findOne({
        where: {
          groupId: groupId,
          projectId: projectId,
          evaluationTypeId: evaluationType.id,
        },
      });
      if (evaluation)
        res.status(200).json({
          evaluation: {
            ...evaluation.dataValues,
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
          message: "Evaluation retrieved successfully",
          get: true,
        });
      else
        res.status(200).json({
          message: "Evaluation not found",
          get: false,
          evaluation: {
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static createSchedule = async (req, res) => {
    const { groups, date, deliverableId } = req.body;
    try {
      const schedules = [];
      for (let i = 0; i < groups.length; i++) {
        const schedule = await EvaluationSchedule.create({
          groupId: groups[i],
          date: date,
          deliverableId: deliverableId,
        });
        schedules.push(schedule);
      }

      res.status(200).json({
        message: "Schedule created successfully",
        create: true,
        schedules,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getAllSchedulesByDeliverable = async (req, res) => {
    const { deliverableId, userId } = req.body;
    try {
      const pmo = await FacultyMember.findOne({
        where: {
          id: userId,
        },
      });
      const groups = await Group.findAll({
        where: {
          departmentId: pmo.departmentId,
        },
      });
      if (groups.length > 0) {
        const schedules = [];
        for (let i = 0; i < groups.length; i++) {
          const schedule = await EvaluationSchedule.findOne({
            where: {
              groupId: groups[i].id,
              deliverableId: deliverableId,
            },
          });
          // schedules.push(schedule);
          const committee = await Committee.findOne({
            where: {
              id: groups[i].committeeId,
            },
          });
          const project = await Project.findOne({
            where: {
              id: groups[i].projectId,
            },
          });
          const supervisor = await FacultyMember.findOne({
            where: {
              id: groups[i].supervisorId,
            },
          });
          let evaluators;
          if (committee && committee.id)
            evaluators = await FacultyMember.findAll({
              where: {
                committeeId: committee.id,
              },
            });
          const groupMembers = await Student.findAll({
            where: {
              groupId: groups[i].id,
            },
          });
          if (schedule)
            schedules.push({
              date: schedule.date,
              id: schedule.id,
              deliverableId: schedule.deliverableId,
              committee: {
                id: committee ? committee.id : null,
                name: committee ? committee.name : null,
                evaluators: committee
                  ? evaluators.map(evaluator => ({
                      id: evaluator.id,
                      name: evaluator.name,
                    }))
                  : [],
              },
              project: {
                id: project ? project.id : null,
                name: project ? project.title : null,
              },
              group: {
                id: groups[i].id,
                name: groups[i].name,
                supervisor: {
                  id: supervisor ? supervisor.id : null,
                  name: supervisor ? supervisor.name : null,
                },
                groupMembers: groupMembers.map(member => ({
                  rollNo: member.rollNo,
                  name: member.name,
                })),
              },
            });
        }
        res.status(200).json({
          message: "Schedules retrieved successfully",
          get: true,
          schedules,
        });
      } else {
        res.status(200).json({
          message: "Schedules not found",
          get: false,
          schedules: [],
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
      const schedule = await EvaluationSchedule.findOne({
        where: {
          id,
        },
      });
      if (schedule) {
        await EvaluationSchedule.destroy({
          where: {
            id,
          },
        });
        res.status(200).json({
          message: "Schedule deleted successfully",
          delete: true,
        });
      } else {
        res.status(200).json({
          message: "Schedule not found",
          delete: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        delete: false,
      });
    }
  };

  static updatePMOEvaluationByGroup = async (req, res) => {
    const { groupId, projectId, marksObtained, totalMarks } = req.body;
    try {
      //get evaluation type
      const evaluationType = await EvaluationType.findOne({
        where: {
          name: "Project Management Office",
        },
      });
      //get evaluation
      const evaluation = await Evaluation.findOne({
        where: {
          groupId: groupId,
          projectId: projectId,
          evaluationTypeId: evaluationType.id,
        },
      });
      if (evaluation) {
        await evaluation.update({
          marks: marksObtained,
          totalMarks: totalMarks,
        });

        res.status(200).json({
          evaluation: {
            ...evaluation.dataValues,
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
          message: "Evaluation updated successfully",
          create: false,
        });
      } else {
        const newEval = await Evaluation.create({
          groupId: groupId,
          projectId: projectId,
          marks: marksObtained,
          totalMarks: totalMarks,
          evaluationTypeId: evaluationType.id,
        });

        res.status(200).json({
          message: "Evaluation created successfully ",
          create: true,
          evaluation: {
            ...newEval.dataValues,
            type: evaluationType.name,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static updateSupervisorEvaluationByGroup = async (req, res) => {
    const { groupId, projectId, marksObtained, totalMarks } = req.body;
    try {
      //get evaluation type
      const evaluationType = await EvaluationType.findOne({
        where: {
          name: "Supervisor",
        },
      });
      //get evaluation
      const evaluation = await Evaluation.findOne({
        where: {
          groupId: groupId,
          projectId: projectId,
          evaluationTypeId: evaluationType.id,
        },
      });
      if (evaluation) {
        await evaluation.update({
          marks: marksObtained,
          totalMarks: totalMarks,
        });

        res.status(200).json({
          evaluation: {
            ...evaluation.dataValues,
            totalMarks: evaluationType.totalMarks,
            type: evaluationType.name,
          },
          message: "Evaluation updated successfully",
          create: false,
        });
      } else {
        const newEval = await Evaluation.create({
          groupId: groupId,
          projectId: projectId,
          marks: marksObtained,
          totalMarks: totalMarks,
          evaluationTypeId: evaluationType.id,
        });

        res.status(200).json({
          message: "Evaluation created successfully ",
          create: true,
          evaluation: {
            ...newEval.dataValues,
            type: evaluationType.name,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static handlePmoEvaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const evalData = req.body;
    try {
      const groupId = evalData.groupId;
      const evaluations = await PmoEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      if (evaluations.length > 0) {
        await PmoEvaluation.destroy({
          where: {
            groupId: groupId,
          },
        });
      }
      for (let i = 0; i < evalData.students.length; i++) {
        const evaluation = await PmoEvaluation.create({
          groupId: groupId,
          studentId: evalData.students[i].rollNo,
          remarks: evalData.remarks,
          marks: evalData.students[i].marks,
        });
      }
      res.status(200).json({
        message: "Evaluation created successfully",
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getPmoEvaulation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const { groupId } = req.body;

    try {
      const students = await Student.findAll({
        where: {
          groupId: groupId,
        },
      });
      const pmoEvals = await PmoEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      console.log(pmoEvals.length);

      res.status(200).json({
        proposal: true,
        group: {
          groupId: pmoEvals[0] ? pmoEvals[0].groupId : groupId,
          remarks: pmoEvals[0] ? pmoEvals[0].remarks : "",
          students: pmoEvals.length
            ? pmoEvals.map(evaluation => {
                return {
                  rollNo: evaluation.studentId,
                  marks: evaluation.marks,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  marks: 0,
                };
              }),
        },
      });
      return;
      // } else {
      //   res.json({
      //     proposal: false,
      //     group: {
      //       groupId,
      //       remarks: "",
      //       students: students.map(student => {
      //         return {
      //           rollNo: student.rollNo,
      //           existingSystem: 0,
      //           architecture: 0,
      //           pptSkills: 0,
      //           goals: 0,
      //         };
      //       }),
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static handleSupervisorEvaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const evalData = req.body;
    try {
      const groupId = evalData.groupId;
      const evaluations = await SupervisorEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      if (evaluations.length > 0) {
        await SupervisorEvaluation.destroy({
          where: {
            groupId: groupId,
          },
        });
      }
      for (let i = 0; i < evalData.students.length; i++) {
        const evaluation = await SupervisorEvaluation.create({
          groupId: groupId,
          studentId: evalData.students[i].rollNo,
          remarks: evalData.remarks,
          marks: evalData.students[i].marks,
        });
      }
      res.status(200).json({
        message: "Evaluation created successfully",
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getSupervisorEvaulation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const { groupId } = req.body;

    try {
      const students = await Student.findAll({
        where: {
          groupId: groupId,
        },
      });
      const superEvals = await SupervisorEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      console.log(superEvals.length);

      res.status(200).json({
        proposal: true,
        group: {
          groupId: superEvals[0] ? superEvals[0].groupId : groupId,
          remarks: superEvals[0] ? superEvals[0].remarks : "",
          students: superEvals.length
            ? superEvals.map(evaluation => {
                return {
                  rollNo: evaluation.studentId,
                  marks: evaluation.marks,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  marks: 0,
                };
              }),
        },
      });
      return;
      // } else {
      //   res.json({
      //     proposal: false,
      //     group: {
      //       groupId,
      //       remarks: "",
      //       students: students.map(student => {
      //         return {
      //           rollNo: student.rollNo,
      //           existingSystem: 0,
      //           architecture: 0,
      //           pptSkills: 0,
      //           goals: 0,
      //         };
      //       }),
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static handleProposalEvaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const evalData = req.body;
    try {
      const groupId = evalData.groupId;
      const evaluations = await ProposalEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      if (evaluations.length > 0) {
        await ProposalEvaluation.destroy({
          where: {
            groupId: groupId,
          },
        });
      }
      for (let i = 0; i < evalData.students.length; i++) {
        const evaluation = await ProposalEvaluation.create({
          groupId: groupId,
          studentId: evalData.students[i].rollNo,
          remarks: evalData.remarks,
          existingSystem: evalData.students[i].existingSystem,
          goals: evalData.students[i].goals,
          architecture: evalData.students[i].architecture,
          pptSkills: evalData.students[i].pptSkills,
        });
      }
      res.status(200).json({
        message: "Evaluation created successfully",
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getProposalEvaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const { groupId } = req.body;

    try {
      const students = await Student.findAll({
        where: {
          groupId: groupId,
        },
      });
      const proposalEvaluations = await ProposalEvaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      console.log(proposalEvaluations.length);

      res.status(200).json({
        proposal: true,
        group: {
          groupId: proposalEvaluations[0]
            ? proposalEvaluations[0].groupId
            : groupId,
          remarks: proposalEvaluations[0] ? proposalEvaluations[0].remarks : "",
          students: proposalEvaluations.length
            ? proposalEvaluations.map(evaluation => {
                return {
                  rollNo: evaluation.studentId,
                  goals: evaluation.goals,
                  architecture: evaluation.architecture,
                  pptSkills: evaluation.pptSkills,
                  existingSystem: evaluation.existingSystem,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  goals: 0,
                  architecture: 0,
                  pptSkills: 0,
                  existingSystem: 0,
                };
              }),
        },
      });
      return;
      // } else {
      //   res.json({
      //     proposal: false,
      //     group: {
      //       groupId,
      //       remarks: "",
      //       students: students.map(student => {
      //         return {
      //           rollNo: student.rollNo,
      //           existingSystem: 0,
      //           architecture: 0,
      //           pptSkills: 0,
      //           goals: 0,
      //         };
      //       }),
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static handleD2Evaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const evalData = req.body;
    try {
      const groupId = evalData.groupId;
      const evaluations = await D2Evaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      if (evaluations.length > 0) {
        await D2Evaluation.destroy({
          where: {
            groupId: groupId,
          },
        });
      }
      for (let i = 0; i < evalData.students.length; i++) {
        const evaluation = await D2Evaluation.create({
          groupId: groupId,
          studentId: evalData.students[i].rollNo,
          reqRemarks: evalData.remarks.reqRemarks,
          designRemarks: evalData.remarks.designRemarks,
          sysRemarks: evalData.remarks.sysRemarks,
          funcReqs: evalData.students[i].funcReqs,
          interfaces: evalData.students[i].interfaces,
          usecaseDesc: evalData.students[i].usecaseDesc,
          usecaseDia: evalData.students[i].usecaseDia,
          nonFuncReqs: evalData.students[i].nonFuncReqs,
          domainDia: evalData.students[i].domainDia,
          classDia: evalData.students[i].classDia,
          sequenceDia: evalData.students[i].sequenceDia,
          stateChartDia: evalData.students[i].stateChartDia,
          collabDia: evalData.students[i].collabDia,
          sysPrototype: evalData.students[i].sysPrototype,
        });
      }
      res.status(200).json({
        message: "Evaluation created successfully",
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getD2Evaulation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const { groupId } = req.body;

    try {
      const students = await Student.findAll({
        where: {
          groupId: groupId,
        },
      });
      const d2Evaluations = await D2Evaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      console.log(d2Evaluations.length);

      res.status(200).json({
        proposal: true,
        group: {
          groupId: d2Evaluations[0] ? d2Evaluations[0].groupId : groupId,
          remarks: {
            reqRemarks: d2Evaluations[0] ? d2Evaluations[0].reqRemarks : "",
            designRemarks: d2Evaluations[0]
              ? d2Evaluations[0].designRemarks
              : "",
            sysRemarks: d2Evaluations[0] ? d2Evaluations[0].sysRemarks : "",
          },
          students: d2Evaluations.length
            ? d2Evaluations.map(evaluation => {
                return {
                  rollNo: evaluation.studentId,
                  funcReqs: evaluation.funcReqs,
                  interfaces: evaluation.interfaces,
                  usecaseDesc: evaluation.usecaseDesc,
                  usecaseDia: evaluation.usecaseDia,
                  nonFuncReqs: evaluation.nonFuncReqs,
                  domainDia: evaluation.domainDia,
                  classDia: evaluation.classDia,
                  sequenceDia: evaluation.sequenceDia,
                  stateChartDia: evaluation.stateChartDia,
                  collabDia: evaluation.collabDia,
                  sysPrototype: evaluation.sysPrototype,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  funcReqs: 0,
                  interfaces: 0,
                  usecaseDesc: 0,
                  usecaseDia: 0,
                  nonFuncReqs: 0,
                  domainDia: 0,
                  classDia: 0,
                  sequenceDia: 0,
                  stateChartDia: 0,
                  collabDia: 0,
                  sysPrototype: 0,
                };
              }),
        },
      });
      return;
      // } else {
      //   res.json({
      //     proposal: false,
      //     group: {
      //       groupId,
      //       remarks: "",
      //       students: students.map(student => {
      //         return {
      //           rollNo: student.rollNo,
      //           existingSystem: 0,
      //           architecture: 0,
      //           pptSkills: 0,
      //           goals: 0,
      //         };
      //       }),
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static handleD3Evaluation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const evalData = req.body;
    try {
      const groupId = evalData.groupId;
      const evaluations = await D3Evaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      if (evaluations.length > 0) {
        await D3Evaluation.destroy({
          where: {
            groupId: groupId,
          },
        });
      }
      for (let i = 0; i < evalData.students.length; i++) {
        const evaluation = await D3Evaluation.create({
          groupId: groupId,
          studentId: evalData.students[i].rollNo,
          codeRemarks: evalData.remarks.codeRemarks,
          testRemarks: evalData.remarks.testRemarks,
          overallRemarks: evalData.remarks.overallRemarks,
          runProject: evalData.students[i].runProject,
          codeModify: evalData.students[i].codeModify,
          testPlan: evalData.students[i].testPlan,
          testCase: evalData.students[i].testCase,
          projectPpt: evalData.students[i].projectPpt,
          userMan: evalData.students[i].userMan,
          stdTemp: evalData.students[i].stdTemp,
          skill: evalData.students[i].skill,
        });
      }
      res.status(200).json({
        message: "Evaluation created successfully",
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
  static getD3Evaulation = async (req, res) => {
    //TODO: first of all get data
    // Create a proposal evaluation Table
    // Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
    // I will get a groupId
    // find students in that groupId
    const { groupId } = req.body;

    try {
      const students = await Student.findAll({
        where: {
          groupId: groupId,
        },
      });
      const d3Evaluations = await D3Evaluation.findAll({
        where: {
          groupId: groupId,
        },
      });
      console.log(d3Evaluations.length);

      res.status(200).json({
        proposal: true,
        group: {
          groupId: d3Evaluations[0] ? d3Evaluations[0].groupId : groupId,
          remarks: {
            codeRemarks: d3Evaluations[0] ? d3Evaluations[0].codeRemarks : "",
            testRemarks: d3Evaluations[0] ? d3Evaluations[0].testRemarks : "",
            overallRemarks: d3Evaluations[0]
              ? d3Evaluations[0].overallRemarks
              : "",
          },
          students: d3Evaluations.length
            ? d3Evaluations.map(evaluation => {
                return {
                  rollNo: evaluation.studentId,
                  runProject: evaluation.runProject,
                  codeModify: evaluation.codeModify,
                  testPlan: evaluation.testPlan,
                  testCase: evaluation.testCase,
                  projectPpt: evaluation.projectPpt,
                  userMan: evaluation.userMan,
                  stdTemp: evaluation.stdTemp,
                  skill: evaluation.skill,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  runProject: 0,
                  codeModify: 0,
                  testPlan: 0,
                  testCase: 0,
                  projectPpt: 0,
                  userMan: 0,
                  stdTemp: 0,
                  skill: 0,
                };
              }),
        },
      });
      return;
      // } else {
      //   res.json({
      //     proposal: false,
      //     group: {
      //       groupId,
      //       remarks: "",
      //       students: students.map(student => {
      //         return {
      //           rollNo: student.rollNo,
      //           existingSystem: 0,
      //           architecture: 0,
      //           pptSkills: 0,
      //           goals: 0,
      //         };
      //       }),
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
        get: false,
      });
    }
  };
}

module.exports = EvaluationController;
