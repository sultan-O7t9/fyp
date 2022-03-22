module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      refreshToken: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_token",
    }
  );
  return Token;
};
