module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      name: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_department",
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
  return Department;
};
