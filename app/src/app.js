if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const helmet = require("helmet");
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //to get response fromm

// parse application/json
app.use(express.json()); //to sumit form

app.set('trust proxy', true);

app.use(express.static(__dirname + "/public"));
const fs = require('fs');

const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const homePage = fs.readFileSync("./public/homepage.html", "utf8");


app.get("/", async (req, res) => {
  return res.send(navbar + homePage);
});

app.get("*", function (req, res) {
  console.log(req);
  res.status(404).send("<h1>Page doesnt exist<h1>", 404);
});














const port = process.env.PORT ? process.env.PORT : 2000;
server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port)
});
