const route = require("express").Router();

const fs = require("fs");
const PDFDocument = require("pdfkit");
const builder = require("xmlbuilder", { encoding: "utf-8" });
// const readFile = promisify(fs.readFile);

const fsExtra = require("fs-extra");

route.post("/createorder", async (req, res) => {
  const { paths, size, name } = req.body;
  const ext = {
    pdf: ".pdf",
    xml: ".xml",
  };

  const orderNo = "001";
  const shopNo = "PinkOrange";
  const deliveryAddress = "Flakholmen 28 st th";
  const deliveryZipCode = "2720";
  const deliveryCity = "Copenhagen";
  const deliveryEmail = "aaron.aa@me.com";
  const itemNo = "PO-01";
  const itemName = name;
  const dimesions = "Plakater " + size;
  const pages = 1;
  const amount = 1;
  const pdfFileName = orderNo + name;
  const pricePerItem = 400.0;
  const ftp_addr = "ftp://EksternTest:h242svgw@94.231.99.28";

  const output = "./public/output/";
  await fsExtra.emptyDir(output);

  fs.writeFile(
    "./public/output/" + pdfFileName + ext["pdf"],
    name,
    function (err) {
      if (err) throw err;
      console.log("File created!");
    }
  );

  var sizes = {
    A0: (2383.94, 3370.39),
    A1: [1683.78, 2383.94],
    A2: [1190.55, 1683.78],
    A3: [841.89, 1190.55],
    A4: (595.28, 841.89),
    A5: (419.53, 595.28),
    A6: (297.64, 419.53),
    A7: (209.76, 297.64),
    A8: (147.4, 209.76),
    A9: (104.88, 147.4),
    A10: (73.7, 104.88),
  };
  for (var [key, value] of Object.entries(sizes)) {
    if (size == key) {
      var pdfSize = sizes[key];
      console.log(pdfSize);
    }
  }
  console.log(typeof pdfSize);
  console.log(pdfSize);
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
  doc.pipe(fs.createWriteStream("./public/output/" + pdfFileName + ext["pdf"]));

  var x = 0;
  var y = 0;
  var k = 0;
  for (var i = 0; i <= 3; i++) {
    x = 0;
    for (var j = k; j <= k + 2; j++) {
      doc.image("./public" + paths[j], x, y, {
        fit: [pdfSize[0] / 3, pdfSize[1] / 4],
      });
      x += pdfSize[0] / 3;
    }
    y += pdfSize[1] / 4;
    k = k + 3;
  }
  doc.end();

  var xmlOrder = {
    PrintOrder: {
      "@encodingCheck": "ÅÆØåæø€©",
      "@version": "1.0",
      OrderNo: orderNo,
      OrderTitle: `${itemName}` + `${orderNo}`,
      ShopNo: shopNo,
      DeliveryShopName: shopNo,
      DeliveryAddress: deliveryAddress,
      DeliveryZipCode: deliveryZipCode,
      DeliveryCity: deliveryCity,
      DeliveryEmail: deliveryEmail,
      ItemNo: itemNo,
      ItemName: itemName,
      Dimensions: dimesions,
      Pagess: pages,
      Amount: amount,
      PdfFileName: pdfFileName + ext["pdf"],
      Comment: "",
      PricePerItem: pricePerItem,
      TotalPrice: pricePerItem * amount,
      ftp_addr: ftp_addr,
    },
  };
  var xml = builder
    .create(xmlOrder, { encoding: "UTF-8" })
    .end({ pretty: true });

  console.log(xml);
  fs.writeFile(
    "./public/output/" + pdfFileName + ext["xml"],
    xml,
    function (err) {
      if (err) throw err;
      console.log("It's saved!");
    }
  );
});

module.exports = route;
