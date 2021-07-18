const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const Order = require('../model/Order');

const sendXmlPdf = require("../middelware/sendXmlPdf.js");
const sendMail = require('../middelware/sendMail');

module.exports = function createPoster(posters, orderSent, order, items, paymentDetails, date, discount) {
    let pdfs = [];
    let paths = [];
    // console.log("These are the posters to create:", JSON.stringify(posters));
  posters.forEach((poster) => {
    console.log("Creating poster in: ", poster.pdfLocal)
    let pdf = new PDFDocument({
      size: poster.pdfSize,
      margins: {
        // by default, all are 72
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    let x = 0;
    let y = 0;
    let k = 0;
    let pathToPublic = path.resolve("public/");
    for (let i = 0; i <= 3; i++) {
      x = 0;
      for (let j = k; j <= k + 2; j++) {
        // console.log(poster.paths[j])
        pdf.image(pathToPublic + poster.paths[j], x, y, {
          fit: [poster.pdfSize[0] / 3, poster.pdfSize[1] / 4],
        });
        x += poster.pdfSize[0] / 3;
      }
      y += poster.pdfSize[1] / 4;
      k = k + 3;
    }
    
   pdfs.push(pdf);
   
   paths.push(poster.pdfLocal);
  });

  writePdfArray(pdfs, paths).then(function() {
    setTimeout(function() {
      updateOrder(orderSent);
    });
  }).then(function (){
    setTimeout(function() {
    sendMail(order, items, paymentDetails, date, discount);
  });
  });
  
   
};

function writePdfArray(pdfs, paths, steps = 0) {
  
  return new Promise((resolve, reject) => {
    let index = steps;
    steps++;
    let pdf = pdfs[index];
    let path = paths[index];
    // console.log("Writing pdf path",paths[index]);
    try {
      let writeStream = fs.createWriteStream(path);
      pdf.pipe(writeStream);
      pdf.end();
      writeStream.on("finish", function () {
        resolve();
        if(steps < pdfs.length){
          writePdfArray(pdfs, paths, steps);
          console.log("pdf finished");
        }else {
          sendXmlPdf();
          console.log("Sending files");
        }

        
      });
      
      
    } catch (error) {
      console.log(error);
    }
  });
}
  //Update the order after the files are sent to FTP server
  function updateOrder(orderSent){
    try {
   orderSent.forEach( async (sentOrder) => {
     await Order.query()
       .select()
       .update({
         xml_sent: true,
         pdf_sent: true,
         order_confirmed: true,
       })
       .where({ order_no: sentOrder });
   });
   console.log("Order updated");
  } catch (error) {
      console.log(error);
  }
  };
  
  
  