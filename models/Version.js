module.exports = (sequelize, DataTypes) => {
  const Version = sequelize.define(
    "Version",
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_version",
      // createdAt: false,
      updatedAt: false,
    }
  );
  // USer.associate = (models) => {
  //     USer.hasMany(models.Post, {
  //         foreignKey: 'userId',
  //         as: 'posts'
  //     })
  // }
  return Version;
};
