const fs = require("fs");
let config = require("../ftp.js");
// const { promisify } = require("util");
// const readDirSync = promisify(fs.readdirSync);
// const Bluebird = require("Bluebird");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();

const fsPromises = fs.promises;

//Function to send PDL and XML files to FTP server
module.exports = function sendPdfXml() {
  // Bluebird.promisifyAll(ftp);
  // let promises = [];
  // ftp.connect(config);
  try {
    // let output = "./output/";
    // let output = "/home/aaron/blokkers/app/output/";
    // let localPdf = [];
    // let localXml = [];
    // let remotePdf = [];
    // let remoteXml = [];
    // let arr = [];
    // fs.readdirSync(output, "utf-8", (err, files)=>{
    //   if(err){
    //      throw err;
    //   }
    //   let files =  fs.readdirSync(output, "utf-8");
    //   files.forEach(( file) => {
    //     if (file.split(".").pop() === "pdf") {
    //       localPdf.push(output + file);
    //       remotePdf.push("/" + file);
    //     } else if (file.split(".").pop() === "xml") {
    //       localXml.push(output + file);
    //       remoteXml.push("/" + file);
    //     }

    // });
    // });
    // for (let i = 0; i <= remotePdf.length - 1; i++) {
    //   arr.push(
    //     { local: localPdf[i], remote: remotePdf[i] },
    //     { local: localXml[i], remote: remoteXml[i] }
    //   );
    // promises.push(ftp.upload( { local: localPdf[i], remote: remotePdf[i] },
    //     { local: localXml[i], remote: remoteXml[i] }))
    // }
    // ftp.upload(arr, function (err) {
    //   if (err) {
    //     console.log("This is ftp :" + err);
    //     ftp.close();
    //   } else {
    //     console.log("Uploaded pdf and xml!");
    //     ftp.close();
    //   }
    // });
    listDir()
      .then((arr) => {
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
        console.log(arr);
        // ftp.connect(config);
        // promises.push(ftp.upload(arr));
        // Bluebird.all(promises).then(function(results) {

        //   // Results is an array of results from all the promises in order.

        //   console.log(results);

        //   // Close connection.
        //   ftp.close();
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
  let output = "./output/";
  // let output = "/home/aaron/blokkers/app/output/";
  let localPdf = [];
  let localXml = [];
  let remotePdf = [];
  let remoteXml = [];
  let arr = [];
  try {
    return fsPromises.readdir(output, "utf-8").then((files) => {
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
