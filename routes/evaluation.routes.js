// const {
//   createGroup,
//   getAllGroupsOfADepartment,
//   deleteGroup,
//   editGroup,
//   getGroupByStudent,
// } = require("../controllers/group.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();
const Group = require("../controllers/group.controller");
const multer = require("multer");
const EvaluationController = require("../controllers/evaluation.controller");
const upload = multer();

Router.post(
  "/get-pmo-evaluation",
  EvaluationController.getPMOEvaluationByGroup
);
Router.put(
  "/update-pmo-evaluation",
  EvaluationController.updatePMOEvaluationByGroup
);
Router.post(
  "/get-supervisor-evaluation",
  EvaluationController.getSupervisorEvaluationByGroup
);
Router.post("/schedule", EvaluationController.createSchedule);
Router.post(
  "/get-schedule-deliverable",
  EvaluationController.getAllSchedulesByDeliverable
);
Router.delete("/del-schedule/:id", EvaluationController.deleteSchedule);
Router.put(
  "/update-supervisor-evaluation",
  EvaluationController.updateSupervisorEvaluationByGroup
);
Router.post("/proposal-evaluation", EvaluationController.getProposalEvaluation);
Router.post(
  "/add-proposal-evaluation",
  EvaluationController.handleProposalEvaluation
);
Router.post("/sup-evaluation", EvaluationController.getSupervisorEvaulation);
Router.post(
  "/add-sup-evaluation",
  EvaluationController.handleSupervisorEvaluation
);
Router.post("/pmo-evaluation", EvaluationController.getPmoEvaulation);
Router.post("/add-pmo-evaluation", EvaluationController.handlePmoEvaluation);
Router.post("/d2-evaluation", EvaluationController.getD2Evaulation);
Router.post("/add-d2-evaluation", EvaluationController.handleD2Evaluation);
Router.post("/d3-evaluation", EvaluationController.getD3Evaulation);
Router.post("/add-d3-evaluation", EvaluationController.handleD3Evaluation);
module.exports = Router;
