const { FacultyMember, Department, Group } = require("../models");
const sequelize = require("sequelize");

module.exports.getAllCommittees = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  //in res
  // [{
  //     id,department,members,group
  // }]
};

module.exports.createCommittee = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  // in req.body:
  // {members: [id],
  // groups: [name]}
  //in res
  // {
  //     id: comittee.name,
  //     department:Pmo Department,
  //     members:[{name:"",email:"",id}],
  //     groups:[{name:"",id}],
  // }
};
module.exports.updateCommittee = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  // in req.body:
  // {members: [id],
  // groups: [name]}
  //in res
  // {
  //     id: comittee.name,
  //     department:Pmo Department,
  //     members:[{name:"",email:"",id}],
  //     groups:[{name:"",id}],
  // }
};
module.exports.deleteCommittee = async (req, res) => {
  // TODO:
  //in req.user: PMO.id
  // in req.body:
  // committee.name
  //in res
  // DELETED SUCCESSFULLY"
};
