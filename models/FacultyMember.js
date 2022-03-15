module.exports = (sequelize, DataTypes) => {
  const FacultyMember = sequelize.define(
    "FacultyMember",
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: [6, 20],
        },
      },
    },
    {
      tableName: "tbl_facultymember",
      createdAt: false,
      updatedAt: false,
    }
  );
  return FacultyMember;
};
