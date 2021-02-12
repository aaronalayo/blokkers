const fs = require('fs');

const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const paymentPage = fs.readFileSync("./public/paymentpage.html", 'utf8');



exports.paymentPage = async (req, res) => {
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
    console.log("body:", body);
  
  });
      
  return res.send(navbar + paymentPage);

        
  }else {
    res.redirect('/');
  }
    
}