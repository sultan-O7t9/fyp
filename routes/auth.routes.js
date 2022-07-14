const {
  loginUser,
  logoutUser,
  registerFaculty,
  createRoles,
  refreshAccessToken,
  adminLogin,
} = require("../controllers/auth.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/login", loginUser);
Router.post("/admin", adminLogin);
Router.post("/logout", verifyToken, logoutUser);
Router.post("/refresh", refreshAccessToken);
Router.post("/role", createRoles);
Router.get("/test", verifyToken, (req, res) => {
  console.log(req.user);
  res.send("test");
});

module.exports = Router;
