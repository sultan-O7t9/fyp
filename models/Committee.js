module.exports = (sequelize, DataTypes) => {
  const Committee = sequelize.define(
    "Committee",
    {
      name: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "tbl_committee",

      createdAt: false,
      updatedAt: false,
    }
  );
  return Committee;
};
