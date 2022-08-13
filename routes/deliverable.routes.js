// const { getAllDepartments } = require("../controllers/department.controller");
const verifyToken = require("../utils/verifyToken");
// const Depratment = require("../controllers/department.controller");
const Deliverable = require("../controllers/deliverable.controller");

const multer = require("multer");
const upload = multer();
const Router = require("express").Router();

// Router.get("/get-all", Depratment.getAllDepartments);
// Router.post("/create", Depratment.createDepartment);
// Router.delete("/delete", Depratment.removeDepartment);
// Router.post("/create",Deliverable.createDeliverable)
// Router.post("/template-file",Deliv)
Router.get("/get-all", Deliverable.getAllDeliverables);
Router.post("/create-deliverable", Deliverable.createDeliverable);
Router.post(
  "/template-file",
  upload.single("file"),
  Deliverable.addTemplateFile
);
Router.get("/template-file", Deliverable.downloadTemplateFile);
module.exports = Router;
