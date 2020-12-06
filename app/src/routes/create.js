const route = require("express").Router();

const PDFDocument = require("pdfkit");
const fs = require("fs");

// const readFile = promisify(fs.readFile);

const fsExtra = require("fs-extra");

route.post("/createorder", async (req, res) => {
  var { paths, size, name } = req.body;

  const output = "./public/output/";
  await fsExtra.emptyDir(output);

  fs.writeFile("./public/output/" + `${name}` + ".pdf", name, function (err) {
    if (err) throw err;
    console.log("File created!");
  });

  var sizes = {
    A0: (2383.94, 3370.39),
    A1: (1683.78, 2383.94),
    A2: (1190.55, 1683.78),
    A3: (841.89, 1190.55),
    A4: (595.28, 841.89),
    A5: (419.53, 595.28),
    A6: (297.64, 419.53),
    A7: (209.76, 297.64),
    A8: (147.4, 209.76),
    A9: (104.88, 147.4),
    A10: (73.7, 104.88),
  };
  const doc = new PDFDocument({
    size: [841.89, 1190.55],
    margins: {
      // by default, all are 72
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
  doc.pipe(fs.createWriteStream("./public/output/" + `${name}` + ".pdf"));

  var x = 0;
  var y = 0;
  var k = 0;
  for (var i = 0; i <= 3; i++) {
    x = 0;
    for (var j = k; j <= k + 2; j++) {
      doc.image("./public" + paths[j], x, y, {
        fit: [280.63, 297.6375],
      });
      x += 280.63;
    }
    y += 297.6375;
    k = k + 3;
  }
  doc.end();
});

module.exports = route;
