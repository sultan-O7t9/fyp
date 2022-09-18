module.exports = (sequelize, DataTypes) => {
  const Recipiant = sequelize.define(
    "Recipiant",
    {
      recipiant: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_recipiant",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Recipiant;
};
