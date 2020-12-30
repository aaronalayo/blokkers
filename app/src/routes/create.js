const route = require("express").Router();

const fs = require("fs");

const PDFDocument = require("pdfkit");
const builder = require("xmlbuilder", { encoding: "utf-8" });
const fsExtra = require("fs-extra");
let config = require("../ftp.js");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();

const Customer = require("../model/Customer.js");
const Order = require("../model/Order.js");
const Format = require("../model/Format.js");
const checkParameter = require("../middelware/checkParameters.js");

route.post("/createorder", async (req, res) => {
  const { posters, fullname, phone, email, address, city, zip } = req.body;

  const newPosters = checkParameter(posters);
  const newFullName = checkParameter(fullname);
  const newPhone = checkParameter(phone);
  const newAddress = checkParameter(address);
  const newCity = checkParameter(city);
  const newZip = checkParameter(zip);


  try {
    const output = "./public/output/";
    await fsExtra.emptyDir(output);
    const ext = {
      pdf: ".pdf",
      xml: ".xml",
    };


    // if ((newFullName, newPhone, newAddress, newCity, newZip !== false)) {
    //   if ((newFullName, newPhone, newAddress, newCity, newZip !== "")) {
    //     await Customer.query()
    //       .insert({
    //         full_name: newFullName,
    //         phone: newPhone,
    //         email: email,
    //         delivery_address: newAddress,
    //         delivery_zip_code: newZip,
    //         delivery_city: newCity,
    //         invoice_address: newAddress,
    //         invoice_zip_code: newZip,
    //         invoice_city: newCity,
    //       })
    //       .skipUndefined();
    //   }
    // }

    // const customer = await Customer.query()
    //   .select()
    //   .where({ full_name: newFullName })
    //   .skipUndefined();
    // console.log(customer);

    if (newPosters !== false) {
      if (newPosters !== "") {
      for (let i = 0; i <= newPosters.length - 1; i++) {
        let posterName = newPosters[i].pname;
        let posterSize = newPosters[i].size;
        let posterPaths = newPosters[i].paths;
        let posterAmount = newPosters[i].amount;

        // console.log(posterSize)
        // const formats = await Format.query().select().where({format_no:posterSize}).skipUndefined();
        // console.log(formats)

        // await Order.query()
        // .insert({
        //   order_title : posterName,
        //   amount : posterAmount,
        //   pdf_fil_name : posterName,
        //   price_per_item: 400.00,
        //   total_price:400.00 * posterAmount,

          

        // });


        const orderNo = "001"; //from database
        const shopNo = "PinkOrange";
        const deliveryShopName = fullname;
        const deliveryAddress = address;
        const deliveryZipCode = zip;
        const deliveryCity = city;
        const deliveryEmail = email;
        const itemNo = posterSize; //Defined by PinkOrange
        const itemName = posterName;
        const dimension = "Plakater " + posterSize;
        const pages = 1;
        const amount = posterAmount;
        const pdfFileName = orderNo + "_" + posterName;
        const pricePerItem = 400.0; // from database
        const ftp_addr = "ftp://EksternTest:h242svgw@94.231.99.28";

       
        let localPdf = output + `${pdfFileName}` + `${ext["pdf"]}`;
        let localXml = output + `${pdfFileName}` + `${ext["xml"]}`;

        fs.writeFile(localPdf, posterName, function (err) {
          if (err) throw err;
          console.log("File created!");
        });

        let sizes = {
          A0: (2383.94, 3370.39),
          A1: [1683.78, 2383.94],
          A2: [1190.55, 1683.78],
          A3: [841.89, 1190.55],
          A4: [595.28, 841.89],
          A5: [419.53, 595.28],
          A6: [297.64, 419.53],
          A7: [209.76, 297.64],
          A8: [147.4, 209.76],
          A9: [104.88, 147.4],
          A10: [73.7, 104.88],
        };
        let pdfSize;
        for (let [key] of Object.entries(sizes)) {
          if (posterSize == key) {
            pdfSize = sizes[key];
          }
        }

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
            doc.image("./public" + posterPaths[j], x, y, {
              fit: [pdfSize[0] / 3, pdfSize[1] / 4],
            });
            x += pdfSize[0] / 3;
          }
          y += pdfSize[1] / 4;
          k = k + 3;
        }
        doc.end();

        let xmlOrder = {
          PrintOrder: {
            "@encodingCheck": "ÅÆØåæø€©",
            "@version": "1.0",
            OrderNo: orderNo,
            OrderTitle: `${itemName}` + `${orderNo}`,
            ShopNo: shopNo,
            DeliveryShopName: deliveryShopName,
            DeliveryAddress: deliveryAddress,
            DeliveryZipCode: deliveryZipCode,
            DeliveryCity: deliveryCity,
            DeliveryEmail: deliveryEmail,
            ItemNo: itemNo,
            ItemName: itemName,
            Dimensions: dimension,
            Pagess: pages,
            Amount: amount,
            PdfFileName: `${pdfFileName}` + `${ext["pdf"]}`,
            Comment: "",
            PricePerItem: pricePerItem,
            TotalPrice: pricePerItem * amount,
            ftp_addr: ftp_addr,
          },
        };
        let xml = builder
          .create(xmlOrder, { encoding: "UTF-8" })
          .end({ pretty: true });

        fs.writeFile(localXml, xml, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("XML saved!");
          }
        });
      }
    }
  }
      let localPdf = [];
      let localXml = []; 
      let remotePdf = [];
      let remoteXml  = [];

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
  } catch (error) {
    console.log(error);
  }
});



module.exports = route;

