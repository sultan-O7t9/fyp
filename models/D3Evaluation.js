//TODO: first of all get data
// Create a proposal evaluation Table
// Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
module.exports = (sequelize, DataTypes) => {
  const D3Evaluation = sequelize.define(
    "D3Evaluation",
    {
      codeRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      testRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      overallRemarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      runProject: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      codeModify: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      testPlan: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      testCase: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      projectPpt: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      userMan: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      stdTemp: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      skill: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      tableName: "tbl_evaluation_d3",
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
  return D3Evaluation;
};
