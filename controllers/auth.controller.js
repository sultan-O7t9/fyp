const jwt = require("jsonwebtoken");
const {
  FacultyMember,
  Faculty_Role,
  Role,
  Student,
  Token,
  Group,
  Admin,
  Batch,
  Deliverable,
  EvaluationType,
  HOD,
} = require("../models");
require("dotenv").config();
const jwt_decode = require("jwt-decode");
const sequelize = require("sequelize");
const res = require("express/lib/response");
const { sendMail } = require("../utils/sendMails");
const { hashPassword } = require("../utils/hashPassword");
const hash = require("../utils/hashPassword");

var crypto = require("crypto");
const createAccessToken = user =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

const createRefreshToken = user =>
  jwt.sign(user, process.env.JWT_REFRESH_SECRET);

const refreshTokens = [];

module.exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  let user = null;
  try {
    if (email.includes("@uog.edu.pk")) {
      const faculty = await FacultyMember.findOne({
        where: {
          email: email,
        },
      });
      if (faculty) {
        // user = {
        //   email: faculty.dataValues.email,
        //   password: faculty.dataValues.password,
        // };
        console.log(faculty.dataValues.email);
        const newPass = crypto.randomBytes(8).toString("hex").slice(0, 8);
        const newHashedPass = await hashPassword(newPass);

        user = {
          email: "18094198-079@uog.edu.pk",
          regEmail: faculty.dataValues.email,
          password: newPass,
        };
        await faculty.update({
          password: newHashedPass,
        });

        res.status(200).json({
          message: "Faculty member found",
          email: true,
          faculty,
        });
      } else {
        throw new Error("Faculty member not found");
      }
    } else if (email.split("_").length - 1 == 2) {
      const group = await Group.findOne({
        where: {
          name: email,
        },
      });
      if (group) {
        console.log(group.dataValues.name);
        const student = await Student.findOne({
          where: {
            groupId: group.id,
            leader: true,
          },
        });
        if (student) {
          const newPass = crypto.randomBytes(8).toString("hex").slice(0, 8);
          const newHashedPass = await hashPassword(newPass);
          user = {
            email: student.dataValues.rollNo + "@uog.edu.pk",
            regEmail: email,
            password: newPass,
          };
          await group.update({
            password: newHashedPass,
          });
          res.status(200).json({
            message: "Student found",
            email: true,
            student,
          });
        } else {
          throw new Error("Student not found");
        }
      } else {
        throw new Error("Group not found");
      }
    }
    console.log(user);
    sendMail(
      null,
      [user].map(student => {
        return {
          email: student.email,
          subject: "Password Recovery",
          body: `
        Your credentials are as follows:
        Email: ${student.regEmail}
        Password: ${student.password}
        `,
        };
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error finding",
      error,
    });
  }
};
// module.exports.forgetPassword = async (req, res) => {
//   const { email } = req.body;
//   let user = null;
//   try {
//     if (email.includes("@uog.edu.pk")) {
//       const faculty = await FacultyMember.findOne({
//         where: {
//           email: email,
//         },
//       });
//       if (faculty) {
//         // user = {
//         //   email: faculty.dataValues.email,
//         //   password: faculty.dataValues.password,
//         // };

//         user = {
//           email: "18094198-079@uog.edu.pk",
//           regEmail: faculty.dataValues.email,
//           password: faculty.dataValues.password,
//         };

//         res.status(200).json({
//           message: "Faculty member found",
//           email: true,
//           faculty,
//         });
//       } else {
//         throw new Error("Faculty member not found");
//       }
//     } else if (email.split("_").length - 1 == 2) {
//       const group = await Group.findOne({
//         where: {
//           name: email,
//         },
//       });
//       if (group) {
//         const student = await Student.findOne({
//           where: {
//             groupId: group.id,
//             leader: true,
//           },
//         });
//         if (student) {
//           user = {
//             email: student.dataValues.rollNo + "@uog.edu.pk",
//             regEmail: email,
//             password: group.dataValues.password,
//           };
//           res.status(200).json({
//             message: "Student found",
//             email: true,
//             student,
//           });
//         } else {
//           throw new Error("Student not found");
//         }
//       } else {
//         throw new Error("Group not found");
//       }
//     }
//     console.log(user);
//     sendMail(
//       null,
//       [user].map(student => {
//         return {
//           email: student.email,
//           subject: "Password Recovery",
//           body: `
//         Your credentials are as follows:
//         Email: ${student.regEmail}
//         Password: ${student.password}
//         `,
//         };
//       })
//     );
//   } catch (error) {
//     res.status(500).json({
//       message: "Error finding",
//       error,
//     });
//   }
// };
module.exports.initializeApp = async (req, res) => {
  try {
    const admin = await Admin.findAll();
    if (admin.length === 0) {
      const hashedPass = await hashPassword(process.env.ADMIN_PASSWORD);
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPass,
        name: "Admin",
      });
      const hodHashedPass = await hashPassword(process.env.HOD_PASSWORD);
      await HOD.create({
        email: process.env.HOD_EMAIL,
        password: hodHashedPass,
      });
      await Role.create({
        title: "PMO",
      });
      await Role.create({
        title: "SUPERVISOR",
      });
      await Role.create({
        title: "EVALUATOR",
      });
      await Deliverable.create({
        title: "Deliverable 01",
        emailsubject: "Submission of Final Year Project's Proposal - FYP ",
        emailbody: `
        The deadline and template file to submit FYP Proposal has been updated on PMS. Login for further details.
          
          Submission Procedure:
              1. Docx file of FYP Proposal should be uploaded against Deliverable 1.
              2. The file name should be the same as your project title.
              3. Submit required docs before/on the deadline.
          `,
        id: 1,
      });
      // const emailSubject = email.subject
      //   ? email.subject
      //   : `Submission of ${
      //       deliverableId == 1
      //         ? "Final Year Project's Proposal"
      //         : deliverableId == 2
      //         ? " Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation"
      //         : "D3 (Complete Document incl. Test Document and User Manual along with Working System)"
      //     } - FYP `;
      // const emailBody = email.body
      //   ? email.body
      //   : `The deadline and template file to submit ${
      //       deliverableId == 1
      //         ? "FYP Proposal"
      //         : deliverableId == 2
      //         ? "Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation"
      //         : "Complete Documentation incl. D2 chapters, Test Document and User Manual(D3) along with 30% Implementation"
      //     } has been updated on PMS. Login for further details.

      // Submission Procedure:
      //     1. ${
      //       deliverableId == 1
      //         ? "Docx file of FYP Proposal"
      //         : "Zip file including docx file of Documentation and zip file of code"
      //     }  should be uploaded against Deliverable ${deliverableId}.
      //     2. The file name should be the same as your project title.
      //     3. Submit required docs before/on the deadline.
      // `;

      await Deliverable.create({
        title: "Deliverable 02",
        emailsubject:
          "Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation",
        emailbody: `
        The deadline and template file to submit Feasibility Report, SRS and Design Documents(D2) along with 30% Implementation has been updated on PMS. Login for further details.
          
          Submission Procedure:
              1. Zip file including docx file of Documentation and zip file of code.
              2. The file name should be the same as your project title.
              3. Submit required docs before/on the deadline.
          `,
        id: 2,
      });
      await Deliverable.create({
        title: "Deliverable 03",
        emailsubject:
          "D3 (Complete Documentation incl. D2 Chapters, Test Document and User Manual along with Working System)",
        emailbody: `
        The deadline and template file to submit D3 (Complete Documentation incl. D2 Chapters, Test Document and User Manual along with Working System) has been updated on PMS. Login for further details.
          
          Submission Procedure:
              1. Zip file including docx file of Documentation and zip file of code.
              2. The file name should be the same as your project title.
              3. Submit required docs before/on the deadline.
          `,
        id: 3,
      });
      //Eval Type
      await EvaluationType.create({
        name: "Proposal Document",
        id: 1,
        totalMarks: 20,
      });
      await EvaluationType.create({
        name: "Software Requirements Specification",
        id: 2,
        totalMarks: 10,
      });
      await EvaluationType.create({
        name: "Design Document",
        id: 3,
        totalMarks: 10,
      });

      await EvaluationType.create({
        name: "Prototype",
        id: 4,
        totalMarks: 10,
      });
      await EvaluationType.create({
        name: "Testing",
        id: 6,
        totalMarks: 20,
      });
      await EvaluationType.create({
        name: "Code",
        id: 5,
        totalMarks: 30,
      });
      await EvaluationType.create({
        name: "Overall System and Documentation",
        id: 7,
        totalMarks: 40,
      });
      await EvaluationType.create({
        name: "Supervisor",
        id: 8,
        totalMarks: 40,
      });
      await EvaluationType.create({
        name: "Project Management Office",
        id: 9,
        totalMarks: 20,
      });
      console.log("Initialized");
      res.status(200).json({
        message: "App initialized successfully",
      });
    } else {
      console.log("App already initialized");
      res.status(200).json({
        message: "App already initialized",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

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

module.exports.hodLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("BODY", req.body);

  try {
    const admin = await HOD.findOne({
      where: {
        email: email,
      },
    });
    const comparePass = await hash.comparePassword(
      password,
      admin.dataValues.password
    );
    console.log(admin);
    if (admin && comparePass) {
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
        id: admin.id,
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
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("BODY", req.body);

  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });
    console.log(admin);
    const comparePass = await hash.comparePassword(
      password,
      admin.dataValues.password
    );
    if (admin && comparePass) {
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
        id: admin.id,
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
    let first_login = false;
    const user = {};
    if (email.includes("@")) {
      const facultyMember = await FacultyMember.findOne({
        where: {
          email: email,
          // password: password,
        },
      });
      // const comparePassword = await bcrypt.compare(
      //   password,
      //   facultyMember.dataValues.password
      // );
      const comparePassword = await hash.comparePassword(
        password,
        facultyMember.dataValues.password
      );
      if (facultyMember && comparePassword) {
        user.id = facultyMember.dataValues.id;
        first_login = facultyMember.dataValues.first_login;
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
      // const comparePassword = await hash.comparePassword(
      //   password,
      //   group.dataValues.password
      // );
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
          groupId: null,
          password: password,
        },
        attributes: ["name", "rollNo", "departmentId"],
      });

      console.log(student);
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
      first_login,
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
