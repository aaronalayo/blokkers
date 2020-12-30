
const express = require("express");
let https = require('https');
let http = require('http');

const fs = require('fs');
let app = express();


const server = require("http").createServer(app);
let bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 





const helmet = require("helmet");
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));

app.set('trust proxy', true);
app.use(express.static('public'));


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


const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const footer = fs.readFileSync("./public/footer.html", "utf8");
const satisfiedPage = fs.readFileSync("./public/satisfied.html", 'utf8');
const basketPage = fs.readFileSync("./public/basket.html", 'utf8');
const checkOutPage = fs.readFileSync("./public/checkoutpage.html", 'utf8');


const restrictions= require('./middelware/restrict.js');

app.all(['*app.js*', '*_helpers/**', '*models/**', '*package.json*', '*bower.json*', '*README.md*', '*Public/**'], function (req, res, next){
  res.send({ auth: false });
});




app.get("/", (req, res) => {
  return res.send(navbar + homePage);
});

app.get("/satisfied", (req, res, next) => {

  return res.send(navbar + satisfiedPage );
});


app.get("/basket", (req, res) => {
  return res.send(navbar + basketPage);
});

app.get("/checkout", (req, res) => {
  return res.send(navbar + checkOutPage);
})

app.get("*", (req, res) => {

  res.status(404).send("<h1>Page doesnt exist<h1>");
});



const createRoute = require('./routes/create.js');


app.use(createRoute);









const port = process.env.PORT ? process.env.PORT : 2000;
server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }

  console.log("App listening on port: ", server.address().port)
});
