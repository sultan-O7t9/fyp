module.exports = (sequelize, DataTypes) => {
  const PMO = sequelize.define(
    "PMO",
    {
      pmoId: {
        type: DataTypes.INTEGER,
      },
      deptId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "tbl_pmo",
      createdAt: false,
      updatedAt: false,
    }
  );
  return PMO;
};
