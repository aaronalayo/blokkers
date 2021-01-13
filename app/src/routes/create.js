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
      invoicezip,
      newsletter
    } = req.body;

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
      if (newPosters, newFullName, newPhone, newAddress, newCity, newZip, email, newsletter){
        const customerFound = await Customer.query().select()
            .where({
              full_name: newFullName,
              email: email,
            })
            .limit(1);
         
          if (customerFound.length > 0) {
            console.log("found:",customerFound);
  
            newPosters.forEach(async (poster) => {
              console.log(poster.paths)
              const format = await Format.query()
                .select()
                .where({ format_no: poster.size })
                .limit(1);
              
              await Item.query().insert({
                item_name: poster.pname,
                item_no: poster.size,
                item_paths: poster.paths,
                format_uuid: format[0].format_uuid
              });

              const newItem = await Item.query()
                .select()
                .where({ item_name: poster.pname })
                .limit(1);
    
              await Order.query().insert({
                 order_title: newItem[0].item_name,
                 amount: poster.quantity,
                 price_per_item: format[0].price,
                 total_price: format[0].price * poster.quantity,
                 item_uuid: newItem[0].item_uuid,
                 customer_uuid: customerFound[0].customer_uuid,
              });
            });
        } else {
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
            enable_newsletter: newsletter
          
          });
        
          const customer = await Customer.query()
            .select()
            .where({ full_name: newFullName }).where({email:email}).limit(1);

          newPosters.forEach(async (poster) => {
            const format = await Format.query()
              .select()
              .where({ format_no: poster.size })
              .limit(1);
           
            await Item.query().insert({
              item_name: poster.pname,
              item_no: poster.size,
              item_paths: poster.paths,
              format_uuid: format[0].format_uuid
            });

            const newItem = await Item.query()
              .select()
              .where({ item_name: poster.pname })
              .limit(1);
              
            await Order.query().insert({
              order_title: newItem[0].item_name,
              amount: poster.quantity,
              price_per_item: format[0].price,
              total_price: format[0].price * poster.quantity,
              item_uuid: newItem[0].item_uuid,
              customer_uuid: customer[0].customer_uuid,
            });
        });  
      }  
      return res.redirect('/payment');
    }     
  } catch (error) {
    console.log(error);
  }
});


route.post("/sendfiles", async (req, res) => {
  
  console.log(req.body);
  const customer = req.body.customer;
  let orderSent =[];
  try {
    const output = "./public/output/";
    await fsExtra.emptyDir("./public/output");
  
    const ext = {
      pdf: ".pdf",
      xml: ".xml",
    };
      
    const orders = await Order.query()
      .select()
      .withGraphJoined("customer").where({ full_name: customer.fullname }).where({email:customer.email})
      .withGraphJoined("item");
  
    orders.forEach(order => {
      orderSent.push(order.order_no);

      const orderNo = order.order_no;
      const shopNo = "PinkOrange";
      const deliveryShopName = order.customer.full_name;
      const deliveryAddress = order.customer.address; 
      const deliveryZipCode = order.customer.zip;
      const deliveryCity = order.customer.city;
      const deliveryEmail = order.customer.email;
      const itemNo = order.item.item_no; //Defined by PinkOrange
      const itemName = order.order_title;
      const dimension = "Plakater " + itemNo;
      const pages = 1;
      const amount =order.amount;
      const pdfFileName = orderNo + "_" + itemName;
      const pricePerItem = order.price_per_item; 
      const TotalPrice = order.total_price;
      const ftp_addr = "ftp://EksternTest:h242svgw@94.231.99.28";

          let localPdf = output + pdfFileName + ext["pdf"];
          let localXml = output + pdfFileName + ext["xml"];
  
          fs.writeFile(localPdf, itemName, function (err) {
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
            if (order.item.item_no == key) {
              pdfSize = sizes[key];
            }
          };

          let paths = order.item.item_paths.slice(1,324).replace(/"/g, '');
          let pathArr = []
          for(let i=0; i< paths.length; i++){
           pathArr= paths.split(',');
          };

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
  
          let xmlOrder = {
            PrintOrder: {
              "@encodingCheck": "ÅÆØåæø€©",
              "@version": "1.0",
              OrderNo: orderNo,
              OrderTitle: itemName + " Order #"+orderNo,
              ShopNo: shopNo,
              DeliveryShopName: deliveryShopName,
              DeliveryAddress: deliveryAddress,
              DeliveryZipCode: deliveryZipCode,
              DeliveryCity: deliveryCity,
              DeliveryEmail: deliveryEmail,
              ItemNo: itemNo,
              ItemName: itemName,
              Dimensions: dimension,
              Pages: pages,
              Amount: amount,
              PdfFileName: `${pdfFileName}` + `${ext["pdf"]}`,
              Comment: "",
              PricePerItem: pricePerItem,
              TotalPrice: TotalPrice,
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
        })
    sendPdf()
    orderSent.forEach(async sentOrder => {
      await Order.query()
      .select().update({
        xml_sent: true,
        pdf_sent: true
      }).where({order_no: sentOrder });
    });

        
  } catch (error) {
    console.log(error);
  }
});


function sendPdf(){
  const output = "./public/output/";
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
