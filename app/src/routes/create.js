const route = require("express").Router();

const fs = require("fs");
const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const checkOutPage = fs.readFileSync("./public/checkoutpage.html", 'utf8');
const paymentPage = fs.readFileSync("./public/paymentpage.html", 'utf8');

const PDFDocument = require("pdfkit");
const builder = require("xmlbuilder", { encoding: "utf-8" });
const fsExtra = require("fs-extra");
let config = require("../ftp.js");
let EasyFtp = require("easy-ftp");
let ftp = new EasyFtp();

const Customer = require("../model/Customer.js");
const Order = require("../model/Order.js");
const Format = require("../model/Format.js");
const Item = require("../model/Item.js");

const checkParameter = require("../middelware/checkParameters.js");
const { generalTextFilter, eMailFilter } = require("../middelware/generalTextFilter");
const setValueToNull = require("../middelware/setValueNull.js");




route.post("/createorder", async (req, res) => {
  console.log(req.body)
   
    const { 
      posters, 
      fullname, 
      phone, 
      email, 
      address, 
      city, 
      zip, 
      invoicefullname, 
      invoicephone,
      invoiceaddress,
      invoicecity,
      invoicezip } = req.body;

  const newPosters = checkParameter(posters);
  const newFullName = checkParameter(fullname);
  const newPhone = checkParameter(phone);
  const newAddress = checkParameter(address);
  const newCity = checkParameter(city);
  const newZip = checkParameter(zip);
  const newInvoiceFullName = setValueToNull(invoicefullname);
  const newInvoicePhone = setValueToNull(invoicephone);
  const newInvoiceAddress = setValueToNull(invoiceaddress);
  const newInvoiceCity = setValueToNull(invoicecity);
  const newInvoiceZip = setValueToNull(invoicezip);
 

  try {

      if (newPosters, newFullName, newPhone, newAddress, newCity, newZip, email){

          
          await Customer.query().insert({           
            email: email,
            full_name: newFullName,
            address: newAddress,
            phone: newPhone,
            zip_code:newZip,
            city:newCity,
            invoice_full_name: newInvoiceFullName,
            invoice_phone: newInvoicePhone,
            invoice_address: newInvoiceAddress,
            invoice_zip_code: newInvoiceCity,
            invoice_city: newInvoiceZip,
          
          });
        

          const customers = await Customer.query()
            .select()
            .where({ full_name: newFullName });

          newPosters.forEach(async (poster) => {
            const formats = await Format.query()
              .select()
              .where({ format_no: poster.size })
              .limit(1);
            customers.forEach((customer)=>{

            
            formats.forEach(async (format) => {
              await Item.query().insert({
                item_name: poster.pname,
                format_uuid: format.format_uuid,
              });

              const newItem = await Item.query()
                .select()
                .where({ item_name: poster.pname })
                .limit(1);
              newItem.forEach(async (item) => {
                await Order.query().insert({
                  order_title: item.item_name,
                  amount: poster.amount,
                  price_per_item: format.price,
                  total_price: format.price * poster.amount,
                  item_uuid: item.item_uuid,
                  customer_uuid: customer.customer_uuid,
                });
              });
            });
          });
        });
          res.redirect('/payment');
        }
  } catch (error) {
    console.log(error);
  }
});



function createPdfXml(){

    // const output = "./public/output/";
    // await fsExtra.emptyDir(output);
    // const ext = {
    //   pdf: ".pdf",
    //   xml: ".xml",
    // };
    
    // const orders = await Order.query()
    //   .select()
    //   .withGraphJoined("customer")
    //   .withGraphJoined("item");
    // console.log(orders);
    // let order_no = [];
    // let price_per_item = [];
    // let total_price = [];
    // for (let m = 0; m < orders.length; m++) {
    //   let obj = orders[m];
    //   for (let key in obj) {
    //     order_no.push(obj["order_no"]);
    //     price_per_item.push(obj["price_per_item"]);
    //     total_price.push(obj["total_price"]);
     
    
    // const orderNo = order_no;
    // const shopNo = "PinkOrange";
    // const deliveryShopName = fullname;
    // const deliveryAddress = address;
    // const deliveryZipCode = zip;
    // const deliveryCity = city;
    // const deliveryEmail = email;
    // const itemNo = poster.size; //Defined by PinkOrange
    // const itemName = poster.pname;
    // const dimension = "Plakater " + poster.size;
    // const pages = 1;
    // const amount = poster.amount;
    // const pdfFileName = orderNo + "_" + poster.pname;
    // const pricePerItem = price_per_item[m]; 
    // const TotalPrice = total_price[m];
    // const ftp_addr = "ftp://EksternTest:h242svgw@94.231.99.28";
  
    //     let localPdf = output + `${pdfFileName}` + `${ext["pdf"]}`;
    //     let localXml = output + `${pdfFileName}` + `${ext["xml"]}`;

    //     fs.writeFile(localPdf, itemName, function (err) {
    //       if (err) throw err;
    //       console.log("File created!");
    //     });

    //     let sizes = {
    //       A0: (2383.94, 3370.39),
    //       A1: [1683.78, 2383.94],
    //       A2: [1190.55, 1683.78],
    //       A3: [841.89, 1190.55],
    //       A4: [595.28, 841.89],
    //       A5: [419.53, 595.28],
    //       A6: [297.64, 419.53],
    //       A7: [209.76, 297.64],
    //       A8: [147.4, 209.76],
    //       A9: [104.88, 147.4],
    //       A10: [73.7, 104.88],
    //     };
    //     let pdfSize;
    //     for (let [key] of Object.entries(sizes)) {
    //       if (poster.size == key) {
    //         pdfSize = sizes[key];
    //       }
    //     }

    //     const doc = new PDFDocument({
    //       size: pdfSize,
    //       margins: {
    //         // by default, all are 72
    //         top: 0,
    //         bottom: 0,
    //         left: 0,
    //         right: 0,
    //       },
    //     });
    //     doc.pipe(fs.createWriteStream(localPdf));

    //     let x = 0;
    //     let y = 0;
    //     let k = 0;
    //     for (let i = 0; i <= 3; i++) {
    //       x = 0;
    //       for (let j = k; j <= k + 2; j++) {
    //         doc.image("./public" + poster.paths[j], x, y, {
    //           fit: [pdfSize[0] / 3, pdfSize[1] / 4],
    //         });
    //         x += pdfSize[0] / 3;
    //       }
    //       y += pdfSize[1] / 4;
    //       k = k + 3;
    //     }
    //     doc.end();

    //     let xmlOrder = {
    //       PrintOrder: {
    //         "@encodingCheck": "ÅÆØåæø€©",
    //         "@version": "1.0",
    //         OrderNo: orderNo,
    //         OrderTitle: `${itemName}` + `${orderNo}`,
    //         ShopNo: shopNo,
    //         DeliveryShopName: deliveryShopName,
    //         DeliveryAddress: deliveryAddress,
    //         DeliveryZipCode: deliveryZipCode,
    //         DeliveryCity: deliveryCity,
    //         DeliveryEmail: deliveryEmail,
    //         ItemNo: itemNo,
    //         ItemName: itemName,
    //         Dimensions: dimension,
    //         Pages: pages,
    //         Amount: amount,
    //         PdfFileName: `${pdfFileName}` + `${ext["pdf"]}`,
    //         Comment: "",
    //         PricePerItem: pricePerItem,
    //         TotalPrice: TotalPrice,
    //         ftp_addr: ftp_addr,
    //       },
    //     };
    //     let xml = builder
    //       .create(xmlOrder, { encoding: "UTF-8" })
    //       .end({ pretty: true });

    //     fs.writeFile(localXml, xml, function (err) {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         console.log("XML saved!");
    //       }
    //     });
    //   }

    // }
};

function sendPdf(){
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
}
module.exports = route;
