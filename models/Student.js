module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      rollNo: {
        type: DataTypes.STRING,
        primaryKey: true,
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
      degree: {
        type: DataTypes.STRING,
        defaultValue: "BS",
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
