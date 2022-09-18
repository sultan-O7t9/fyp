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
const CommitteeReview = require("./CommitteeReview")(sequelize, DataTypes);
const EvaluationLog = require("./EvaluationLog")(sequelize, DataTypes);

const Mail = require("./Mail")(sequelize, DataTypes);
const Recipiant = require("./Recipiant")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const Faculty_Role = require("./Faculty_Role")(sequelize, DataTypes);
const PMO = require("./PMO")(sequelize, DataTypes);
const Group = require("./Group")(sequelize, DataTypes);
const Student = require("./Student")(sequelize, DataTypes);
const Department = require("./Department")(sequelize, DataTypes);
const Batch = require("./Batch")(sequelize, DataTypes);
const Semester = require("./Semester")(sequelize, DataTypes);
const Token = require("./Token")(sequelize, DataTypes);
const Project = require("./Project")(sequelize, DataTypes);
const Committee = require("./Committee")(sequelize, DataTypes);
const Admin = require("./Admin")(sequelize, DataTypes);
const Deliverable = require("./Deliverable")(sequelize, DataTypes);
const Version = require("./Version")(sequelize, DataTypes);
const EvaluationType = require("./EvaluationType")(sequelize, DataTypes);
const Evaluation = require("./Evaluation")(sequelize, DataTypes);
const Extension = require("./Extension")(sequelize, DataTypes);
const EvaluationSchedule = require("./EvaluationSchedule")(
  sequelize,
  DataTypes
);
const ProposalEvaluation = require("./ProposalEvaluation")(
  sequelize,
  DataTypes
);
const D2Evaluation = require("./D2Evaluation")(sequelize, DataTypes);
const D3Evaluation = require("./D3Evaluation")(sequelize, DataTypes);
const SupervisorEvaluation = require("./SupervisorEvaluation")(
  sequelize,
  DataTypes
);
const PmoEvaluation = require("./PmoEvaluation")(sequelize, DataTypes);
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

// Department.hasOne(FacultyMember, {
//   //Each Department has one FacultyMember
//   foreignKey: "pmoOfDepartmentId",
// });
FacultyMember.belongsToMany(Department, {
  //Each FacultyMember belongs to many Roles
  foreignKey: "pmoId",
  through: PMO,
});
Department.belongsToMany(FacultyMember, {
  //Each Role can have many Users
  foreignKey: "deptId",
  through: PMO,
});

// FacultyMember.hasMany(Department, {
//   foreignKey: "pmoId",
// });

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
Student.hasMany(ProposalEvaluation, {
  foreignKey: "studentId",
});
Group.hasMany(ProposalEvaluation, {
  foreignKey: "groupId",
});
Student.hasMany(D2Evaluation, {
  foreignKey: "studentId",
});
Group.hasMany(D2Evaluation, {
  foreignKey: "groupId",
});
Student.hasMany(D3Evaluation, {
  foreignKey: "studentId",
});
Group.hasMany(D3Evaluation, {
  foreignKey: "groupId",
});
Student.hasMany(SupervisorEvaluation, {
  foreignKey: "studentId",
});
Group.hasMany(SupervisorEvaluation, {
  foreignKey: "groupId",
});
Student.hasMany(PmoEvaluation, {
  foreignKey: "studentId",
});
Group.hasMany(PmoEvaluation, {
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
Student.hasMany(Evaluation, {
  foreignKey: "studentId",
});
Group.hasMany(EvaluationSchedule, {
  foreignKey: "groupId",
});
Deliverable.hasMany(EvaluationSchedule, {
  foreignKey: "deliverableId",
});
Semester.hasMany(Group, {
  foreignKey: "semesterId",
});
Group.hasMany(Extension, {
  foreignKey: "groupId",
});
Deliverable.hasMany(Extension, {
  foreignKey: "deliverableId",
});
FacultyMember.hasMany(Extension, {
  foreignKey: "supervisorId",
});
Group.hasMany(CommitteeReview, {
  foreignKey: "groupId",
});
Deliverable.hasMany(CommitteeReview, {
  foreignKey: "deliverableId",
});
Group.hasMany(EvaluationLog, {
  foreignKey: "groupId",
});
Deliverable.hasMany(EvaluationLog, {
  foreignKey: "deliverableId",
});
Committee.hasMany(CommitteeReview, {
  foreignKey: "committeeId",
});

Mail.hasMany(Recipiant, { foreignKey: "mailId" });
FacultyMember.hasMany(Mail, { foreignKey: "facultyId" });

// Committee.hs

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
  CommitteeReview,
  Admin,
  Role,
  Faculty_Role,
  Group,
  D2Evaluation,
  D3Evaluation,
  ProposalEvaluation,
  SupervisorEvaluation,
  PmoEvaluation,
  Student,
  Department,
  Deliverable,
  Version,
  Batch,
  Semester,
  Token,
  Evaluation,
  PMO,
  Extension,
  EvaluationLog,
  EvaluationType,
  EvaluationSchedule,
  Mail,
  Recipiant,
  Project,
  Committee,
};
