const jwt = require("jsonwebtoken");
const {
  FacultyMember,
  Faculty_Role,
  Role,
  Student,
  Token,
} = require("../models");
require("dotenv").config();
const jwt_decode = require("jwt-decode");

const createAccessToken = user =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

const createRefreshToken = user =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET);

module.exports.createRoles = async (req, res) => {
  try {
    const { title } = req.body;
    const role = await Role.create({
      title,
    });
    res.json({
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating roles",
      error,
    });
  }
};

module.exports.registerFaculty = async (req, res) => {
  const { email, password, name, department, roles } = req.body;
  try {
    const facultyMember = await FacultyMember.create({
      email,
      password,
      name,
      department,
    });
    await roles.forEach(async role => {
      await Faculty_Role.create({
        facultyId: facultyMember.id,
        roleId: role,
      });
    });
    res.json({
      message: "Faculty Member registered successfully",
      facultyMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering Faculty Member",
      error,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = {};
    if (email.includes("@")) {
      const facultyMember = await FacultyMember.findOne({
        where: {
          email: email,
          password: password,
        },
      });
      if (facultyMember) {
        user.id = facultyMember.dataValues.id;
        user.role = "faculty";
      } else {
        throw new Error("Email or password is incorrect");
      }
    } else {
      const student = await Student.findOne({
        where: {
          rollNo: email,
          password: password,
        },
      });
      if (student) {
        console.log(student.dataValues.id);
        user.id = student.dataValues.id;
        user.role = "student";
      } else {
        throw new Error("Email or password is incorrect");
      }
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    const existedToken = await Token.findOne({
      where: {
        userId: user.id,
        userRole: user.role,
      },
    });
    if (existedToken) await existedToken.destroy();
    const token = await Token.create({
      refreshToken,
      userId: user.id,
      userRole: user.role,
    });
    console.log(user);
    res.status(200).json({
      login: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      login: false,
      message: error.message,
    });
  }
};

module.exports.refreshAccessToken = async (req, res) => {
  const token = req.body.token;
  const role = jwt_decode(token).role;

  console.log("REFRESH TOKEN", token);

  if (token) {
    // return res.status(403).json({ message: "Invalid Refresh Token" });

    try {
      const refreshToken = await Token.findOne({
        where: {
          refreshToken: token,
          userRole: role,
        },
      });
      if (refreshToken) {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
          err && console.log(err);
          try {
            const { iat, exp, ...userData } = user;
            await refreshToken.destroy();

            const newAccessToken = jwt.sign(userData, process.env.JWT_SECRET, {
              expiresIn: "1m",
            });
            const newRefreshToken = createRefreshToken(userData);

            const newToken = await Token.create({
              refreshToken: newRefreshToken,
              userId: userData.id,
              userRole: userData.role,
            });
            console.log("refreshed");
            res.status(200).json({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          } catch (error) {
            console.log(error);
          }
        });
      } else {
        return res.status(403).json({ message: "Invalid Refresh Token" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error refreshing access token",
        error,
      });
    }
  } else {
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }
};
