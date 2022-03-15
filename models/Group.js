module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      supervisor: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
      },
      project: {
        type: DataTypes.STRING,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      batch: {
        type: DataTypes.INTEGER,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_group",

      createdAt: false,
      updatedAt: false,
    }
  );
  return Group;
};
