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


app.get("/", async (req, res) => {
  res.status(200).send("Hello");
});

app.get("*", function (req, res) {
  console.log(req);
  res.send("Page doesnt exist", 404);
});













const port = process.env.PORT ? process.env.PORT : 2000;
server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port)
});
