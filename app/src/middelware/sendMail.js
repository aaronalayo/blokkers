const transporter = require("../nodemailer.js");
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const parse = require('node-html-parser').parse;
const Node = require('node-html-parser').Node;
const { transcode } = require("buffer");



module.exports = async function sendMail(order, items, date){
  await readFile("./public/emailTemplate/email.html", 'utf8', (err,html)=>{
    if(err){
       throw err;
    }


  let billingName = order[0].customer.billing_full_name != null ? order[0].customer.billing_full_name : order[0].customer.shipping_full_name;
  let billingAddress = order[0].customer.billing_address != null ? order[0].customer.billing_address : order[0].customer.shipping_address;
  let billingZip = order[0].customer.billing_zip_code != null ? order[0].customer.billing_zip_code :  order[0].customer.shipping_zip_code;
  let billingCity = order[0].customer.billing_city != null ? order[0].customer.billing_city : order[0].customer.shipping_city;




  html = html.replace(/{date}/g, date);

  html = html.replace(/{subtotal-amount}/g, items[0].price_per_item);
  html = html.replace(/{total-amount}/g, items[0].total_price);
  html = html.replace(/{orderNumber}/g, order[0].order_no);
  html = html.replace(/{shippingname}/g, order[0].customer.shipping_full_name);
  html = html.replace(/{shippingaddress}/g, order[0].customer.shipping_address);
  html = html.replace(/{shippingcity}/g, order[0].customer.shipping_city);
  html = html.replace(/{shippingzip}/g, order[0].customer.shipping_zip_code);
  html = html.replace(/{shippingcountry}/g, "Denmark");
  html = html.replace(/{shippingemail}/g, order[0].customer.email);

  html = html.replace(/{billingname}/g, billingName);
  html = html.replace(/{billingaddress}/g, billingAddress);
  html = html.replace(/{billingcity}/g, billingCity);
  html = html.replace(/{billingzip}/g, billingZip);
  html = html.replace(/{billingcountry}/g, "Denmark");
  html = html.replace(/{billingemail}/g, order[0].customer.email);

  let root = parse(html);
// console.log(root.toString())
  let orderContainer = root.querySelector('.order-container');
  for (let i = 0; i < items.length; i++) {
    let paths = JSON.stringify(items[i].item_paths).replace(/"/g, '').replace(/\\/g, '').replace(/[{}]/g, '');
    paths = paths.split(",");
    let name = items[i].item_name;
    orderContainer.set_content(`<div id="poster-display-${name}">
  <div class="order-table" id=${name}>
  <table class="order-table" id="table-${name}" style="margin-left: auto;margin-right: auto;display: block;display: inline-table;"></table>
  </div>
  </div>`);
  let table = root.querySelector(`#table-${name}`);   
  
  let k = 0;
  for (let l = 0; l <= 3; l++) {
    let trNode = new Node(`<tr id=tr-${l + 1}-${name}></tr>`);
    console.log(trNode['parentNode'])
    table.set_content(trNode['parentNode']);
    
    // let tr = root.querySelector(trNode.parentNode);
   
    // for (let j = k; j <= k + 2; j++) {
    //   let tdChild = new Node(`<td id=${j + 1}-${name} style="padding: 0;"></td>`);
    //  tr.appendChild(tdChild);
    //  let td = root.querySelector(`#${j + 1}-${name}`);

    //  td.set_content(`<img src="https://blokkers.dk${paths[j]}" style="width: 2em;border-collapse: collapse;display: flex;pointer-events: none;">`);
     
    // }
    k = k + 3;
  }

  console.log(root.toString())

}


    // const mailOptions = {
    //     from: 'Blokkers <hello@blokkers.dk>', 
    //     to: order[0].customer.email,
    //     subject: "Order confirmation #"+order[0].order_no,
    //     text: "Thanks for shopping with us",
    //     html:root.toString(),
    
    //   };
      
    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       res.status(400).send({
    //         message: "Could not send email, got the following error :",
    //         error,
    //       });
    //     } else {
    //       // res.status(200).send(info);
    //       console.log('mail sent');
    //     }
    //   });
   
    });   
    
}

