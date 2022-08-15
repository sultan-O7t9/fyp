module.exports = (sequelize, DataTypes) => {
  const EvaluationType = sequelize.define(
    "EvaluationType",
    {
      name: {
        type: DataTypes.STRING,
      },
      totalMarks: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "tbl_evaluation_type",
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
  return EvaluationType;
};
