module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      title: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "accepted",
        isIn: {
          args: [["rejected", "accepeted"]],
          msg: "Invalid status",
        },
      },
    },
    {
      tableName: "tbl_project",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Project;
};
