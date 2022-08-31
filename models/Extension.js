module.exports = (sequelize, DataTypes) => {
  const Extension = sequelize.define(
    "Extension",
    {
      days: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        // Pending, Approved
      },
    },
    {
      tableName: "tbl_extension",

      createdAt: false,
      updatedAt: false,
    }
  );
  return Extension;
};
