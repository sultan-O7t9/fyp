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
  PMO,
  CommitteeReview,
  Version,
  Department,
  Semester,
} = require("../models");
const {
  generateFypFinalPerforma,
  generateCoverLetter,
} = require("../utils/generateDocx");

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

class EvaluationController {
  static getCoverLetterReport = async (req, res) => {
    const { groups, userId } = req.body;
    const data = [];
    try {
      const pmo = await PMO.findOne({
        where: {
          pmoId: userId,
        },
      });
      const dept = await Department.findOne({
        where: {
          id: pmo.deptId,
        },
      });

      for (let i = 0; i < groups.length; i++) {
        const group = await Group.findOne({
          where: {
            id: groups[i],
          },
        });

        const project = await Project.findOne({
          where: {
            id: group.projectId,
          },
        });
        const members = await Student.findAll({
          where: {
            groupId: group.id,
          },
        });
        for (let j = 0; j < members.length; j++) {
          const member = members[j];
          const memberData = {
            name: member.name,
            rollNo: member.rollNo,
            group: group.name,
            projectTitle: project.title,
            srNo: i + 1,
          };
          data.push(memberData);
        }
        // data.push({
        //   projectTitle: project ? project.dataValues.title : "",
        //   members: members
        //     ? members.map(member => ({
        //         rollNo: member.dataValues.rollNo,
        //         name: member.dataValues.name,
        //       }))
        //     : [],
        // });
      }
      console.log(data);
      const file = await generateCoverLetter({
        students: data,
        department: dept ? dept.title : "",
        date: new Date().toDateString().split(" ").slice(1).join(" "),
      });

      res.status(200).json({
        status: "success",
        file: file,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  static get7thEvaluation = async (req, res) => {
    const { groups, userId } = req.body;
    try {
      const pmo = await PMO.findAll({
        where: {
          pmoId: userId,
        },
      });
      const dept = await Department.findAll({
        where: {
          id: {
            [sequelize.Op.in]: pmo.map(p => p.deptId),
          },
        },
      });
      const deptsOfPmo = dept
        .reduce((acc, curr) => {
          acc.push(curr.name);

          return acc;
        }, [])
        .join(", ");
      console.log(deptsOfPmo);

      const sts = [];
      for (let i = 0; i < groups.length; i++) {
        const grp = await Group.findOne({ where: { id: groups[i] } });
        const prjct = await Project.findOne({ where: { id: grp.projectId } });
        const students = await Student.findAll({
          where: {
            groupId: groups[i],
          },
        });
        console.log(students);
        const proposalEvals = {};
        for (let i = 0; i < students.length; i++) {
          const proposalEval = await ProposalEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          // proposalEvals.push(proposalEval?proposalEval.dataValues:{existingSystem:0,goals:0,architecture:0,pptSkills:0});
          proposalEvals[students[i].rollNo] = proposalEval
            ? { ...proposalEval.dataValues }
            : { existingSystem: 0, goals: 0, architecture: 0, pptSkills: 0 };
        }
        console.log(proposalEvals);
        const d2Evals = {};
        for (let i = 0; i < students.length; i++) {
          const d2Eval = await D2Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          d2Evals[students[i].rollNo] = d2Eval
            ? { ...d2Eval.dataValues }
            : {
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
        }

        const supEvals = {};
        for (let i = 0; i < students.length; i++) {
          const supEval = await SupervisorEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          supEvals[students[i].rollNo] = supEval
            ? supEval.dataValues.marks_seven
            : 0;
        }
        const pmoEvals = {};
        for (let i = 0; i < students.length; i++) {
          const pmoEval = await PmoEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          pmoEvals[students[i].rollNo] = pmoEval
            ? pmoEval.dataValues.marks_seven
            : 0;
        }
        const totals = {};
        for (let i = 0; i < students.length; i++) {
          totals[students[i].rollNo] =
            proposalEvals[students[i].rollNo].existingSystem +
            proposalEvals[students[i].rollNo].goals +
            proposalEvals[students[i].rollNo].architecture +
            proposalEvals[students[i].rollNo].pptSkills +
            d2Evals[students[i].rollNo].funcReqs +
            d2Evals[students[i].rollNo].interfaces +
            d2Evals[students[i].rollNo].usecaseDesc +
            d2Evals[students[i].rollNo].usecaseDia +
            d2Evals[students[i].rollNo].nonFuncReqs +
            d2Evals[students[i].rollNo].domainDia +
            d2Evals[students[i].rollNo].classDia +
            d2Evals[students[i].rollNo].sequenceDia +
            d2Evals[students[i].rollNo].stateChartDia +
            d2Evals[students[i].rollNo].collabDia +
            d2Evals[students[i].rollNo].sysPrototype +
            supEvals[students[i].rollNo] +
            pmoEvals[students[i].rollNo];
        }
        console.log(totals);

        let evs = ["", ""];
        if (grp.dataValues.committeeId) {
          const commMmbrs = await FacultyMember.findAll({
            where: {
              committeeId: grp.dataValues.committeeId,
            },
          });
          if (commMmbrs.length == 2) {
            evs = [commMmbrs[0].dataValues.name, commMmbrs[1].dataValues.name];
          }
        }

        const depts = {};
        const evaluators = {};
        for (let i = 0; i < students.length; i++) {
          evaluators[students[i].rollNo] = evs;

          const dept = await Department.findOne({
            where: {
              id: students[i].departmentId,
            },
          });
          if (dept) {
            depts[students[i].rollNo] = dept.dataValues.name;
          } else {
            depts[students[i].rollNo] = "";
          }
        }

        const ssts = students.map(st => {
          return {
            name: st.dataValues.name,
            projectTitle: prjct ? prjct.dataValues.title : "",
            projectType: prjct ? prjct.dataValues.dev_tech : "structured",
            rollNo: st.dataValues.rollNo,
            degree: depts[st.dataValues.rollNo]
              ? st.dataValues.degree + depts[st.dataValues.rollNo]
              : st.dataValues.degree,
            proposalEval: proposalEvals[st.dataValues.rollNo],
            d2Eval: d2Evals[st.dataValues.rollNo],
            supEval: supEvals[st.dataValues.rollNo],
            pmoEval: pmoEvals[st.dataValues.rollNo],
            total: totals[st.dataValues.rollNo],
            evaluators: evaluators[st.dataValues.rollNo],
          };
        });
        for (let i = 0; i < ssts.length; i++) {
          sts.push(ssts[i]);
        }
      }
      console.log(sts);
      res.status(200).json({
        status: "success",
        students: sts,
        pmoDept: deptsOfPmo,
      });
      // const d3Evals=[];
      // for(let i=0;i<students.length;i++){
      //   const d3Eval=await D3Evaluation.findOne({
      //     where:{
      //       studentId:students[i].id
      //     }
      //   });
      //   d3Evals.push(d3Eval?d3Eval.dataValues:{funcreqs:0,interfaces:0,usecaseDesc:0,usecaseDia:0,nonFuncReqs:0,domainDia:0,classDia:0,sequenceDia:0,stateChartDia:0,collabDia:0,sysPrototype:0});
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  };
  static get8thEvaluation = async (req, res) => {
    const { groups, userId } = req.body;
    try {
      const pmo = await PMO.findAll({
        where: {
          pmoId: userId,
        },
      });
      const dept = await Department.findAll({
        where: {
          id: {
            [sequelize.Op.in]: pmo.map(p => p.deptId),
          },
        },
      });
      const deptsOfPmo = dept
        .reduce((acc, curr) => {
          acc.push(curr.name);

          return acc;
        }, [])
        .join(", ");
      console.log(deptsOfPmo);
      const sts = [];
      for (let i = 0; i < groups.length; i++) {
        const grp = await Group.findOne({ where: { id: groups[i] } });

        const prjct = await Project.findOne({ where: { id: grp.projectId } });
        const students = await Student.findAll({
          where: {
            groupId: groups[i],
          },
        });
        console.log(students);

        const d3Evals = {};
        for (let i = 0; i < students.length; i++) {
          const d3Eval = await D3Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          d3Evals[students[i].rollNo] = d3Eval
            ? { ...d3Eval.dataValues }
            : {
                runProject: 0,
                codeModify: 0,
                testPlan: 0,
                testCase: 0,
                projectPpt: 0,
                userMan: 0,
                stdTemp: 0,
                skill: 0,
              };
        }

        const supEvals = {};
        for (let i = 0; i < students.length; i++) {
          const supEval = await SupervisorEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          supEvals[students[i].rollNo] = supEval
            ? supEval.dataValues.marks_eight
            : 0;
        }
        const pmoEvals = {};
        for (let i = 0; i < students.length; i++) {
          const pmoEval = await PmoEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          pmoEvals[students[i].rollNo] = pmoEval
            ? pmoEval.dataValues.marks_eight
            : 0;
        }
        const totals = {};
        for (let i = 0; i < students.length; i++) {
          totals[students[i].rollNo] =
            d3Evals[students[i].rollNo].runProject +
            d3Evals[students[i].rollNo].codeModify +
            d3Evals[students[i].rollNo].testPlan +
            d3Evals[students[i].rollNo].testCase +
            d3Evals[students[i].rollNo].projectPpt +
            d3Evals[students[i].rollNo].userMan +
            d3Evals[students[i].rollNo].stdTemp +
            d3Evals[students[i].rollNo].skill +
            supEvals[students[i].rollNo] +
            pmoEvals[students[i].rollNo];
        }
        console.log(totals);

        let evs = ["", ""];
        if (grp.dataValues.committeeId) {
          const commMmbrs = await FacultyMember.findAll({
            where: {
              committeeId: grp.dataValues.committeeId,
            },
          });
          if (commMmbrs.length == 2) {
            evs = [commMmbrs[0].dataValues.name, commMmbrs[1].dataValues.name];
          }
        }
        const depts = {};
        const evaluators = {};
        for (let i = 0; i < students.length; i++) {
          evaluators[students[i].rollNo] = evs;
          const dept = await Department.findOne({
            where: {
              id: students[i].departmentId,
            },
          });
          if (dept) {
            depts[students[i].rollNo] = dept.dataValues.name;
          } else {
            depts[students[i].rollNo] = "";
          }
        }

        const ssts = students.map(st => {
          return {
            name: st.dataValues.name,
            projectTitle: prjct ? prjct.dataValues.title : "",
            projectType: prjct ? prjct.dataValues.dev_tech : "structured",
            rollNo: st.dataValues.rollNo,
            degree: depts[st.dataValues.rollNo]
              ? st.dataValues.degree + depts[st.dataValues.rollNo]
              : st.dataValues.degree,

            d3Eval: d3Evals[st.dataValues.rollNo],
            supEval: supEvals[st.dataValues.rollNo],
            pmoEval: pmoEvals[st.dataValues.rollNo],
            total: totals[st.dataValues.rollNo],
            evaluators: evaluators[st.dataValues.rollNo],
          };
        });
        for (let i = 0; i < ssts.length; i++) {
          sts.push(ssts[i]);
        }
      }
      console.log(sts);
      res.status(200).json({
        status: "success",
        students: sts,
        pmoDept: deptsOfPmo,
      });
      // const d3Evals=[];
      // for(let i=0;i<students.length;i++){
      //   const d3Eval=await D3Evaluation.findOne({
      //     where:{
      //       studentId:students[i].id
      //     }
      //   });
      //   d3Evals.push(d3Eval?d3Eval.dataValues:{funcreqs:0,interfaces:0,usecaseDesc:0,usecaseDia:0,nonFuncReqs:0,domainDia:0,classDia:0,sequenceDia:0,stateChartDia:0,collabDia:0,sysPrototype:0});
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  };
  static getFinalEvaluationDetailByStudent = async (req, res) => {
    const { groups } = req.body;
    //dept, name, roll, supervisor, class, session, projectTitle, evaluators: name, designation,  total, percentage
    try {
      const sts = [];
      for (let i = 0; i < groups.length; i++) {
        const grp = await Group.findOne({ where: { id: groups[i] } });
        const supervisorId = grp.dataValues.supervisorId;
        const supervisor = await FacultyMember.findOne({
          where: { id: supervisorId },
        });

        const dept = await Department.findOne({
          where: {
            id: grp.dataValues.departmentId,
          },
        });

        const comm = await Committee.findOne({
          where: {
            id: grp.dataValues.committeeId,
          },
        });

        const prjct = await Project.findOne({ where: { id: grp.projectId } });
        const students = await Student.findAll({
          where: {
            groupId: groups[i],
          },
        });
        console.log(students);

        const evals = {};
        for (let i = 0; i < students.length; i++) {
          const d3Eval = await D3Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const proposalEval = await ProposalEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });

          const d2Eval = await D2Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const pmoEval = await PmoEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const supEval = await SupervisorEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const d1 = proposalEval
            ? proposalEval.dataValues.existingSystem +
              proposalEval.dataValues.goals +
              proposalEval.dataValues.architecture +
              proposalEval.dataValues.pptSkills
            : 0;
          const d2 = d2Eval
            ? d2Eval.dataValues.funcReqs +
              d2Eval.dataValues.interfaces +
              d2Eval.dataValues.usecaseDesc +
              d2Eval.dataValues.usecaseDia +
              d2Eval.dataValues.nonFuncReqs +
              d2Eval.dataValues.domainDia +
              d2Eval.dataValues.classDia +
              d2Eval.dataValues.sequenceDia +
              d2Eval.dataValues.stateChartDia +
              d2Eval.dataValues.collabDia +
              d2Eval.dataValues.sysPrototype
            : 0;
          const d3 = d3Eval
            ? d3Eval.dataValues.runProject +
              d3Eval.dataValues.codeModify +
              d3Eval.dataValues.testPlan +
              d3Eval.dataValues.testCase +
              d3Eval.dataValues.projectPpt +
              d3Eval.dataValues.userMan +
              d3Eval.dataValues.stdTemp +
              d3Eval.dataValues.skill
            : 0;

          const sup = supEval
            ? supEval.dataValues.marks_seven + supEval.dataValues.marks_eight
            : 0;
          const pmo = pmoEval
            ? pmoEval.dataValues.marks_seven + pmoEval.dataValues.marks_eight
            : 0;
          const total = d1 + d2 + d3 + sup + pmo;
          evals[students[i].rollNo] = {
            total: total,
            percentage: (total / 200) * 100,
          };
        }
        const evaluators = {};
        if (comm) {
          const members = await FacultyMember.findAll({
            where: {
              committeeId: comm.dataValues.id,
            },
          });
          for (let j = 0; j < students.length; j++) {
            // evaluators.push({
            //   name: members[j].dataValues.name,

            //   designation: members[j].dataValues.designation,
            // });
            console.log(students[j].dataValues.rollNo);
            for (let i = 0; i < members.length; i++) {
              console.log(members[i].name);
              const nameKey = `evaluator${i + 1}name`;
              const desigKey = `evaluator${i + 1}desig`;
              evaluators[students[j].rollNo] = {
                ...evaluators[students[j].rollNo],
                [nameKey]: members[i].dataValues.name,
                [desigKey]: members[i].dataValues.designation,
              };
            }
          }
        }
        // console.log(evaluators);
        const depts = {};
        for (let i = 0; i < students.length; i++) {
          const dept = await Department.findOne({
            where: {
              id: students[i].departmentId,
            },
          });
          if (dept) {
            depts[students[i].rollNo] = {
              name: dept.dataValues.name,
              title: dept.dataValues.title,
            };
          } else {
            depts[students[i].rollNo] = "";
          }
        }

        const semester = await Semester.findOne({
          where: {
            id: grp.dataValues.semesterId,
          },
        });
        let session = "";
        if (semester) {
          session = semester.dataValues.session;
        }
        // console.log(session, semester);
        console.log(evaluators);
        const ssts = students.map(st => {
          return {
            name: st.dataValues.name,
            supervisor: supervisor.dataValues.name,
            // evaluators: evaluators.length > 0 ? evaluators : [{}, {}],
            evaluator1name:
              comm && evaluators.hasOwnProperty([st.dataValues.rollNo])
                ? evaluators[st.dataValues.rollNo].evaluator1name
                : "",
            evaluator2name:
              comm && evaluators.hasOwnProperty([st.dataValues.rollNo])
                ? evaluators[st.dataValues.rollNo].evaluator2name
                : "",
            evaluator1desig:
              comm && evaluators.hasOwnProperty([st.dataValues.rollNo])
                ? evaluators[st.dataValues.rollNo].evaluator1desig
                : "",
            evaluator2desig:
              comm && evaluators.hasOwnProperty([st.dataValues.rollNo])
                ? evaluators[st.dataValues.rollNo].evaluator2desig
                : "",

            // evaluator1desig:
            //   evaluators.length >= 2 && evaluators[0]
            //     ? evaluators[0].designation
            //     : "",

            // evaluator2name:
            //   evaluators.length >= 2 && evaluators[1] ? evaluators[1].name : "",

            // evaluator2desig:
            //   evaluators.length >= 2 && evaluators[1]
            //     ? evaluators[1].designation
            //     : "",

            projectTitle: prjct ? prjct.dataValues.title : "",
            projectType: prjct ? prjct.dataValues.dev_tech : "structured",
            rollNo: st.dataValues.rollNo,
            department: depts[st.dataValues.rollNo]
              ? depts[st.dataValues.rollNo].title
              : "",
            class: depts[st.dataValues.rollNo]
              ? st.dataValues.degree + depts[st.dataValues.rollNo].name
              : st.dataValues.degree,
            session: session,
            total: evals[st.dataValues.rollNo].total,
            percentage: evals[st.dataValues.rollNo].percentage,
            date: new Date().toDateString().split(" ").slice(1).join(" "),
          };
        });
        for (let i = 0; i < ssts.length; i++) {
          sts.push(ssts[i]);
        }
        console.log(evaluators);
      }

      const file = await generateFypFinalPerforma({ students: [...sts] });
      // console.log(file);
      // res.download(file);
      res.json({ file: file });
      // res.status(200).json({
      //   status: "success",
      //   students: sts,
      // });
      // const d3Evals=[];
      // for(let i=0;i<students.length;i++){
      //   const d3Eval=await D3Evaluation.findOne({
      //     where:{
      //       studentId:students[i].id
      //     }
      //   });
      //   d3Evals.push(d3Eval?d3Eval.dataValues:{funcreqs:0,interfaces:0,usecaseDesc:0,usecaseDia:0,nonFuncReqs:0,domainDia:0,classDia:0,sequenceDia:0,stateChartDia:0,collabDia:0,sysPrototype:0});
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  };
  static getFinalEvaluationDetail = async (req, res) => {
    const { groups } = req.body;
    try {
      const sts = [];
      for (let i = 0; i < groups.length; i++) {
        const grp = await Group.findOne({ where: { id: groups[i] } });
        const supervisorId = grp.dataValues.supervisorId;
        const supervisor = await FacultyMember.findOne({
          where: { id: supervisorId },
        });

        const dept = await Department.findOne({
          where: {
            id: grp.dataValues.departmentId,
          },
        });

        const comm = await Committee.findOne({
          where: {
            id: grp.dataValues.committeeId,
          },
        });
        const evaluators = [];
        if (comm) {
          const members = await FacultyMember.findAll({
            where: {
              committeeId: comm.dataValues.id,
            },
          });
          for (let j = 0; j < members.length; j++) {
            evaluators.push(members[j].dataValues.name);
          }
        }
        console.log(evaluators);

        const prjct = await Project.findOne({ where: { id: grp.projectId } });
        const students = await Student.findAll({
          where: {
            groupId: groups[i],
          },
        });

        const evals = {};
        for (let i = 0; i < students.length; i++) {
          const d3Eval = await D3Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const proposalEval = await ProposalEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });

          const d2Eval = await D2Evaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const pmoEval = await PmoEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const supEval = await SupervisorEvaluation.findOne({
            where: {
              studentId: students[i].rollNo,
            },
          });
          const d1 = proposalEval
            ? proposalEval.dataValues.existingSystem +
              proposalEval.dataValues.goals +
              proposalEval.dataValues.architecture +
              proposalEval.dataValues.pptSkills
            : 0;
          const d2 = d2Eval
            ? d2Eval.dataValues.funcReqs +
              d2Eval.dataValues.interfaces +
              d2Eval.dataValues.usecaseDesc +
              d2Eval.dataValues.usecaseDia +
              d2Eval.dataValues.nonFuncReqs +
              d2Eval.dataValues.domainDia +
              d2Eval.dataValues.classDia +
              d2Eval.dataValues.sequenceDia +
              d2Eval.dataValues.stateChartDia +
              d2Eval.dataValues.collabDia +
              d2Eval.dataValues.sysPrototype
            : 0;
          const d3 = d3Eval
            ? d3Eval.dataValues.runProject +
              d3Eval.dataValues.codeModify +
              d3Eval.dataValues.testPlan +
              d3Eval.dataValues.testCase +
              d3Eval.dataValues.projectPpt +
              d3Eval.dataValues.userMan +
              d3Eval.dataValues.stdTemp +
              d3Eval.dataValues.skill
            : 0;

          const sup = supEval
            ? supEval.dataValues.marks_seven + supEval.dataValues.marks_eight
            : 0;
          const pmo = pmoEval
            ? pmoEval.dataValues.marks_seven + pmoEval.dataValues.marks_eight
            : 0;
          const total = d1 + d2 + d3 + sup + pmo;
          evals[students[i].rollNo] = {
            total: total,
            percentage: (total / 200) * 100,
          };
        }

        const depts = {};
        for (let i = 0; i < students.length; i++) {
          const dept = await Department.findOne({
            where: {
              id: students[i].departmentId,
            },
          });
          if (dept) {
            depts[students[i].rollNo] = dept.dataValues.name;
          } else {
            depts[students[i].rollNo] = "";
          }
        }

        const semester = await Semester.findOne({
          where: {
            id: grp.dataValues.semesterId,
          },
        });
        let session = "";
        if (semester) {
          session = semester.dataValues.session;
        }
        const ssts = students.map(st => {
          return {
            name: st.dataValues.name,
            supervisor: supervisor.dataValues.name,
            evaluators: evaluators.length > 0 ? evaluators : ["", ""],
            projectTitle: prjct ? prjct.dataValues.title : "",
            projectType: prjct ? prjct.dataValues.dev_tech : "structured",
            rollNo: st.dataValues.rollNo,

            class: depts[st.dataValues.rollNo]
              ? st.dataValues.degree + depts[st.dataValues.rollNo]
              : st.dataValues.degree,
            total: evals[st.dataValues.rollNo].total,
            percentage: evals[st.dataValues.rollNo].percentage,
          };
        });
        for (let i = 0; i < ssts.length; i++) {
          sts.push(ssts[i]);
        }
      }
      res.status(200).json({
        status: "success",
        students: sts,
      });
      // const d3Evals=[];
      // for(let i=0;i<students.length;i++){
      //   const d3Eval=await D3Evaluation.findOne({
      //     where:{
      //       studentId:students[i].id
      //     }
      //   });
      //   d3Evals.push(d3Eval?d3Eval.dataValues:{funcreqs:0,interfaces:0,usecaseDesc:0,usecaseDia:0,nonFuncReqs:0,domainDia:0,classDia:0,sequenceDia:0,stateChartDia:0,collabDia:0,sysPrototype:0});
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  };
  static getAllEvaluation = async (req, res) => {
    const { groups } = req.body;
    try {
      // const pmo = await PMO.findAll({ where: { pmoId: userId } });
      // const depts = pmo.map(p => p.deptId);
      const grps = await Group.findAll({
        where: {
          id: {
            [sequelize.Op.in]: groups,
          },
        },
      });
      const studentsByGrps = [];
      for (let i = 0; i < groups.length; i++) {
        const supervisorId = grps[i].dataValues.supervisorId;
        const supervisor = await FacultyMember.findOne({
          where: { id: supervisorId },
        });

        const prjct = await Project.findOne({
          where: {
            id: grps[i].dataValues.projectId,
          },
        });

        const dept = await Department.findOne({
          where: {
            id: grps[i].dataValues.departmentId,
          },
        });

        const comm = await Committee.findOne({
          where: {
            id: grps[i].dataValues.committeeId,
          },
        });
        const evaluators = [];
        if (comm) {
          const members = await FacultyMember.findAll({
            where: {
              committeeId: comm.dataValues.id,
            },
          });
          for (let j = 0; j < members.length; j++) {
            evaluators.push(members[j].dataValues.name);
          }
        }

        const students = await Student.findAll({
          where: { groupId: groups[i] },
        });

        const proposalEvals = {};
        for (let j = 0; j < students.length; j++) {
          const proposalEval = await ProposalEvaluation.findOne({
            where: { studentId: students[j].dataValues.rollNo },
          });
          let marks;
          if (proposalEval) {
            marks =
              proposalEval.dataValues.existingSystem +
              proposalEval.dataValues.goals +
              proposalEval.dataValues.architecture +
              proposalEval.dataValues.pptSkills;
          } else {
            marks = 0;
          }
          proposalEvals[students[j].rollNo] = marks;
        }
        const d2Evals = {};
        for (let j = 0; j < students.length; j++) {
          const d2Eval = await D2Evaluation.findOne({
            where: { studentId: students[j].dataValues.rollNo },
          });
          let marks;
          if (d2Eval) {
            marks =
              d2Eval.dataValues.funcReqs +
              d2Eval.dataValues.interfaces +
              d2Eval.dataValues.usecaseDesc +
              d2Eval.dataValues.usecaseDia +
              d2Eval.dataValues.nonFuncReqs +
              d2Eval.dataValues.domainDia +
              d2Eval.dataValues.classDia +
              d2Eval.dataValues.sequenceDia +
              d2Eval.dataValues.stateChartDia +
              d2Eval.dataValues.collabDia +
              d2Eval.dataValues.sysPrototype;
          } else {
            marks = 0;
          }
          d2Evals[students[j].rollNo] = marks;
        }

        const d3Evals = {};
        for (let j = 0; j < students.length; j++) {
          const d3Eval = await D3Evaluation.findOne({
            where: { studentId: students[j].dataValues.rollNo },
          });
          let marks;
          if (d3Eval) {
            marks =
              d3Eval.dataValues.runProject +
              d3Eval.dataValues.codeModify +
              d3Eval.dataValues.testPlan +
              d3Eval.dataValues.projectPpt +
              d3Eval.dataValues.userMan +
              d3Eval.dataValues.stdTemp +
              d3Eval.dataValues.skill +
              d3Eval.dataValues.testCase;
          } else {
            marks = 0;
          }
          d3Evals[students[j].rollNo] = marks;
        }
        const supEvals = {};
        for (let j = 0; j < students.length; j++) {
          const supEval = await SupervisorEvaluation.findOne({
            where: { studentId: students[j].dataValues.rollNo },
          });
          let marks;
          if (supEval) {
            marks =
              supEval.dataValues.marks_seven + supEval.dataValues.marks_eight;
          } else {
            marks = 0;
          }
          supEvals[students[j].rollNo] = marks;
        }
        const pmoEvals = {};
        for (let j = 0; j < students.length; j++) {
          const pmoEval = await PmoEvaluation.findOne({
            where: { studentId: students[j].dataValues.rollNo },
          });
          let marks;
          if (pmoEval) {
            marks =
              pmoEval.dataValues.marks_seven + pmoEval.dataValues.marks_eight;
          } else {
            marks = 0;
          }
          pmoEvals[students[j].rollNo] = marks;
        }
        const semester = await Semester.findOne({
          where: {
            id: grps[i].dataValues.semesterId,
          },
        });
        let session = "";
        if (semester) {
          session = semester.dataValues.session;
        }

        const sts = students.map(st => {
          return {
            grpId: i + 1,
            rollNo: st.dataValues.rollNo,
            name: st.dataValues.name,
            class: dept ? st.dataValues.degree + dept.dataValues.name : "",

            supervisor: supervisor ? supervisor.dataValues.name : "",
            projectTitle: prjct ? prjct.dataValues.title : "",
            department: dept ? dept.dataValues.title : "",
            evaluators: evaluators.length > 0 ? evaluators : ["", ""],
            d1: proposalEvals[st.dataValues.rollNo],
            d2: d2Evals[st.dataValues.rollNo],
            d3: d3Evals[st.dataValues.rollNo],
            supervisorEvaluation: supEvals[st.dataValues.rollNo],
            pmoEvaluation: pmoEvals[st.dataValues.rollNo],
            session: session,
            total:
              proposalEvals[st.dataValues.rollNo] +
              d2Evals[st.dataValues.rollNo] +
              d3Evals[st.dataValues.rollNo] +
              supEvals[st.dataValues.rollNo] +
              pmoEvals[st.dataValues.rollNo],
            percentage:
              ((proposalEvals[st.dataValues.rollNo] +
                d2Evals[st.dataValues.rollNo] +
                d3Evals[st.dataValues.rollNo] +
                supEvals[st.dataValues.rollNo] +
                pmoEvals[st.dataValues.rollNo]) /
                200) *
              100,
          };
        });
        // console.log(sts);
        sts.forEach(st => {
          studentsByGrps.push(st);
        });
        // studentsByGrps.concat(sts);
      }
      console.log(studentsByGrps);
      res.status(200).json({
        status: "success",
        studetns: studentsByGrps,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error", error: error });
    }
  };
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
      const deptsOfPMO = await PMO.findAll({
        where: {
          pmoId: pmo.id,
        },
      });
      const depts = deptsOfPMO.map(dept => dept.deptId);
      const groups = await Group.findAll({
        where: {
          departmentId: {
            [sequelize.Op.or]: depts,
          },
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

          const committeeReview = await CommitteeReview.findOne({
            where: {
              groupId: groups[i].id,
              deliverableId: deliverableId,
              committeeId: groups[i].committeeId,
            },
          });

          const versions = await Version.findAll({
            where: {
              groupId: groups[i].id,
              deliverableId: deliverableId,
            },
          });
          const latestVersion = versions
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .pop();

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
              submission: latestVersion,
              committeeReview: committeeReview,
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
          marks_seven: evalData.students[i].marks_seven,
          marks_eight: evalData.students[i].marks_eight,
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
                  marks_seven: evaluation.marks_seven,
                  marks_eight: evaluation.marks_eight,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  marks_seven: 0,
                  marks_eight: 0,
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
          marks_seven: evalData.students[i].marks_seven,
          marks_eight: evalData.students[i].marks_eight,
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
                  marks_seven: evaluation.marks_seven,
                  marks_eight: evaluation.marks_eight,
                };
              })
            : students.map(student => {
                return {
                  rollNo: student.rollNo,
                  marks_seven: 0,
                  marks_eight: 0,
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
          existingSystem: roundToTwo(evalData.students[i].existingSystem),
          goals: roundToTwo(evalData.students[i].goals),
          architecture: roundToTwo(evalData.students[i].architecture),
          pptSkills: roundToTwo(evalData.students[i].pptSkills),
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
          funcReqs: roundToTwo(evalData.students[i].funcReqs),
          interfaces: roundToTwo(evalData.students[i].interfaces),
          usecaseDesc: roundToTwo(evalData.students[i].usecaseDesc),
          usecaseDia: roundToTwo(evalData.students[i].usecaseDia),
          nonFuncReqs: roundToTwo(evalData.students[i].nonFuncReqs),
          domainDia: roundToTwo(evalData.students[i].domainDia),
          classDia: roundToTwo(evalData.students[i].classDia),
          sequenceDia: roundToTwo(evalData.students[i].sequenceDia),
          stateChartDia: roundToTwo(evalData.students[i].stateChartDia),
          collabDia: roundToTwo(evalData.students[i].collabDia),
          sysPrototype: roundToTwo(evalData.students[i].sysPrototype),
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
          runProject: roundToTwo(evalData.students[i].runProject),
          codeModify: roundToTwo(evalData.students[i].codeModify),
          testPlan: roundToTwo(evalData.students[i].testPlan),
          testCase: roundToTwo(evalData.students[i].testCase),
          projectPpt: roundToTwo(evalData.students[i].projectPpt),
          userMan: roundToTwo(evalData.students[i].userMan),
          stdTemp: roundToTwo(evalData.students[i].stdTemp),
          skill: roundToTwo(evalData.students[i].skill),
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
