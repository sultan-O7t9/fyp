const {
  loginUser,
  logoutUser,
  registerFaculty,
  createRoles,
  refreshAccessToken,
  adminLogin,
  initializeApp,
  forgetPassword,
  hodLogin,
  resetPassword,
} = require("../controllers/auth.controller");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

Router.post("/login", loginUser);
// Router.post("/reset", resetPassword);
Router.post("/forget", resetPassword);
Router.post("/admin", adminLogin);
Router.post("/hod", hodLogin);
Router.post("/logout", verifyToken, logoutUser);
Router.post("/refresh", refreshAccessToken);
Router.post("/role", createRoles);
Router.get("/test", verifyToken, (req, res) => {
  console.log(req.user);
  res.send("test");
});
Router.get("/init", initializeApp);

module.exports = Router;
