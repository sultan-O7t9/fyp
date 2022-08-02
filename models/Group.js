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
      bookletsStatus: {
        type: DataTypes.STRING,
        defaultValue: "Not Submitted",
        validate: {
          isIn: {
            args: [["Not Submitted", "Approved"]],
            msg: "Booklets status must be one of the following: No Submission, Submitted, Approved",
          },
        },
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
