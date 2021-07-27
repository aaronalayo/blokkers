const fs = require("fs");
let config = require("../ftp.js");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();
const path = require('path');
const fsPromises = fs.promises;

//Function to send PDL and XML files to FTP server
module.exports = function sendPdfXml() {
// console.log(order, items, paymentDetails, date, discount)
  try {
    listDir()
      .then((arr) => {
        console.log(arr);
        ftp.upload(arr, function (err) {
          if (err) {
            console.log("This is ftp :" + err);
            ftp.close();
          } else {
            console.log("Uploaded pdf and xml!");
            ftp.close();
            
          }
        });
        ftp.connect(config);
      })
      .catch(function (err) {
        console.log(err);
      });
      
    // });
  } catch (err) {
    console.error(err);
  }
};

async function listDir() {
   let output = path.join(__dirname, "../output/");
  // let output = "/aaron/blokkers/app/output/";
  let localPdf = [];
  let localXml = [];
  let remotePdf = [];
  let remoteXml = [];
  let arr = [];
  try {
    return await fsPromises.readdir(output, "utf-8").then((files) => {
      files.forEach((file) => {
        if (file.split(".").pop() === "pdf") {
          localPdf.push(output + file);
          remotePdf.push("/" + file);
        } else if (file.split(".").pop() === "xml") {
          localXml.push(output + file);
          remoteXml.push("/" + file);
        }
      });
      for (let i = 0; i <= remotePdf.length - 1; i++) {
        arr.push(
          { local: localPdf[i], remote: remotePdf[i] },
          { local: localXml[i], remote: remoteXml[i] }
        );
      }
      return arr;
    });
  } catch (err) {
    console.error("Error occured while reading directory!", err);
  }
}
