const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
//Init
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
//Init DB
require("./models");

//Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/student", require("./routes/student.route"));

const port = process.env.PORT || 8080;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client", "build")));
// }

// app.get("*", (req, res) => {
//   app.use(express.static(path.join(__dirname, "client", "build")));
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
