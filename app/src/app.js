
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const helmet = require("helmet");
app.use(helmet.xssFilter());

app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 

app.set('trust proxy', true);

app.use(express.static("public"));
const fs = require('fs');

const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const footer = fs.readFileSync("./public/footer.html", "utf8");
const inspirationsPage = fs.readFileSync("./public/inspirations.html", "utf8");
const createposterPage = fs.readFileSync("./public/createposter.html", "utf8");

app.get("/", (req, res) => {
  return res.send(navbar + homePage);
});

app.get("/inspirations", (req, res) => {
  return res.send(navbar+ inspirationsPage);
});

app.get("/create", (req, res) => {
  return res.send(navbar + createposterPage );
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
