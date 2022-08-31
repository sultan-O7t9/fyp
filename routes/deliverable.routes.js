// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
// const Depratment = require("../controllers/department.controller");
const Deliverable = require("../controllers/deliverable.controller.js");

const multer = require("multer");
const Version = require("../controllers/version.controller");
const Extension = require("../controllers/extension.controller");
const DeliverableController = require("../controllers/deliverable.controller.js");
const upload = multer();
const Router = require("express").Router();

// Router.get("/get-all", Depratment.getAllDepartments);
// Router.post("/create", Depratment.createDepartment);
// Router.delete("/delete", Depratment.removeDepartment);
// Router.post("/create",Deliverable.createDeliverable)
// Router.post("/template-file",Deliv)
Router.get("/get-all", Deliverable.getAllDeliverables);
Router.get("/get/:id", Deliverable.getDeliverableById);
Router.post("/create-deliverable", Deliverable.createDeliverable);
Router.patch("/update-deliverable", Deliverable.editDeliverable);
Router.post(
  "/template-file",
  upload.single("file"),
  Deliverable.addTemplateFile
);
Router.post("/get-template-file", Deliverable.downloadTemplateFile);
Router.post("/get-grp-submission", Deliverable.getGroupDeliverableSubmission);
Router.post(
  "/get-grp-submission-dept",
  Deliverable.getGroupsDeliverableSubmissionByDept
);
Router.post(
  "/get-grp-submission-sup",
  Deliverable.getGroupsDeliverableSubmissionBySupervisor
);
Router.post(
  "/get-grp-submission-sem",
  Deliverable.getGroupsDeliverableSubmissionByCurrentSemester
);

Router.post(
  "/submit-grp-submission",
  upload.single("file"),
  Deliverable.submitGroupDeliverableSubmission
);
Router.delete(
  "/del-grp-submission/:file",
  Deliverable.deleteGroupDeliverableSubmission
);
Router.post("/send-mail", Deliverable.sendMailToStudents);

Router.post("/sup-add-comment", Version.addComment);
Router.post("/sup-change-status", Version.changeEndorsementStatus);
Router.post("/sup-add-doc", upload.single("file"), Version.uploadCommentedDoc);
Router.post("/get-logs", DeliverableController.getLogs);
Router.post("/set-logs", DeliverableController.setLogs);

Router.post("/share-sched", Version.shareSchedule);

Router.post("/ex-get-grp", Extension.getExtension);
Router.post("/req-ex", Extension.requestExtension);
Router.post("/ex-status", Extension.changeStatus);
Router.post("/ex-get", Extension.getExtensions);

module.exports = Router;
