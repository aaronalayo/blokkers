const route = require("express").Router();
const request = require('request');

const fs = require("fs");
const axios = require('axios');
const builder = require("xmlbuilder", { encoding: "utf-8" });
const fsExtra = require("fs-extra");


const Customer = require("../model/Customer.js");
const Order = require("../model/Order.js");
const Format = require("../model/Format.js");
const Item = require("../model/Item.js");

const checkParameter = require("../middelware/checkParameters.js");
const setValueToNull = require("../middelware/setValueNull.js");
const sendXmlPadf = require("../middelware/sendXmlPdf.js");
const createPoster = require("../middelware/createPoster.js");

route.post("/createpaymentorder", async (req, res) => {

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
    newsletter,
  } = req.body;

  //Check if values are empty or null
  const newPosters = checkParameter(posters);
  const newFullName = checkParameter(fullname);
  const newPhone = checkParameter(phone);
  const newAddress = checkParameter(address);
  const newCity = checkParameter(city);
  const newZip = checkParameter(zip);
  //Check if values are empty set them to null
  const newInvoiceFullName = setValueToNull(invoicefullname);
  const newInvoicePhone = setValueToNull(invoicephone);
  const newInvoiceAddress = setValueToNull(invoiceaddress);
  const newInvoiceCity = setValueToNull(invoicecity);
  const newInvoiceZip = setValueToNull(invoicezip);

  try {
    if (
      (newPosters,
      newFullName,
      newPhone,
      newAddress,
      newCity,
      newZip,
      email,
      newsletter)
    ) {
      console.log(newPosters)
      let items = [];
      let amount = 0;
    

        newPosters.forEach(async (poster) => {
          let subAmount =0;
          console.log(typeof poster.price)
        const item = {
          "reference": `${poster.pname}`,
          "name": `${poster.pname}`,
          "quantity": `${poster.quantity}`,
          "unit": "poster",
          "unitPrice": (poster.price * 100) - 2500,
          "taxRate": 2500,
          "taxAmount": ((poster.price * 25) / 100) * 100,
          "grossTotalAmount": poster.price * poster.quantity * 100,
          "netTotalAmount": ((poster.price * 100) - 2500) * poster.quantity
        }
        items.push(item);

        subAmount = parseInt(poster.price) * parseInt(poster.quantity)*100;
        amount += subAmount;
      });
      const consumer = {
        "reference":"1",
             "email":`${email}`,
             "shippingAddress":{  
                "addressLine1":`${newAddress}`,
                "addressLine2":"",
                "postalCode":`${newZip}`,
                "city":`${newCity}`,
                "country":"DNK"
             },
             "phoneNumber":{  
                "prefix":"+45",
                "number":`${newPhone.substring(3)}`
             },
      }
      let options = {

        host: "https://cf8ab8d550a0.ngrok.io/createorder",
        uri: 'https://test.api.dibspayment.eu/v1/payments',//test
        // uri: 'https://api.dibspayment.eu/v1/payments',//live
        method: 'POST',
        body: `{
      "order": {
        "items": ${JSON.stringify(items)},
        "merchantNumber": 100020578,
        "amount": ${amount},
        "currency": "DKK",
        "reference": "Demo Order"
      }, 
      "checkout":{
        "charge":false,
        "publicDevice":true,
        "integrationType":"HostedPaymentPage",
   
        "url":"",
        "returnUrl":"https://cf8ab8d550a0.ngrok.io/payment",
        "termsUrl":"https://cf8ab8d550a0.ngrok.io/toc",
        "appearance": {
          "displayOptions": {
            "showMerchantName": true,
            "showOrderSummary": true
          },
          "textOptions": {
            "completePaymentButtonText" : "order"
          }
        },
        "merchantHandlesConsumerData":true,
        "consumer":${JSON.stringify(consumer)},
       
           "company":{  
            "name":"PinkOrange",
            "contact":{  
               "firstName":"Julia",
                "lastName":"Sand"
             }
           }
         }
    }
  }`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'ef160d0b15ef4bf3b243c8f6a6183b85'
          // 'Authorization': 'b7989e81d50b47228ac61d7763986548'
        },
       
      };
     
        request(options, function (error, response, body) {
          console.log(options)
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log("body:", body);
        if(body){
          res.json(body);
        }
        
      
      });
      
    }
  } catch (error) {
    console.log(error);
  }
});

route.post("/createorder", async (req, res) => {

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
    newsletter,
  } = req.body;

  //Check if values are empty or null
  const newPosters = checkParameter(posters);
  const newFullName = checkParameter(fullname);
  const newPhone = checkParameter(phone);
  const newAddress = checkParameter(address);
  const newCity = checkParameter(city);
  const newZip = checkParameter(zip);
  //Check if values are empty set them to null
  const newInvoiceFullName = setValueToNull(invoicefullname);
  const newInvoicePhone = setValueToNull(invoicephone);
  const newInvoiceAddress = setValueToNull(invoiceaddress);
  const newInvoiceCity = setValueToNull(invoicecity);
  const newInvoiceZip = setValueToNull(invoicezip);

  try {
    if (
      (newPosters,
      newFullName,
      newPhone,
      newAddress,
      newCity,
      newZip,
      email,
      newsletter)
    ) {
      const customerFound = await Customer.query()
        .select()
        .where({
          full_name: newFullName,
          email: email,
        })
        .limit(1);
      //Find if customer exists in the database
      if (customerFound.length > 0) {

        newPosters.forEach(async (poster) => {
          const format = await Format.query()
            .select()
            .where({ format_no: poster.size })
            .limit(1);

          //Insert a new item in the database
          await Item.query().insert({
            item_name: poster.pname,
            item_no: poster.size,
            item_paths: poster.paths,
            format_uuid: format[0].format_uuid,
          });

          const newItem = await Item.query()
            .select()
            .where({ item_name: poster.pname })
            .limit(1);

          //Insert a new order in the database
          //for an existing customer
          await Order.query().insert({
            order_title: newItem[0].item_name,
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: format[0].price * poster.quantity,
            item_uuid: newItem[0].item_uuid,
            customer_uuid: customerFound[0].customer_uuid,
          }).returning("order_uuid").then(function (orders) {
          if(orders){
            console.log(orders)
          }
         });
        });
      } else {
        //Insert a new customer in the database
        await Customer.query().insert({
          email: email,
          full_name: newFullName,
          address: newAddress,
          phone: newPhone,
          zip_code: newZip,
          city: newCity,
          invoice_full_name: newInvoiceFullName,
          invoice_phone: newInvoicePhone,
          invoice_address: newInvoiceAddress,
          invoice_zip_code: newInvoiceCity,
          invoice_city: newInvoiceZip,
          enable_newsletter: newsletter,
        });

        const customer = await Customer.query()
          .select()
          .where({ full_name: newFullName })
          .where({ email: email })
          .limit(1);

        newPosters.forEach(async (poster) => {
          const format = await Format.query()
            .select()
            .where({ format_no: poster.size })
            .limit(1);

          await Item.query().insert({
            item_name: poster.pname,
            item_no: poster.size,
            item_paths: poster.paths,
            format_uuid: format[0].format_uuid,
          });

          const newItem = await Item.query()
            .select()
            .where({ item_name: poster.pname })
            .limit(1);
            console.log("pase por aqui")
          await Order.query().insert({
            order_title: newItem[0].item_name,
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: format[0].price * poster.quantity,
            item_uuid: newItem[0].item_uuid,
            customer_uuid: customer[0].customer_uuid,
          }).returning("order_uuid").then(function (orders) {
            if(orders){
              console.log(orders)
            }
        });
        });
        
      }
      
      const link = "/payment";

      return res.send(link);
    }
  } catch (error) {
    console.log(error);
  }
});

//Route to send the files to the FTP server
route.post("/sendfiles", async (req, res) => {
  // console.log(req.body);
  const { customer, posters } = req.body;
  
  let orderSent = [];
  try {
    if(customer, posters){
   
    const output = "./public/output/";

    //Empty the output folder
    await fsExtra.emptyDir("./public/output");

    const ext = {
      pdf: ".pdf",
      xml: ".xml",
    };

    const orders = await Order.query()
      .select()
      .where({ pdf_sent: false })
      .withGraphJoined("customer")
      .where({ full_name: customer.fullname })
      .where({ email: customer.email })
      .withGraphJoined("item");

    orders.forEach((order) => {
      orderSent.push(order.order_no);

      const orderNo = order.order_no;
      const shopNo = "Blokkers";
      const deliveryShopName = order.customer.full_name;
      const deliveryAddress = order.customer.address;
      const deliveryZipCode = order.customer.zip;
      const deliveryCity = order.customer.city;
      const deliveryEmail = order.customer.email;
      const itemNo = order.item.item_no; //Defined by PinkOrange
      const itemName = order.order_title;
      const dimension = "Plakater " + itemNo;
      const pages = 1;
      const amount = order.amount;
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

      //Object containing all the
      //document sizes and dimesions
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

      let pdfSize = sizes[order.item.item_no];

      for (let i = 0; i < posters.length; i++) {
        let poster = posters[i];
        poster.pdfLocal = localPdf;
        poster.pdfSize = pdfSize;
        createPoster(poster);
      }

      //Create the XML object
      let xmlOrder = {
        PrintOrder: {
          "@encodingCheck": "ÅÆØåæø€©",
          "@version": "1.0",
          OrderNo: orderNo,
          OrderTitle: itemName + " Order #" + orderNo,
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

      //Write the XML to file
      fs.writeFile(localXml, xml, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("XML saved!");
        }
      });
    });
    sendXmlPadf();

    //Update the order after the files are sent to FTP server
    orderSent.forEach(async (sentOrder) => {
      await Order.query()
        .select()
        .update({
          xml_sent: true,
          pdf_sent: true,
        })
        .where({ order_no: sentOrder });
    });
 
  }
  } catch (error) {
    console.log(error);
  }
});


















module.exports = route;
