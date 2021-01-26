const fs = require("fs");
let config = require("../ftp.js");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();



//Function to send PDL and XML files to FTP server
module.exports = function sendPdfXml() {
    const output = "./public/output/";
    let localPdf = [];
    let localXml = [];
    let remotePdf = [];
    let remoteXml = [];
  
    let files = fs.readdirSync(output, "utf-8");
    files.forEach((file) => {
      if (file.split(".").pop() === "pdf") {
        localPdf.push(output + file);
        remotePdf.push("/" + file);
      } else if (file.split(".").pop() === "xml") {
        localXml.push(output + file);
        remoteXml.push("/" + file);
      }
    });
  
    let arr = [];
    for (let i = 0; i <= remotePdf.length - 1; i++) {
      arr.push(
        { local: localPdf[i], remote: remotePdf[i] },
        { local: localXml[i], remote: remoteXml[i] }
      );
    }
  
    ftp.upload(arr, function (err) {
      if (err) {
        console.log(err);
        ftp.close();
      } else {
        console.log("Uploaded pdf and xml!");
        ftp.close();
      }
    });
    ftp.connect(config);
  };