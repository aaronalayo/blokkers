const fs = require("fs");
let config = require("../ftp.js");
let Bluebird = require("bluebird");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();
const { promisify } = require('util');
const readDir = promisify(fs.readdirSync);


//Function to send PDL and XML files to FTP server
module.exports = function sendPdfXml() {
 try {
    let output = "./public/output/";
    let localPdf = [];
    let localXml = [];
    let remotePdf = [];
    let remoteXml = [];
  
    let files =  fs.readdirSync(output, "utf-8");
    files.forEach((file) => {
      if (file.split(".").pop() === "pdf") {
        localPdf.push(output + file);
        remotePdf.push("/" + file);
      } else if (file.split(".").pop() === "xml") {
        localXml.push(output + file);
        remoteXml.push("/" + file);
      }
    });
     // Promisifying adds Async after every method which represents the promise version of that method... you don't have to follow the callback method.
// Bluebird.promisifyAll(ftp);

// ftp.connect(config);

// // push your promises into an array and then Promise.all() it... It will either complete fully or throw an error even if one fails.... All or nothing.

// let promises = [];

//     let arr = [];
//     for (let i = 0; i <= remotePdf.length - 1; i++) {
//       arr.push(
//         { local: localPdf[i], remote: remotePdf[i] },
//         { local: localXml[i], remote: remoteXml[i] }
//       );
//     }
// promises.push(arr);
// // Now promises array contains all the promises and they have started executing.

// Bluebird.all(promises).then(function(results) {

//      // Results is an array of results from all the promises in order.
//      console.log(results)
//     ftp.upload(results)
//      console.log("files sent"+results);

//      // Close connection.
//      ftp.close();
// }).catch(function(err) {
//      console.log(err);
// });
//   }catch (err){
//   console.error(err);
//  } 
//   };

  
    let arr = [];
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
      
 }catch (err){
  console.error(err);
 } 
  };

 