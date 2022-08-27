module.exports = (sequelize, DataTypes) => {
  const EvaluationSchedule = sequelize.define(
    "EvaluationSchedule",
    {
      date: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "tbl_evaluation_schedule",

      createdAt: false,
      updatedAt: false,
    }
  );
  return EvaluationSchedule;
};
