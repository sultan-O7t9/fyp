module.exports = (sequelize, DataTypes) => {
  const Deliverable = sequelize.define(
    "Deliverable",
    {
      title: {
        type: DataTypes.STRING,
      },
      template: {
        type: DataTypes.STRING,
      },
      deadline: {
        type: DataTypes.DATE,
      },
      emailsubject: {
        type: DataTypes.STRING,
      },
      emailbody: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_deliverable",
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
  return Deliverable;
};