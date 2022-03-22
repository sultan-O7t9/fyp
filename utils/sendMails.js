require("dotenv").config();
const nodeMailer = require("nodemailer");

module.exports.sendMail = recipiants => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  recipiants.forEach(recipiant => {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recipiant.email,
      subject: recipiant.subject,
      text: recipiant.body,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};
