// FIXME: create a new page, group details that show every info about a group, edit group and delete group butotn is shown there.
// if the role is authorized then he will be able to edit/del the group at that page, otherwise only show info at that page.
// TODO: supervisor dashboard
// show all deliverables just like pmo
// when clicked on one show groups list in asc order of their submission
// Supervisor clicks on one, dropdown menu of versions displays, supervior selects one, it gets downloaded.
// supervisor changes the submission status to verified (dully signed stuff irl)
// otherwise supervisor can change the status to revised
// student uploads new version and so on.😵

// After that Late submission mails and Evaluation stuff. 🤦🏻‍♂️

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
//Init
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
dotenv.config();
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
