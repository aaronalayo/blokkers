
var EasyFtp = require("easy-ftp");
var ftp = new EasyFtp();
var config = {
  host: "94.231.99.28",
  port: 21,
  username: "EksternTest",
  password: "h242svgw",
  type: "ftp",
};

ftp.connect(config);
module.exports = ftp;

 

	

