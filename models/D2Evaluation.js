//TODO: first of all get data
// Create a proposal evaluation Table
// Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
module.exports = (sequelize, DataTypes) => {
  const D2Evaluation = sequelize.define(
    "D2Evaluation",
    {
      reqRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      designRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      sysRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      funcReqs: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      interfaces: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      usecaseDesc: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      usecaseDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      nonFuncReqs: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      projectType: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        // if oose then 1 else 0
      },
      domainDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      classDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      sequenceDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      stateChartDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      collabDia: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      sysPrototype: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      tableName: "tbl_evaluation_d2",
      createdAt: true,
      updatedAt: false,
    }
  );
  // USer.associate = (models) => {
  //     USer.hasMany(models.Post, {
  //         foreignKey: 'userId',
  //         as: 'posts'
  //     })
  // }
  return D2Evaluation;
};
