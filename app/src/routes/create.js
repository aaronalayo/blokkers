const route = require("express").Router();
const request = require("request");


const fs = require("fs");
const builder = require("xmlbuilder", { encoding: "utf-8" });
const fsExtra = require("fs-extra");

const Customer = require("../model/Customer.js");
const Order = require("../model/Order.js");
const Format = require("../model/Format.js");
const Item = require("../model/Item.js");
const Discount = require("../model/Discount.js");

const checkParameter = require("../middelware/checkParameters.js");
const setValueToNull = require("../middelware/setValueNull.js");
const sendXmlPdf = require("../middelware/sendXmlPdf.js");
const createPoster = require("../middelware/createPoster.js");
const sendMail = require('../middelware/sendMail.js');
const setValueNull = require("../middelware/setValueNull.js");


route.post("/createpaymentorder", async (req, res) => {
  const {
    discountCode,
    posters,
    shippingfullname,
    shippingphone,
    email,
    shippingaddress,
    shippingcity,
    shippingzip,
    billingfullname,
    billingphone,
    billingaddress,
    billingcity,
    billingzip,
    newsletter,
  } = req.body;

  //Check if values are empty or null
  const newPosters = checkParameter(posters);
  const shippingFullName = checkParameter(shippingfullname);
  const shippingPhone = checkParameter(shippingphone);
  const shippingshippingAddress = checkParameter(shippingaddress);
  const shippingCity = checkParameter(shippingcity);
  const shippingZipCode = checkParameter(shippingzip);
  //Check if values are empty, set them to null
  const billingFullname = setValueToNull(billingfullname);
  const billingPhone = setValueToNull(billingphone);
  const billingshippingAddress = setValueToNull(billingaddress);
  const billingCity = setValueToNull(billingcity);
  const billingZipCode = setValueToNull(billingzip);

  try {
    if (
      (discountCode,
      newPosters,
      shippingFullName,
      shippingPhone,
      shippingshippingAddress,
      shippingCity,
      shippingZipCode,
      email,
      newsletter)
    ) {
      const formats = await Format.query().select();

      let items = [];
      let amount = 0;
      // console.log(formats[i].price)
      let rate;
      let totalRate;
      let netRate;
      let discount;

      if (discountCode === "") {
        discount = null;
      }
      if (discountCode) {
        discount = await Discount.query()
          .select("amount")
          .where({ discount_code: discountCode })
          .skipUndefined();
      }
      for (let i = 0; i < formats.length; i++) {
        newPosters.forEach((poster) => {
          if (parseFloat(poster.price) === parseFloat(formats[i].price)) {
            let subAmount = 0;
            let item = {
              reference: `${poster.pname}`,
              name: `${poster.pname}`,
              quantity: `${poster.quantity}`,
              unit: "poster",
              // unitPrice: formats[i].price * 100 - 2500,
              unitPrice: formats[i].price * 100,
              taxRate: 2500,
              taxAmount: (((formats[i].price * poster.quantity * 100)/1.25) - (formats[i].price * poster.quantity * 100))* -1,
              grossTotalAmount: formats[i].price * poster.quantity * 100,
              netTotalAmount: (formats[i].price * 100 * poster.quantity - ((((formats[i].price * poster.quantity * 100)/1.25) - (formats[i].price * poster.quantity * 100))* -1)) ,
            };

            if (discount) {
              rate =
                ((formats[i].price) * discount[0].amount) ;
              totalRate =
                (rate *
                  poster.quantity
                  ) ;
              netRate =
                (rate * poster.quantity);
            } else {
              rate = 0;
              totalRate = 0;
              netRate = 0;
            }
            let discountItem = {
              reference: "discount",
              name: "discount",
              quantity: poster.quantity,
              unit: "units",
              unitPrice: -rate,
              taxRate: 0,
              taxAmount: 0,
              grossTotalAmount: -totalRate,
              netTotalAmount: -netRate,
            };
            // console.log(discountItem);
            items.push(item, discountItem);

            subAmount =
              parseInt(formats[i].price) * parseInt(poster.quantity) * 100 -
              totalRate;
            amount += subAmount;
          }
        });
      }
      const consumer = {
        reference: "1",
        email: `${email}`,
        shippingshippingAddress: {
          shippingaddressLine1: `${shippingshippingAddress}`,
          shippingaddressLine2: "",
          postalCode: `${shippingZipCode}`,
          shippingcity: `${shippingCity}`,
          country: "DNK",
        },
        phoneNumber: {
          prefix: "+45",
          number: `${shippingPhone.substring(3)}`,
        },
      };
      // console.log(consumer)
      let host = "http://www.blokkers.dk";
      let options = {
        host: host + "/createorder",
        uri: "https://test.api.dibspayment.eu/v1/payments", //test
        // uri: 'https://api.dibspayment.eu/v1/payments',//live
        method: "POST",
        body: `{
      "order": {
        "items": ${JSON.stringify(items)},
        "merchantNumber": 100020578,
        "amount": ${amount},
        "currency": "DKK",
        "reference": "${shippingfullname} Order"
      }, 
      "checkout":{
        "charge":false,
        "publicDevice":true,
        "integrationType":"HostedPaymentPage",
   
        "url":"",
        "returnUrl":"${host}/payment",
        "termsUrl":"${host}/termsandcontions",
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
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "ef160d0b15ef4bf3b243c8f6a6183b85",
          // 'Authorization': 'b7989e81d50b47228ac61d7763986548',
        },
      };
      console.log(options);
      request(options, function (error, response, body) {
        console.log("error:", error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
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
  const { posters, customer, paymentId } = req.body;
  // console.log("Creating order", customer)
  // //Check if values are empty or null
  const newPosters = checkParameter(posters);
  const shippingFullName = checkParameter(customer.shippingfullname);
  const shippingPhone = checkParameter(customer.shippingphone);
  const shippingAddress = checkParameter(customer.shippingaddress);
  const shippingCity = checkParameter(customer.shippingcity);
  const shippingZipCode = checkParameter(customer.shippingzip);
  const newPaymentId = checkParameter(paymentId);
  //Check if values are empty set them to null
  const billingFullname = setValueToNull(customer.billingfullname);
  const billingPhone = setValueToNull(customer.billingphone);
  const billingAddress = setValueToNull(customer.billingaddress);
  const billingCity = setValueToNull(customer.billingcity);
  const billingZipCode = setValueToNull(customer.billingzip);

  try {
    if (
      (newPosters,
      shippingFullName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingZipCode,
      customer.email,
      customer.newsletter,
      newPaymentId)
    ) {
      const customerFound = await Customer.query()
        .select()
        .where({
          shipping_full_name: shippingFullName,
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
          // console.log(format)
          //Insert a new item in the database
          await Item.query().insert({
            item_name: poster.pname,
            item_no: format[0].ext_no,
            item_format: format[0].format_no,
            item_paths: poster.paths,
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: (format[0].price * poster.quantity).toFixed(
              Math.max(
                ((format[0].price * poster.quantity + "").split(".")[1] || "")
                  .length,
                2
              )
            ),
            customer_uuid: customerFound[0].customer_uuid,
            format_uuid: format[0].format_uuid,
            payment_id: paymentId,
          });
        });
        const newItem = await Item.query()
          .select()
          .where({ customer_uuid: customerFound[0].customer_uuid })
          .limit(1);
        // console.log(newItem);
        //Insert a new order in the database
        //for an existing customer
        await Order.query()
          .insert({
            customer_uuid: customerFound[0].customer_uuid,
            payment_id: paymentId,
          })
          .returning("order_uuid")
          .then(function (orders) {
            if (orders) {
              // console.log(orders)
            }
          });
      } else {
        //Insert a new customer in the database
        await Customer.query().insert({
          email: customer.email,
          shipping_full_name: shippingFullName,
          shipping_address: shippingAddress,
          shipping_phone: shippingPhone,
          shipping_zip_code: shippingZipCode,
          shipping_city: shippingCity,
          billing_full_name: billingFullname,
          billing_phone: billingPhone,
          billing_address: billingAddress,
          billing_zip_code: billingCity,
          billing_city: billingZipCode,
          enable_newsletter: customer.newsletter,
        });

        const newCustomer = await Customer.query()
          .select()
          .where({ shipping_full_name: shippingFullName })
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
            amount: poster.quantity,
            price_per_item: format[0].price,
            total_price: (format[0].price * poster.quantity).toFixed(
              Math.max(
                ((format[0].price * poster.quantity + "").split(".")[1] || "")
                  .length,
                2
              )
            ),
            customer_uuid: newCustomer[0].customer_uuid,
            format_uuid: format[0].format_uuid,
            payment_id: paymentId,
          });
        });
        const newItem = await Item.query()
          .select()
          .where({ customer_uuid: newCustomer[0].customer_uuid })
          .limit(1);
        await Order.query()
          .insert({
            customer_uuid: newCustomer[0].customer_uuid,
            payment_id: paymentId,
          })
          .returning("order_uuid")
          .then(function (order) {
            if (order) {
              // console.log(order)
            }
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
    //Empty the output folder
    fsExtra.emptyDir("./public/output");
  const { customer, posters, paymentId } = req.body;
  // console.log(req.body)
  let orderSent = [];
  try {
    const order = await Order.query()
      .select()
      .where({ payment_id: paymentId })
      .withGraphJoined("customer");
      // console.log(order)
    const items = await Item.query()
      .select()
      .where({ payment_id: paymentId });
    // console.log("This are ites in sendfiles"+ items[0]);
    if (customer, posters) {
      const output = "./public/output/";

    

      const ext = {
        pdf: ".pdf",
        xml: ".xml",
      };
      
      items.forEach((item) => {
        orderSent.push(order[0].order_no);

        const orderNo = order[0].order_no;
        const shopNo = "949452";
        const deliveryShopName = order[0].customer.shipping_full_name;
        const deliveryAddress = order[0].customer.shipping_address;
        const deliveryZipCode = order[0].customer.shipping_zip_code;
        const deliveryCity = order[0].customer.shipping_city;
        const deliveryEmail = order[0].customer.email;
        const itemNo = item.item_no; //Defined by PinkOrange
        const itemName = item.item_name;
        const dimension = "Plakater " + itemNo;
        const pages = 1;
        const amount = item.amount;
        const pdfFileName = orderNo + "_" + itemName + "_" + "Blokkers";
        const pricePerItem = item.price_per_item;
        const TotalPrice = item.total_price;
        const ftp_addr = "ftp://EksternTest:h242svgw@94.231.99.28";
        // const ftp_addr = "ftp://Import:h240svgw@94.231.99.28";

        let localPdf = output + pdfFileName + ext["pdf"];
        // console.log(localPdf);
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

        let pdfSize = sizes[item.item_format];

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
      res.clearCookie('cart', { path: '/' });  
    }
  } catch (error) {
    console.log(error);
  }
});

route.post("/sendmail", async (req, res) => {
  const {paymentDetails, date, discount} = req.body;
  let rate;
  try {
    
    const discounts = await Discount.query().select();
   if(discount){
     discounts.forEach(discountsData =>{
       if(discount === discountsData.discount_code){
          rate =  discountsData.discount_rate;
          rate = rate.replace("%", "");
          rate = parseInt(rate);
       }else{
         rate = "";
       }
     })
   }
   
    const order = await Order.query()
      .select()
      .where({ payment_id: paymentDetails.payment.paymentId })
      .withGraphJoined("customer");
      // console.log(order);
    const items = await Item.query()
      .select()
      .where({payment_id: paymentDetails.payment.paymentId});
    // console.log(items);
  sendMail(order, items, date,paymentDetails, rate)
  } catch (error) {
    console.log(error);
  }
});



module.exports = route;
