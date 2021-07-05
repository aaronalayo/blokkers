const transporter = require("../nodemailer.js");
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const parse = require('node-html-parser').parse;





module.exports = async function sendMail(order,items,date,paymentDetails,rate){
  // console.log(order,items,date);
  await readFile("./public/emailTemplate/email.html", 'utf8', (err,html)=>{
    if(err){
       throw err;
    }
  

  let billingName = order[0].customer.billing_full_name != null ? order[0].customer.billing_full_name : order[0].customer.shipping_full_name;
  let billingAddress = order[0].customer.billing_address != null ? order[0].customer.billing_address : order[0].customer.shipping_address;
  let billingZip = order[0].customer.billing_zip_code != null ? order[0].customer.billing_zip_code :  order[0].customer.shipping_zip_code;
  let billingCity = order[0].customer.billing_city != null ? order[0].customer.billing_city : order[0].customer.shipping_city;

 
// console.log(items)
let total  = paymentDetails.payment.orderDetails.amount;
// .substring(0, 3) + "." + paymentDetails.payment.orderDetails.amount.substring(3, paymentDetails.payment.orderDetails.amount.length);

total = parseFloat(total/100).toFixed(2);
console.log(total)
let taxes = 0;
let subTaxes = 0;
let price = 0;
let sub = 0;

    for(let i = 0; i < items.length; i++){
      price = items[i].price_per_item;
      subTotal = price * items[i].amount;
      subTaxes = (price * items[i].amount / 1.25 - subTotal )* -1;
      taxes += subTaxes;
      sub += subTotal;
      
    }
if(rate === "" || rate === undefined){
  html = html.replace(/{discount}/g, "-");
} else{
  // let totalFloat = parseFloat(paymentDetails.payment.orderDetails.amount);
  let discount = (subTotal- total);
  // discount = discount;
  // discount = discount.substring(0, 2) + "." + discount.substring(2, discount.length);
  discount = discount.toFixed(2);
  html = html.replace(/{discount}/g, discount + " DKK");
}



html = html.replace(/{date}/g, date);
html = html.replace(/{subtotal-amount}/g, sub.toFixed(2));
html = html.replace(/{taxes-amount}/g, taxes.toFixed(2));

html = html.replace(/{total-amount}/g, total);

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
  let orderContainer = root.querySelector(".order-container");
  let htmlString = "";
  // for (let i = 0; i < posters.length; i++) {
  for (let i = 0; i < items.length; i++) {
    let paths = JSON.stringify(items[i].item_paths).replace(/"/g, '').replace(/\\/g, '').replace(/[{}]/g, '');
    paths = paths.split(",");
    let name = items[i].item_name;
    let amount = items[i].amount;
    let price = items[i].price_per_item;
  htmlString = htmlString + `<div id=poster-display-${name}>
  <div class="order-table" id=${name} style="display:inline-flex;margin-bottom: 2%;">
  <table class="order-table" id="table-${name}" style="margin-left: auto;margin-right: auto;border: none;display: block;border-collapse: collapse;border-spacing: 0;">`;    
    let k = 0;

    for (let l = 0; l <= 3; l++) {
      htmlString = htmlString + `<tr id=tr-${l + 1}-${name} style="padding: 0;">`;
      for (let j = k; j <= k + 2; j++) {
        htmlString = htmlString + `<td id=${j + 1}-${name} style="background-image:url(https://blokkers.dk${paths[j]});background-repeat:no-repeat;background-size:1.75em 2em;width: 1.75em; height: 2em;padding: 0;">`;
     
        // htmlString = htmlString + `<div style="pointer-events: none;cursor: default;"><a href="#"><img class="g-img" src="https://blokkers.dk${paths[j]}" oncontextmenu="return false;" style="width: 2em;border-collapse: collapse;display: flex;pointer-events: none;cursor: default;"></a></div>`;
        // htmlString = htmlString + `background="https://blokkers.dk${paths[j]}" oncontextmenu="return false;" style="width: 2em;border-collapse: collapse;display: flex;pointer-events: none;cursor: default;">`;
        htmlString = htmlString + "</td>";
      }
      htmlString = htmlString + "</tr>";
      k = k + 3;
    }
    htmlString = htmlString + `</table></div>
  </td>
  <td>
    <table style="border-radius: 4px; border-collapse: separate;float:right;margin-top: 10%;" width="80%" cellspacing="0" cellpadding="0">
       <tbody>
        <tr>
          <td style="color: rgb(0, 0, 0);font-size: 20px;font-weight: bold;">
          <span style="font-size:20px;font-weight:bold;" >${items[i].item_format}</span>                                                   
          <span style="font-size:20px;font-weight:bold;" > poster </span>                                     
          <span class="poster" id=${name} style="font-size:20px;font-weight:bold;"> ${name} - </span>
          <span id="${name}-quantity" style="font-size:20px;font-weight:bold;">${amount}</span>                                    
          </td>        
          <td class="esd-block-text es-m-txt-l es-p35t es-p30r es-p30l"style="color: rgb(0, 0, 0);font-size: 20px;font-weight: bold;float: right;">
          <span id="${name}-price">${parseInt(price).toFixed(2)} DKK</span>                                    
          </td>                          
        </tr>
      </tbody>
    </table>
    <hr box-sizing: border-box;text-align: left;border: 0.6px solid #000000;margin-inline-start: 0%;width: 100%;>`
  }
  orderContainer.set_content(htmlString);

    const mailOptions = {
        from: 'Blokkers <hello@blokkers.dk>', 
        to: `"${order[0].customer.shipping_full_name}" <${order[0].customer.email}>`,
        // to:"najawachmann@gmail.com",
        subject: "Order confirmation #" + order[0].order_no,
        text: "Thanks for shopping with us",
        html:root.toString(),
    
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).send({
            message: "Could not send email, got the following error :",
            error,
          });
        } else {
          // res.status(200).send(info);
          console.log('mail sent');
        }
      });
   
    });   
    
}

