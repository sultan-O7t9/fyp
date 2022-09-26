require("dotenv").config();
// const nodeMailer = require("nodemailer");

// module.exports.sendMail = recipiants => {
//   const transporter = nodeMailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.SENDER_EMAIL,
//       pass: process.env.SENDER_PASSWORD,
//     },
//   });

//   recipiants.forEach(recipiant => {
//     const mailOptions = {
//       from: process.env.SENDER_EMAIL,
//       to: recipiant.email,
//       subject: recipiant.subject,
//       text: recipiant.body,
//     };
//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//   });
// };

// const nodemailer = require("nodemailer");
// const mg = require("nodemailer-mailgun-transport");

// module.exports.sendMail = recipiants => {
//   const mailgunAuth = {
//     auth: {
//       api_key: process.env.MAILGUN_API,
//       domain: process.env.MAILGUN_DOMAIN,
//     },
//   };

//   const transporter = nodemailer.createTransport(mg(mailgunAuth));
//   console.log(recipiants);
// Promise.all(
//   recipiants.map(recipiant => {
//     return new Promise((resolve, reject) => {
//       const mailOptions = {
//         from: process.env.SENDER_EMAIL,
//         to: recipiant.email,
//         subject: recipiant.subject,
//         text: recipiant.body,
//       };
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Email sent: " + info.response);
//           resolve(info);
//         }
//       });
//     });
//   })
// ).then(info => {
//   console.log(info);
// }).catch(err => {
//   console.log(err);
// });

//   // recipiants.forEach(recipiant => {
//   //       const mailOptions = {
//   //         from: process.env.SENDER_EMAIL,
//   //         to: recipiant.email,
//   //         subject: recipiant.subject,
//   //         text: recipiant.body,
//   //       };

//   // transporter.sendMail(mailOptions, function(error, response) {
//   //   if (error) {
//   //     console.log(error)
//   //   } else {
//   //     console.log("Successfully sent email.")
//   //   }
//   // })
//   //     });
// };

const nodemailer = require("nodemailer");

module.exports.sendMail = (
  sender = { mail: null, mailpass: null },
  recipiants
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        sender && sender.mail && sender.mailpass
          ? sender.mail
          : process.env.SENDER_EMAIL,
      pass:
        sender && sender.mail && sender.mailpass
          ? sender.mailpass
          : process.env.SENDER_PASSWORD,
    },
  });
  console.log("recipiant", recipiants);
  Promise.all(
    recipiants.map(recipiant => {
      return new Promise((resolve, reject) => {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: recipiant.email,
          subject: recipiant.subject,
          text: recipiant.body,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          } else {
            console.log("Email sent: " + info.response);
            resolve(info);
          }
        });
      });
    })
  )
    .then(info => {
      console.log(info);
    })
    .catch(err => {
      console.log(err);
    });

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
};
module.exports.sendMailWithAttachment = (sender, recipiants) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        sender && sender.mail && sender.mailpass
          ? sender.mail
          : process.env.SENDER_EMAIL,
      pass:
        sender && sender.mail && sender.mailpass
          ? sender.mailpass
          : process.env.SENDER_PASSWORD,
    },
  });
  Promise.all(
    recipiants.map(recipiant => {
      return new Promise((resolve, reject) => {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: recipiant.email,
          subject: recipiant.subject,
          text: recipiant.body,
          html: recipiant.html,
          // attachments: [
          //   {
          //     // file on disk as an attachment
          //     // filename: recipiant.name,
          //     path: recipiant.path, // stream this file
          //   },
          // ],
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          } else {
            console.log("Email sent: " + info.response);
            resolve(info);
          }
        });
      });
    })
  )
    .then(info => {
      console.log(info);
    })
    .catch(err => {
      console.log(err);
    });

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
};
