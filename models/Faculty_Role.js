module.exports = (sequelize, DataTypes) => {
  const Faculty_Role = sequelize.define(
    "Faculty_Role",
    {
      facultyId: {
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "tbl_faculty_role",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Faculty_Role;
};
