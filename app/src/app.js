
const express = require("express");
const helmet = require("helmet");
const app = express();
const session = require('express-session');
const request = require('request');

const cors = require('cors');
const fs = require('fs');
const corsOptions = {
  
  origin: 'https://e6bf27c82c5b.ngrok.io',
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers",'Access-Control-Allow-Origin'],
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
// '\'sha256-1XgMsIi6szxMi7JX5ZCg4KWReddGOu15C+cKuzlVaf4=\''

// app.use(helmet.contentSecurityPolicy({
//   directives:{
//     defaultSrc:["'self'",'https:', "'unsafe-inline'" ],
//     scriptSrc:["'self'","'unsafe-inline'",'http://*','ajax.googleapis.com','https://test.checkout.dibspayment.eu/v1/',"'unsafe-inline'","'unsafe-eval'"],
//     styleSrc:["'self'",'cdnjs.cloudflare.com',"'unsafe-inline'",'https://test.checkout.dibspayment.eu/v1/assets/css/checkout.css','https://*'],
//     // styleSrcElem:["'self'",'cdnjs.cloudflare.com','test.checkout.dibspayment.eu/v1/payments','unpkg.com/axios/dist/axios.min.js',"'unsafe-inline'","'unsafe-eval'"],
//     fontSrc:["'self'",'cdnjs.cloudflare.com',"'unsafe-inline'"],
//     frameSrc:["'self'"],
//     // ,'https://test.checkout.dibspayment.eu/v1/payments','https://test.checkout.dibspayment.eu/'
//     connectSrc: ["'self'"]}}));
//     // , 'https://test.api.dibspayment.eu/v1/payments','https://test.checkout.dibspayment.eu/api/v1/theming/checkout'
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
const footer = fs.readFileSync("./public/footer.html", "utf8");
const satisfiedPage = fs.readFileSync("./public/satisfied.html", 'utf8');
const basketPage = fs.readFileSync("./public/basket.html", 'utf8');
const createOrderPage = fs.readFileSync("./public/createorderpage.html", 'utf8');
const paymentPage = fs.readFileSync("./public/paymentpage.html", 'utf8');
const aboutPage = fs.readFileSync("./public/aboutpage.html", 'utf8');
const contactPage = fs.readFileSync("./public/contactpage.html", 'utf8');


const Format = require("./model/Format.js");



//Routes

const home = "/";
const satisfied = "/satisfied";
const basket = "/basket";
const createOrder = "/createorder";
const formats = "/formats";
const payment = "/payment";
const about = "/about";
const contact = "/contact";



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

exports.paymentPage = function(req, res) {
  return res.send(navbar + paymentPage);
}
let data;
app.get(payment, async (req, res) => {
  const paymentId = req.query.paymentid;
  if(paymentId){

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
    

return res.status(200).send(navbar + paymentPage);
      
}else {
  res.redirect('/')
}
});
app.get('/data', async (req, res) => {
  res.json({'data':data})
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
const paymentRoute = require('./routes/payment.js');


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
