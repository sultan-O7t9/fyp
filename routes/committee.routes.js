const {
  getAllCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee,
} = require("../controllers/committee.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.get("/get-all", verifyToken, getAllCommittees);
Router.post("/create", verifyToken, createCommittee);
Router.put("/update", verifyToken, updateCommittee);
Router.delete("/delete/:id", verifyToken, deleteCommittee);

module.exports = Router;
