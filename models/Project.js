const typeItems = ["research", "development"];
const techItems = ["object oriented", "structured"];
const platformItems = [
  "web",
  "distributed",
  "desktop",
  "setup configurations",
  "other",
];

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      title: {
        type: DataTypes.STRING,
        //Constriants
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,

        // validate: {
        //   isIn: {
        //     args: [typeItems],
        //     msg: "Invalid type",
        //   },
        // },
      },
      dev_tech: {
        type: DataTypes.STRING,
        // validate: {
        //   isIn: {
        //     args: [techItems],
        //   },
        // },
      },
      platform: {
        type: DataTypes.STRING,
        // validate: {
        //   isIn: {
        //     args: [platformItems],
        //   },
        // },
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "accepted",
        isIn: {
          args: [["rejected", "accepeted"]],
          msg: "Invalid status",
        },
      },
    },
    {
      tableName: "tbl_project",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Project;
};
