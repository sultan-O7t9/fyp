const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("TOKEN", token);
  if (!token) return res.status(400).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid Token");
  }
};
