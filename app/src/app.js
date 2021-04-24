'use strict';
const express = require("express");
const session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
// let mongoose = require('mongoose');
// mongoose.connect(
//   'mongodb://localhost/db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 10000
//   }

// );




const server = require("http").createServer(app);

const helmet = require("helmet");

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

const fs = require('fs');

app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));

app.use(express.static('public'));
const request = require('request');

app.set('trust proxy', 1);

// Setup Objection + Knex
const { Model } = require("objection");

const Knex = require("knex");

const knexFile = require("../knexfile.js");

const knex = Knex(knexFile.development);
knex.on( 'query', function( queryData ) {
  // console.log( queryData );
});
// knex.on('query', console.log);

Model.knex(knex);

//Read html files
const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const inspirationPage = fs.readFileSync("./public/inspirationpage.html", "utf8");
const footerPage = fs.readFileSync("./public/footer.html", "utf8");
const satisfiedPage = fs.readFileSync("./public/satisfied.html", 'utf8');
const basketPage = fs.readFileSync("./public/basket.html", 'utf8');
const checkoutPage = fs.readFileSync("./public/checkoutpage.html", 'utf8');
const paymentPage = fs.readFileSync("./public/paymentpage.html", 'utf8');
const aboutPage = fs.readFileSync("./public/aboutpage.html", 'utf8');
const contactPage = fs.readFileSync("./public/contactpage.html", 'utf8');
const createPosterPage = fs.readFileSync("./public/createposterpage.html", 'utf8');
const howItWorksPage = fs.readFileSync("./public/howitworkspage.html", "utf8");
const termsAndConditions = fs.readFileSync("./public/termsandconditions.html", "utf8");
const Format = require("./model/Format.js");
const Order = require("./model/Order.js");
const Item = require("./model/Item.js");
const Discount = require("./model/Discount.js");

//Routes
const home = "/";
const inspiration = "/inspiration"
const satisfied = "/satisfied";
const basket = "/basket";
const checkout = "/checkout";
const formats = "/formats";
const payment = "/payment";
const about = "/about";
const contact = "/contact";
const createPoster = "/createposter";
const discounts = "/discounts";
const howitworks = "/howitworks";
const termsandconditions = "/termsandcontions";



app.get(home, (req, res) => {
  return res.send(navbar + homePage + footerPage);
});


app.get(satisfied, (req, res) => {
  return res.send(navbar + satisfiedPage + footerPage );
});
app.get(inspiration, (req, res) => {
  return res.send(navbar + inspirationPage + footerPage );
});
app.get(basket, (req, res) => {
  return res.send(navbar + basketPage + footerPage);
});

app.get(checkout, (req, res) => {
  res.send(navbar + checkoutPage + footerPage);
});
app.get(howitworks, (req, res) => {
  res.send(navbar + howItWorksPage + footerPage);
});
app.get(termsandconditions, (req, res) => {
  res.send(navbar + termsAndConditions + footerPage);
});
app.get(formats, async (req, res)=> {   
  const formats = await Format.query().select();
  res.json({ 'formats' : formats});
});
app.get(discounts, async (req, res)=> {   
  const discounts = await Discount.query().select();
  res.json({ 'discounts' : discounts});
});

let data;
let paymentId;
app.get(payment, async (req, res) => {
  paymentId = req.query.paymentid;
  if(paymentId){
console.log(paymentId)
  let options = {

    uri: 'https://test.api.dibspayment.eu/v1/payments/'+paymentId,
    method: 'GET',
    headers: {
      'Authorization': 'ef160d0b15ef4bf3b243c8f6a6183b85'
      // 'Authorization': 'b7989e81d50b47228ac61d7763986548'
    },
}
request(options, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log("body:", body);
  data = body
});
return res.status(200).send(navbar + paymentPage + footerPage);
      
}else {
  res.redirect('/')
}
});

app.get('/data', async (req, res) => {
  const order = await Order.query().select().where({'payment_id':paymentId}).withGraphJoined('customer');
  const items = await Item.query().select().where({'payment_id':paymentId,'customer_uuid':order[0].customer_uuid});
  console.log(items)
  res.json({'order':order, 'items':items,'data':data});
});


app.get(about, (req, res) => {
  return res.send(navbar + aboutPage + footerPage);
});

app.get(contact, (req, res) => {
  return res.send(navbar + contactPage);
});
app.get(createPoster,(req, res)=> {
  return res.send(navbar + createPosterPage +footerPage);
});

app.get("*", (req, res) => {

  res.status(404).send("<h1>Page doesnt exist<h1>");
});



const createRoute = require('./routes/create.js');
const { Session } = require("inspector");




// const paymentRoute = require('./routes/payment.js');


app.use(createRoute);
// app.use(paymentRoute);


//Server port
const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = '0.0.0.0';

server.listen(port, port2, (error) => {
  if (error) {
    console.log("error running the server");
  }

  console.log("App listening on port: ", server.address().port)
});
