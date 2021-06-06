const transporter = require("../nodemailer.js");
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);



module.exports = async function sendMail(email){
  let paymentPage = await readFile("./public/paymentpage.html", 'utf8');

 
    const mailOptions = {
        from: 'Blokkers <hello@blokkers.dk>', 
        to: email,
        subject: "Hello from Blokkers",
        text: "Thanks for shopping with us",
        html:paymentPage,
    
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).send({
            message: "Could not send email, got the following error :",
            error,
          });
        } else {
          // res.status(200).send(info);
          console.log('mail sent');
        }
      });

    
    
}

