
const express = require("express");
var app = express();


const server = require("http").createServer(app);
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json()); 


const helmet = require("helmet");
app.use(helmet.xssFilter());


app.set('trust proxy', true);

app.use(express.static("public"));
const fs = require('fs');

const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const footer = fs.readFileSync("./public/footer.html", "utf8");

const satisfiedPage = fs.readFileSync("./public/satisfied.html", 'utf8');

const restrictions= require('./middelware/restrict.js')


app.get("/", (req, res) => {
  return res.send(navbar + homePage);
});

// app.get("/inspirations", (req, res) => {
//   return res.send(navbar+ inspirationsPage);
// });


// app.get("/create", (req, res) => {
//   return res.send(navbar + createposterPage );
// });


app.get("/satisfied",(req, res, next) => {

  return res.send(navbar + satisfiedPage );
});






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
