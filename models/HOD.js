module.exports = (sequelize, DataTypes) => {
  const HOD = sequelize.define(
    "HOD",
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
      tableName: "tbl_hod",
      createdAt: false,
      updatedAt: false,
    }
  );
  return HOD;
};
