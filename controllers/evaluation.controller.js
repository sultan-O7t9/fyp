const sequelize = require("sequelize");
const { Evaluation, EvaluationType } = require("../models");

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
}

module.exports = EvaluationController;
