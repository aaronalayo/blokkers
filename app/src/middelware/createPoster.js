const PDFDocument = require("pdfkit");
const path = require('path');
const fs = require("fs");
const fsPromises = fs.promises;

//Function to create a PDF file from a poster
module.exports = async function createPoster(poster) {
  console.log(poster);
  let pathArr = [];
  for (let i = 0; i < poster.paths.length; i++) {
    pathArr.push(poster.paths[i]);
  }
  let pdfSize = poster.pdfSize;
  let localPdf = poster.pdfLocal;

  const doc = new PDFDocument({
    size: pdfSize,
    margins: {
      // by default, all are 72
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  // let pdfPoster = fs.createWriteStream(localPdf)
  // doc.pipe(pdfPoster);

  // let x = 0;
  // let y = 0;
  // let k = 0;
  // for (let i = 0; i <= 3; i++) {
  //   x = 0;
  //   for (let j = k; j <= k + 2; j++) {
  //     doc.image("./public" + pathArr[j], x, y, {
  //       fit: [pdfSize[0] / 3, pdfSize[1] / 4],
  //     });
  //     x += pdfSize[0] / 3;
  //   }
  //   y += pdfSize[1] / 4;
  //   k = k + 3;
  // }
  // doc.end();
  await savePdfToFile(doc, localPdf, pathArr, pdfSize);
};
function savePdfToFile(pdf, fileName, paths, pdfSize) {
  return new Promise((resolve, reject) => {
    // To determine when the PDF has finished being written successfully
    // we need to confirm the following 2 conditions:
    //
    //   1. The write stream has been closed
    //   2. PDFDocument.end() was called syncronously without an error being thrown

    let pendingStepCount = 2;

    const stepFinished = () => {
      if (--pendingStepCount == 0) {
        resolve();
      }
    };

    const writeStream = fs.createWriteStream(fileName);
    writeStream.on("close", stepFinished);
    pdf.pipe(writeStream);
    

    let x = 0;
    let y = 0;
    let k = 0;
    let pathToPublic = path.resolve('./public');
    console.log(pathToPublic)
    for (let i = 0; i <= 3; i++) {
      x = 0;
      for (let j = k; j <= k + 2; j++) {
        pdf.image(pathToPublic + paths[j], x, y, {
          fit: [pdfSize[0] / 3, pdfSize[1] / 4],
        });
        x += pdfSize[0] / 3;
      }
      y += pdfSize[1] / 4;
      k = k + 3;
    }
    pdf.end();

    stepFinished();
  });
}
