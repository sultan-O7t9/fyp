module.exports = (sequelize, DataTypes) => {
  const CommitteeReview = sequelize.define(
    "CommitteeReview",
    {
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        //   Approved, Revised
      },
      commented_doc: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbl_committee_review",
      createdAt: true,
      updatedAt: false,
    }
  );
  // USer.associate = (models) => {
  //     USer.hasMany(models.Post, {
  //         foreignKey: 'userId',
  //         as: 'posts'
  //     })
  // }
  return CommitteeReview;
};
