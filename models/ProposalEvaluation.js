//TODO: first of all get data
// Create a proposal evaluation Table
// Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
module.exports = (sequelize, DataTypes) => {
  const ProposalEvaluation = sequelize.define(
    "ProposalEvaluation",
    {
      remarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      existingSystem: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      goals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      architecture: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      pptSkills: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "tbl_evaluation_proposal",
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
  return ProposalEvaluation;
};
