const nodemailer = require("nodemailer");
const config = process.env;


const transporter = nodemailer.createTransport({
  service: "One",
  host: 'mailout.one.com',
  port:	587,
  secure: true,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

module.exports = transporter;