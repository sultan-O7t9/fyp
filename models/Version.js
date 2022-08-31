module.exports = (sequelize, DataTypes) => {
  const Version = sequelize.define(
    "Version",
    {
      name: {
        type: DataTypes.STRING,
      },
      commented_doc: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        //Approved, Revised, Pending
      },
      comment: {
        type: DataTypes.STRING,
      },
      eval_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        //Approved, Revised, Pending
      },
      eval_comment: {
        type: DataTypes.STRING,
      },
      eval_commented_doc: {
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
