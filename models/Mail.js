module.exports = (sequelize, DataTypes) => {
  const Mail = sequelize.define(
    "Mail",
    {
      subject: {
        type: DataTypes.TEXT,
      },
      body: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "tbl_mail",
      createdAt: true,
      updatedAt: false,
    }
  );
  return Mail;
};
