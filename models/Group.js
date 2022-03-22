module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      name: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      // supervisorStatus: {
      //   type: DataTypes.STRING,
      //   defaultValue: "pending",
      //   validators: {
      //     isIn: [["pending", "approved", "rejected"]],
      //   },
      // },
    },
    {
      tableName: "tbl_group",

      createdAt: false,
      updatedAt: false,
    }
  );
  return Group;
};
