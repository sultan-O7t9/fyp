module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      rollNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      leader: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "tbl_student",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Student;
};
