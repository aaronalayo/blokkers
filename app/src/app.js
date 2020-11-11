const express = require("express");
const app = express();
const server = require("http").createServer(app);

const helmet = require("helmet");
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //to get response fromm

// parse application/json
app.use(express.json()); //to sumit form






app.get("/test", async (req, res) => {
    res.status(200).send("Hello");
  });
















const port = process.env.PORT ? process.env.PORT : 2000;
server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port)
});
