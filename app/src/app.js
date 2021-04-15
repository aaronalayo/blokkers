
const express = require("express");
const helmet = require("helmet");
const app = express();
const server = require("http").createServer(app);
let bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const request = require('request');

const cors = require('cors');
const fs = require('fs');
const corsOptions = {
  
  origin: 'https://f03c42d50d4f.ngrok.io',
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers",'Access-Control-Allow-Origin'],
  credentials: true,
  enablePreflight: true,
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

app.use(cookieParser());
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  cookie:{
  maxAge:10000
  }}));
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('www.blokkers.dk',randomNumber, { maxAge: 900000, httpOnly: true });
    // console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 


app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));



app.set('trust proxy', true);
app.use(express.static('public'));

let router = express.Router();
app.use('/', router);

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




// const paymentRoute = require('./routes/payment.js');


app.use(createRoute);
// app.use(paymentRoute);


//Server port
const port = process.env.PORT ? process.env.PORT : 3000;
const port2 = '0.0.0.0';

server.listen(port, port2, (error) => {
  if (error) {
    console.log("error running the server");
  }

  console.log("App listening on port: ", server.address().port)
});
