module.exports = (sequelize, DataTypes) => {
  const FacultyMember = sequelize.define(
    "FacultyMember",
    {
      name: {
        type: DataTypes.STRING,
      },
      designation: {
        type: DataTypes.STRING,
        defaultValue: "Lecturer",
        //  Associate Professor, Professor, Lecturer
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
      mailPassword: {
        type: DataTypes.STRING,
        validate: {
          len: [6, 20],
        },
      },
      first_login: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
