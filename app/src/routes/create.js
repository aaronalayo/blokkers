const route = require("express").Router();
const request = require('request');

const fs = require("fs");
const builder = require("xmlbuilder", { encoding: "utf-8" });
const fsExtra = require("fs-extra");


const Customer = require("../model/Customer.js");
const Order = require("../model/Order.js");
const Format = require("../model/Format.js");
const Item = require("../model/Item.js");

const checkParameter = require("../middelware/checkParameters.js");
const setValueToNull = require("../middelware/setValueNull.js");
const sendXmlPdf = require("../middelware/sendXmlPdf.js");
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
      let items = [];
      let amount = 0;
      let host = 'https://f03c42d50d4f.ngrok.io';

      newPosters.forEach(async (poster) => {
        let subAmount = 0;
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

        subAmount = parseInt(poster.price) * parseInt(poster.quantity) * 100;
        amount += subAmount;
      });

      const consumer = {
        "reference": "1",
        "email": `${email}`,
        "shippingAddress": {
          "addressLine1": `${newAddress}`,
          "addressLine2": "",
          "postalCode": `${newZip}`,
          "city": `${newCity}`,
          "country": "DNK"
        },
        "phoneNumber": {
          "prefix": "+45",
          "number": `${newPhone.substring(3)}`
        },
      };
      console.log(consumer)
      let options = {

        host: host + "/createorder",
        uri: 'https://test.api.dibspayment.eu/v1/payments',//test
        // uri: 'https://api.dibspayment.eu/v1/payments',//live
        method: 'POST',
        body: `{
      "order": {
        "items": ${JSON.stringify(items)},
        "merchantNumber": 100020578,
        "amount": ${amount},
        "currency": "DKK",
        "reference": "${fullname} Order"
      }, 
      "checkout":{
        "charge":false,
        "publicDevice":true,
        "integrationType":"HostedPaymentPage",
   
        "url":"",
        "returnUrl":"${host}/payment",
        "termsUrl":"${host}/toc",
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
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log("body:", body);
        if (body) {
          res.status(response.statusCode).json(body);
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
    customer,
    paymentId
  } = req.body;
  // //Check if values are empty or null
  const newPosters = checkParameter(posters);
  const newFullName = checkParameter(customer.fullname);
  const newPhone = checkParameter(customer.phone);
  const newAddress = checkParameter(customer.address);
  const newCity = checkParameter(customer.city);
  const newZip = checkParameter(customer.zip);
  const newPaymentId = checkParameter(paymentId)
  //Check if values are empty set them to null
  const newInvoiceFullName = setValueToNull(customer.invoicefullname);
  const newInvoicePhone = setValueToNull(customer.invoicephone);
  const newInvoiceAddress = setValueToNull(customer.invoiceaddress);
  const newInvoiceCity = setValueToNull(customer.invoicecity);
  const newInvoiceZip = setValueToNull(customer.invoicezip);

  try {
    if (
      (newPosters,
        newFullName,
        newPhone,
        newAddress,
        newCity,
        newZip,
        customer.email,
        customer.newsletter,
        newPaymentId)
    ) {
      const customerFound = await Customer.query()
        .select()
        .where({
          full_name: newFullName,
          email: customer.email,
        })
        .limit(1);
      //Find if customer exists in the database
      if (customerFound.length > 0) {

        newPosters.forEach(async (poster) => {
          const format = await Format.query()
            .select()
            .where({ format_no: poster.size })
            .limit(1);
          console.log(format)
          //Insert a new item in the database
          await Item.query().insert({
            item_name: poster.pname,
            item_no: format[0].ext_no,
            item_format: format[0].format_no,
            item_paths: poster.paths,
            format_uuid: format[0].format_uuid,
          });

          const newItem = await Item.query()
            .select()
            .where({ item_name: poster.pname })
            .limit(1);
          console.log(newItem)
          //Insert a new order in the database
          //for an existing customer
          await Order.query().insert({
            order_title: newItem[0].item_name,
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: (format[0].price * poster.quantity).toFixed(Math.max((((format[0].price * poster.quantity) + '').split(".")[1] || "").length, 2)),
            item_uuid: newItem[0].item_uuid,
            customer_uuid: customerFound[0].customer_uuid,
            payment_id: paymentId
          }).returning("order_uuid").then(function (orders) {
            if (orders) {
              // console.log(orders)
            }
          });
        });
      } else {
        //Insert a new customer in the database
        await Customer.query().insert({
          email: customer.email,
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
          enable_newsletter: customer.newsletter,
        });

        const newCustomer = await Customer.query()
          .select()
          .where({ full_name: newFullName })
          .where({ email: customer.email })
          .limit(1);

        newPosters.forEach(async (poster) => {
          const format = await Format.query()
            .select()
            .where({ format_no: poster.size })
            .limit(1);

          await Item.query().insert({
            item_name: poster.pname,
            item_no: format[0].ext_no,
            item_format: format[0].format_no,
            item_paths: poster.paths,
            format_uuid: format[0].format_uuid,
          });

          const newItem = await Item.query()
            .select()
            .where({ item_name: poster.pname })
            .limit(1);
          await Order.query().insert({
            order_title: newItem[0].item_name,
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: (format[0].price * poster.quantity),
            item_uuid: newItem[0].item_uuid,
            customer_uuid: newCustomer[0].customer_uuid,
            payment_id: paymentId
          }).returning("order_uuid").then(function (orders) {
            if (orders) {
              // console.log(orders)
            }
          });
        });

      }

      return res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
});

//Route to send the files to the FTP server
route.post("/sendfiles", async (req, res) => {
  // console.log(req.body);
  const { customer, posters, paymentId } = req.body;

  let orderSent = [];
  try {
    const order = await Order.query()
    .select()
    .where({ payment_id: paymentId });
    console.log(order[0].order_confirmed);
 

    if (customer, posters) {
    
      const output = "./public/output/";

      //Empty the output folder
      await fsExtra.emptyDir("./public/output");

      const ext = {
        pdf: ".pdf",
        xml: ".xml",
      };

      const orders = await Order.query()
        .select()
        .where({ payment_id: paymentId })
        .withGraphJoined("customer")
        .where({ full_name: customer.fullname })
        .where({ email: customer.email })
        .withGraphJoined("item");

      orders.forEach((order) => {
        orderSent.push(order.order_no);
     

          const orderNo = order.order_no;
          const shopNo = "949452";
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
          const pdfFileName = orderNo + "_" + itemName + "_" + "Blokkers";
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

          let pdfSize = sizes[order.item.item_format];

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
   
        sendXmlPdf();
        //Update the order after the files are sent to FTP server
        orderSent.forEach(async (sentOrder) => {
          await Order.query()
            .select()
            .update({
              xml_sent: true,
              pdf_sent: true,
              order_confirmed: true,
            })
            .where({ order_no: sentOrder });
        });




      }

  } catch (error) {
    console.log(error);
  }
});


module.exports = route;
