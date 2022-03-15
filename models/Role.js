module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      title: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
        createdAt: false,
        updatedAt: false,
      },
    },
    {
      tableName: "tbl_role",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Role;
};
