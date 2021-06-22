const PDFDocument = require("pdfkit");
const fs = require("fs");

//Function to create a PDF file from a poster
module.exports = async function createPoster(poster) {
  // console.log(poster);
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
  

    doc.pipe(fs.createWriteStream(localPdf));
  
    let x = 0;
    let y = 0;
    let k = 0;
    for (let i = 0; i <= 3; i++) {
      x = 0;
      for (let j = k; j <= k + 2; j++) {
        doc.image("./public" + pathArr[j], x, y, {
          fit: [pdfSize[0] / 3, pdfSize[1] / 4],
        });
        x += pdfSize[0] / 3;
      }
      y += pdfSize[1] / 4;
      k = k + 3;
    }
    doc.end();
  }
  