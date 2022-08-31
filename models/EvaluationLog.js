module.exports = (sequelize, DataTypes) => {
  const EvaluationLog = sequelize.define(
    "EvaluationLog",
    {
      text: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_evaluation_log",
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
  return EvaluationLog;
};
