//Incl. dotenv
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
//Create a new instance of Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL);
//Verify connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Define a new model
// db.User = require("./User")(sequelize, DataTypes);

//Associate the model with other models
//...
//Synchronize the database
db.sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = db;
