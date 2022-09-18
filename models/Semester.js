module.exports = (sequelize, DataTypes) => {
  const Semester = sequelize.define(
    "Semester",
    {
      title: {
        type: DataTypes.STRING,
      },
      current: {
        type: DataTypes.BOOLEAN,
      },
      session: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_semester",
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
  return Semester;
};
