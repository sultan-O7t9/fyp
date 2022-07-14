const jwt = require("jsonwebtoken");
const {
  FacultyMember,
  Faculty_Role,
  Role,
  Student,
  Token,
  Group,
  Admin,
} = require("../models");
require("dotenv").config();
const jwt_decode = require("jwt-decode");
const sequelize = require("sequelize");
const res = require("express/lib/response");

const createAccessToken = user =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

const createRefreshToken = user =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET);

const refreshTokens = [];

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

module.exports.assignRole = async (req, res) => {
  const { facultyId, roleId } = req.body;
  try {
    const pmoRole = await Role.findOne({
      where: {
        title: "PMO",
      },
    });
    const role = await Faculty_Role.create({
      facultyId,
      roleId,
    });
    res.json({
      message: "Role assigned successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning role",
      error,
    });
  }
};

module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("BODY", req.body);

  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
        password: password,
      },
    });
    console.log(admin);
    if (admin) {
      const user = { id: admin.id, role: "HOD" };
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);
      const token = await Token.create({
        refreshToken,
      });
      console.log(refreshToken, accessToken);
      refreshTokens.push(refreshToken);

      res.status(200).json({
        login: true,
        accessToken,
        refreshToken,
      });
    } else {
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error logging in",
      error,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
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
        // user.role = ["PMO","SUPERVISOR","EVALUATOR"]
        const userRoles = await Faculty_Role.findAll({
          where: {
            facultyId: facultyMember.id,
          },
        });
        const roleNames = await Role.findAll({
          where: {
            id: {
              [sequelize.Op.in]: userRoles.map(
                userRole => userRole.dataValues.roleId
              ),
            },
          },
        });
        user.role = roleNames.map(role => role.dataValues.title);
      } else {
        throw new Error("Invalid Email or Password");
      }
    } else if (email.includes("_")) {
      const group = await Group.findOne({
        where: {
          name: email,
          password: password,
        },
      });
      if (group) {
        user.id = group.dataValues.id;
        user.role = "group";
      } else {
        throw new Error("Invalid Email or Password");
      }
    } else {
      const student = await Student.findOne({
        where: {
          rollNo: email,
          password: password,
          groupId: null,
        },
        attributes: ["name", "rollNo", "departmentId"],
      });
      if (student) {
        console.log(student.dataValues);
        user.id = student.dataValues.rollNo;
        user.role = ["STUDENT"];
      } else {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }
    }
    console.log(user);
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    // const existedToken = await Token.findOne({
    //   where: {
    //     userId: user.id,
    //     userRole: user.role,
    //   },
    // });
    // if (existedToken) await existedToken.destroy();
    const token = await Token.create({
      refreshToken,
    });
    console.log(user);
    refreshTokens.push(refreshToken);
    res.status(200).json({
      login: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
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
        },
      });
      // const refreshToken = refreshTokens.find(
      //   refreshToken => refreshToken === token
      // );
      if (refreshToken) {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
          err && console.log(err);
          try {
            const { iat, exp, ...userData } = user;
            console.log(userData);
            await refreshToken.destroy();
            // refreshTokens.filter(refreshToken => refreshToken !== token);

            const newAccessToken = jwt.sign(userData, process.env.JWT_SECRET, {
              expiresIn: "1m",
            });
            const newRefreshToken = createRefreshToken(userData);

            const newToken = await Token.create({
              refreshToken: newRefreshToken,
            });
            // refreshTokens.push(newRefreshToken);
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

module.exports.logoutUser = async (req, res) => {
  const { token } = req.body;
  if (token) {
    try {
      const refreshToken = await Token.findOne({
        where: {
          refreshToken: token,
        },
      });
      if (refreshToken) await refreshToken.destroy();
    } catch (error) {
      res.status(500).json({
        message: "Error logging out",
        error,
      });
    }
  }
  res.status(200).send({ logout: true });
};
