const {
  loginUser,
  registerFaculty,
  createRoles,
  refreshAccessToken,
} = require("../controllers/auth.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/login", loginUser);
Router.post("/refresh", refreshAccessToken);
Router.post("/register", registerFaculty);
Router.post("/role", createRoles);
Router.get("/test", verifyToken, (req, res) => {
  console.log(req.user);
  res.send("test");
});

module.exports = Router;
