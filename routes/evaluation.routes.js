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
Router.put(
  "/update-supervisor-evaluation",
  EvaluationController.updateSupervisorEvaluationByGroup
);
module.exports = Router;
