module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      refreshToken: {
        type: DataTypes.STRING,
      },
      userRole: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [["faculty", "student"]],
            msg: "Invalid user role",
          },
        },
      },
    },
    {
      tableName: "tbl_token",
    }
  );
  return Token;
};
