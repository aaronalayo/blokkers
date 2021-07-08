const fs = require("fs");
let config = require("../ftp.js");
const { promisify } = require('util');
const readDirSync = promisify(fs.readdirSync);
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();



//Function to send PDL and XML files to FTP server
module.exports =  async function sendPdfXml() {
 try {
    // let output = "./output/";
    let output = "/home/aaron/blokkers/app/output/";
    let localPdf = [];
    let localXml = [];
    let remotePdf = [];
    let remoteXml = [];
    let arr = [];
    readDirSync(output, "utf-8", (err, files)=>{
      if(err){
         throw err;
      }
    // let files =  fs.readdirSync(output, "utf-8");
    files.forEach(( file) => {
      if (file.split(".").pop() === "pdf") {
        localPdf.push(output + file);
        remotePdf.push("/" + file);
      } else if (file.split(".").pop() === "xml") {
        localXml.push(output + file);
        remoteXml.push("/" + file);
      }

  });
});
  for (let i = 0; i <= remotePdf.length - 1; i++) {
    arr.push(
      { local: localPdf[i], remote: remotePdf[i] },
      { local: localXml[i], remote: remoteXml[i] }
    );
  }
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
    arr = '';

 }catch (err){
  console.error(err);
 } 
    
  };

 