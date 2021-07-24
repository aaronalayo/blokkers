
//Setup FTP connection
const path = require('path');
const dotenvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({path: dotenvPath});
console.log(process.env.FTPUSER)
var config = {
  host: process.env.FTPHOST,
  port: process.env.FTPPORT,
  username: process.env.FTPUSER,
  password: process.env.FTPPASS,
  type: "ftp",
};

module.exports = config;



	

