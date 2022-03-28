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

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

module.exports.sendMail = recipiants => {
  const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_API,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };

  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

  Promise.all(
    recipiants.map(recipiant => {
      return new Promise((resolve, reject) => {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: recipiant.email,
          subject: recipiant.subject,
          text: recipiant.body,
        };
        smtpTransport.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        });
      });
    })
  ).then(info => {
    console.log(info);
  });

  // recipiants.forEach(recipiant => {
  //       const mailOptions = {
  //         from: process.env.SENDER_EMAIL,
  //         to: recipiant.email,
  //         subject: recipiant.subject,
  //         text: recipiant.body,
  //       };

  // smtpTransport.sendMail(mailOptions, function(error, response) {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log("Successfully sent email.")
  //   }
  // })
  //     });
};
