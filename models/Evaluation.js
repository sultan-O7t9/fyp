module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define(
    "Evaluation",
    {
      name: {
        type: DataTypes.STRING,
      },
      //   groupId: {},
      //   evaluationTypeId: {},
      //   versionId: {},
      //   projectId: {},
      marks: {
        type: DataTypes.INTEGER,
      },
      totalMarks: {
        type: DataTypes.INTEGER,
      },
      comments: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_evaluation",
      createdAt: false,
      updatedAt: false,
    }
  );
  // USer.associate = (models) => {
  //     USer.hasMany(models.Post, {
  //         foreignKey: 'userId',
  //         as: 'posts'
  //     })
  // }
  return Evaluation;
};
