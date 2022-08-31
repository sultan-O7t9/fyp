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
const Evaluation = require("../controllers/evaluation.controller");
const CommitteeReview = require("../controllers/committeeReview.controller");
const upload = multer();

Router.post("/get-pmo-evaluation", Evaluation.getPMOEvaluationByGroup);
Router.put("/update-pmo-evaluation", Evaluation.updatePMOEvaluationByGroup);
Router.post(
  "/get-supervisor-evaluation",
  Evaluation.getSupervisorEvaluationByGroup
);
Router.post("/schedule", Evaluation.createSchedule);
Router.post(
  "/get-schedule-deliverable",
  Evaluation.getAllSchedulesByDeliverable
);
Router.delete("/del-schedule/:id", Evaluation.deleteSchedule);
Router.put(
  "/update-supervisor-evaluation",
  Evaluation.updateSupervisorEvaluationByGroup
);
Router.post("/proposal-evaluation", Evaluation.getProposalEvaluation);
Router.post("/add-proposal-evaluation", Evaluation.handleProposalEvaluation);
Router.post("/sup-evaluation", Evaluation.getSupervisorEvaulation);
Router.post("/add-sup-evaluation", Evaluation.handleSupervisorEvaluation);
Router.post("/pmo-evaluation", Evaluation.getPmoEvaulation);
Router.post("/add-pmo-evaluation", Evaluation.handlePmoEvaluation);
Router.post("/d2-evaluation", Evaluation.getD2Evaulation);
Router.post("/add-d2-evaluation", Evaluation.handleD2Evaluation);
Router.post("/d3-evaluation", Evaluation.getD3Evaulation);
Router.post("/add-d3-evaluation", Evaluation.handleD3Evaluation);

Router.post("/update-review-status", CommitteeReview.changeEndorsementStatus);
Router.post(
  "/add-commented-doc",
  upload.single("file"),
  CommitteeReview.uploadCommentedDoc
);
Router.post("/get-review-status", CommitteeReview.getEndorsementStatus);
Router.post("/add-comment", CommitteeReview.addComment);
module.exports = Router;
