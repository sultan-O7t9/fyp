//TODO: first of all get data
// Create a proposal evaluation Table
// Save groupId, student Id, and each type of evaluation there: existingSystem, goals, architecture,pptSkills, Save the marks there
module.exports = (sequelize, DataTypes) => {
  const SupervisorEvaluation = sequelize.define(
    "SupervisorEvaluation",
    {
      remarks: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      marks_seven: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      marks_eight: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "tbl_evaluation_supervisor",
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
  return SupervisorEvaluation;
};
