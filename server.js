const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { sendMail } = require("./utils/sendMails");
//Init
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
dotenv.config();
app.use(express.static("uploads"));
//Init DB
require("./models");

//Routes
app.use("/api/faculty", require("./routes/faculty.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/student", require("./routes/student.routes"));
app.use("/api/group", require("./routes/group.routes"));
app.use("/api/dept", require("./routes/department.routes"));
app.use("/api/role", require("./routes/role.routes"));
app.use("/api/committee", require("./routes/committee.routes"));
app.use("/api/project", require("./routes/project.routes"));
app.use("/api/deliverable", require("./routes/deliverable.routes"));
app.use("/api/evaluation", require("./routes/evaluation.routes"));
app.use("/api/sem", require("./routes/semester.routes"));

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
  // sendMail("");
});
