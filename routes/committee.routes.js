// const {
//   getAllCommittees,
//   createCommittee,
//   updateCommittee,
//   deleteCommittee,
// } = require("../controllers/committee.controller");
const verifyToken = require("../utils/verifyToken");
const Committee = require("../controllers/committee.controller");
const Router = require("express").Router();

Router.get("/get-all", verifyToken, Committee.getAllCommittees);
Router.post("/create", verifyToken, Committee.createCommittee);
Router.put("/update", verifyToken, Committee.updateCommittee);
Router.delete("/delete/:id", verifyToken, Committee.deleteCommittee);

module.exports = Router;
