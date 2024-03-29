module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define(
    "Batch",
    {
      batchCode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "tbl_batch",
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
  return Batch;
};
