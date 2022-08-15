// //Incl. dotenv
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

// //Create a new instance of Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL);
// //Verify connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// // const db = {};
// // db.Sequelize = Sequelize;
// // db.sequelize = sequelize;

// // // Define a new model
const FacultyMember = require("./FacultyMember")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const Faculty_Role = require("./Faculty_Role")(sequelize, DataTypes);
const Group = require("./Group")(sequelize, DataTypes);
const Student = require("./Student")(sequelize, DataTypes);
const Department = require("./Department")(sequelize, DataTypes);
const Batch = require("./Batch")(sequelize, DataTypes);
const Token = require("./Token")(sequelize, DataTypes);
const Project = require("./Project")(sequelize, DataTypes);
const Committee = require("./Committee")(sequelize, DataTypes);
const Admin = require("./Admin")(sequelize, DataTypes);
const Deliverable = require("./Deliverable")(sequelize, DataTypes);
const Version = require("./Version")(sequelize, DataTypes);
const EvaluationType = require("./EvaluationType")(sequelize, DataTypes);
const Evaluation = require("./Evaluation")(sequelize, DataTypes);
// const PMO= require("./PMO")(sequelize, DataTypes);

// //Associate the model with other models
FacultyMember.belongsToMany(Role, {
  //Each FacultyMember belongs to many Roles
  foreignKey: "facultyId",
  through: Faculty_Role,
});
Role.belongsToMany(FacultyMember, {
  //Each Role can have many Users
  foreignKey: "roleId",
  through: Faculty_Role,
});
Group.hasMany(Student, {
  //Each Group can have many Students
  foreignKey: "groupId",
});

FacultyMember.hasMany(Group, {
  //Each Faculty can have many Groups
  foreignKey: "supervisorId",
});

Department.hasMany(FacultyMember, {
  //Each Department can have many FacultyMembers
  foreignKey: "departmentId",
});

Department.hasOne(FacultyMember, {
  //Each Department has one FacultyMember
  foreignKey: "pmoOfDepartmentId",
});

Department.hasMany(Batch, {
  //Each Department can have many Batches
  foreignKey: "departmentId",
});
Batch.hasMany(Student, {
  foreignKey: "batchId",
});

Department.hasMany(Student, {
  foreignKey: "departmentId",
});

Department.hasMany(Group, {
  foreignKey: "departmentId",
});
Department.hasMany(Committee, {
  foreignKey: "departmentId",
});

Project.hasOne(Group, {
  foreignKey: "projectId",
});

Committee.hasMany(Group, {
  foreignKey: "committeeId",
});
Committee.hasMany(Student, {
  foreignKey: "committeeId",
});

Committee.hasMany(FacultyMember, {
  foreignKey: "committeeId",
});

Project.hasMany(Version, {
  foreignKey: "projectId",
});
Deliverable.hasMany(Version, {
  foreignKey: "deliverableId",
});
Group.hasMany(Version, {
  foreignKey: "groupId",
});
// FacultyMember.hasMany(Deliverable, {
//   foreignKey: "facultyId",
// }
// );
// Deliverable.hasMany
// FacultyMember.hasOne(Department, {
//   //Each FacultyMember can have one Department
//   foreignKey: "departmentId",
// });

// groupId: {},
// evaluationTypeId: {},
// versionId: {},
// projectId: {},
Deliverable.hasMany(Evaluation, {
  foreignKey: "deliverableId",
});
Version.hasMany(Evaluation, {
  foreignKey: "versionId",
});
Project.hasMany(Evaluation, {
  foreignKey: "projectId",
});
Evaluation.belongsTo(EvaluationType, {
  foreignKey: "evaluationTypeId",
});
Group.hasMany(Evaluation, {
  foreignKey: "groupId",
});

// Evaluation.hasMany(Version, {});
// Evaluation.hasMany(Project, {});
// Evaluation.hasMany(Group, {});
// // Evaluation.hasMany(Committee, {});
// // Deliverable.hasMany(Evaluation, {});

// //...
// //Synchronize the database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch(err => {
    console.error("Unable to sync to the database:", err);
  });

module.exports = {
  sequelize,
  Sequelize,
  FacultyMember,
  Admin,
  Role,
  Faculty_Role,
  Group,
  Student,
  Department,
  Deliverable,
  Version,
  Batch,
  Token,
  Project,
  Committee,
};
