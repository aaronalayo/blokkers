const path = require('path');
const dotenvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({path: dotenvPath});

var config = {
  host: process.env.FTPHOST,
  port: process.env.FTPPORT,
  username: process.env.FTPUSER,
  password: process.env.FTPPASS,
  type: "ftp",
};

module.exports = config;

 

	

