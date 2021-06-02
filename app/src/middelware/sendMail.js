const transporter = require("../nodemailer.js");

module.exports = function sendMail(){
    const mailOptions = {
        from: 'Blokkers <hello@blokkers.dk>', 
        to: "editoraaron@gmail.com",
        subject: "Hello from Blokkers",
        text: "This is the body",
        // html: `<h1>Testing mail</h1>`,
    
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).send({
            message: "Could not send email, got the following error :",
            error,
          });
        } else {
          res.status(200).send(info);
        }
      });

    
    
}

