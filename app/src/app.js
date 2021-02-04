
const express = require("express");
const helmet = require("helmet");
const app = express();
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const corsOptions = {
  origin: 'http://localhost:8080',
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
  credentials: true,
  enablePreflight: true,
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

const server = require("http").createServer(app);
let bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// app.use(helmet());


app.use(helmet.contentSecurityPolicy({
  directives:{
    defaultSrc:["'self'",'https:', "'unsafe-inline'" ],
    scriptSrc:["'self'",'https:','ajax.googleapis.com','https://test.checkout.dibspayment.eu/v1/payments','https://test.checkout.dibspayment.eu/','https://test.checkout.dibspayment.eu/v1/checkout.js','unpkg.com/axios/dist/axios.min.js',"'unsafe-inline'","'unsafe-eval'",'nonce-test.checkout.dibspayment.eu/v1/payments','sha256-base64 encoded hash' ],
    styleSrc:["'self'",'cdnjs.cloudflare.com',"'unsafe-inline'",'https://test.checkout.dibspayment.eu/v1/assets/css/checkout.css'],
    // styleSrcElem:["'self'",'cdnjs.cloudflare.com','test.checkout.dibspayment.eu/v1/payments','unpkg.com/axios/dist/axios.min.js',"'unsafe-inline'","'unsafe-eval'"],
    fontSrc:["'self'",'cdnjs.cloudflare.com',"'unsafe-inline'"],
    frameSrc:["'self'",'https://test.checkout.dibspayment.eu/v1/payments','https://test.checkout.dibspayment.eu/'],
    connectSrc: ["'self'", 'https://test.api.dibspayment.eu/v1/payments','https://test.checkout.dibspayment.eu/api/v1/theming/checkout']}}));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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
const footer = fs.readFileSync("./public/footer.html", "utf8");
const satisfiedPage = fs.readFileSync("./public/satisfied.html", 'utf8');
const basketPage = fs.readFileSync("./public/basket.html", 'utf8');
const createOrderPage = fs.readFileSync("./public/createorderpage.html", 'utf8');
const paymentPage = fs.readFileSync("./public/paymentpage.html", 'utf8');
const aboutPage = fs.readFileSync("./public/aboutpage.html", 'utf8');
const contactPage = fs.readFileSync("./public/contactpage.html", 'utf8');


const Format = require("./model/Format.js");

app.all(['*app.js*', '*_helpers/**', '*models/**', '*package.json*', '*bower.json*', '*README.md*', '*Public/**'], function (req, res, next){
  res.send({ auth: false });
});
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

//Routes

const home = "/";
const satisfied = "/satisfied";
const basket = "/basket";
const createOrder = "/createorder";
const formats = "/formats";
const payment = "/payment";
const about = "/about";
const contact = "/contact";

// var corsOptions = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// var whitelist = ['https://test.api.dibspayment.eu/v1/payments'];

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;

//   console.log(req.header('Origin'));
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
    
//     corsOptions = { origin: true} // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
 //Set CORS header and intercept "OPTIONS" preflight call from AngularJS
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === "OPTIONS") 
      res.send(200);
  else 
      next();
}
app.use(allowCrossDomain);

app.get(home, (req, res) => {
  return res.send(navbar + homePage);
});

app.get(satisfied, (req, res) => {

  return res.send(navbar + satisfiedPage );
});

app.get(basket, (req, res) => {
  return res.send(navbar + basketPage);
});

app.get(createOrder, (req, res) => {

  res.send(navbar + createOrderPage);

});

app.get(formats, async (req, res)=> {   
  const formats = await Format.query().select();
  res.json({ 'formats' : formats});
});
const createPaymentOrder = require('./middelware/payment.js');
app.get(payment, async (req, res) => {

  await createPaymentOrder().then(response => {
    console.log("esta es la:", response);
  })


  return res
    // .setHeader("Access-Control-Allow-Origin", "*")
    // .setHeader("Access-Control-Allow-Credentials", "true")
    // .setHeader("Access-Control-Max-Age", "1800")
    // .setHeader("Access-Control-Allow-Headers", "content-type")
    // .setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" )
    .status(200).send(navbar + paymentPage);
});


app.get(about, (req, res) => {
  return res.send(navbar + aboutPage);
});

app.get(contact, (req, res) => {
  return res.send(navbar + contactPage);
});

app.get("*", (req, res) => {

  res.status(404).send("<h1>Page doesnt exist<h1>");
});

const createRoute = require('./routes/create.js');
const paymentRoute = require('./middelware/payment.js');

app.use(createRoute);
app.use(paymentRoute);


//Server port
const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = '0.0.0.0';

server.listen(port, port2, (error) => {
  if (error) {
    console.log("error running the server");
  }

  console.log("App listening on port: ", server.address().port)
});
