// const route = require("express").Router();
const axios = require('axios');



const data ={

    "order": {
      "items": [{
        "reference": "13",
        "name": "testproduct 1",
        "quantity": 2,
        "unit": "pcs",
        "unitPrice": 48648,
        "taxRate": 2500,
        "taxAmount": 24324,
        "grossTotalAmount": 121620,
        "netTotalAmount": 97296
      }],
      "merchantNumber": 100020578,
      "amount": 401220,
      "currency": "SEK",
      "reference": "Demo Order"
    }, 
    "checkout": {
      "url": "https://localhost:8080/checkout",
      "termsUrl": "https://localhost:8080/toc",
      "shipping": {
        "countries": [
          {
            "countryCode": "SWE"
          }
        ],
        "merchantHandlesShippingCost": false
      },
      "consumerType": {
        "supportedTypes": ["B2C", "B2B"],
        "default": "B2C"
      }
    }
  }
  //This a call to dibs API to get paymnetID
module.exports = async function createPaymentOrder() {
  await axios.post('https://test.api.dibspayment.eu/v1/payments', {
    

      "order": {
        "items": [{
          "reference": "13",
          "name": "testproduct 1",
          "quantity": 2,
          "unit": "pcs",
          "unitPrice": 48648,
          "taxRate": 2500,
          "taxAmount": 24324,
          "grossTotalAmount": 121620,
          "netTotalAmount": 97296
        }],
        "merchantNumber": 100020578,
        "amount": 401220,
        "currency": "SEK",
        "reference": "Demo Order"
      }, 
      "checkout": {
        "url": "https://blokkers-42pcgbkrja-ew.a.run.app/checkout",
        "termsUrl": "https://blokkers-42pcgbkrja-ew.a.run.app/toc",
        "shipping": {
          "countries": [
            {
              "countryCode": "SWE"
            }
          ],
          "merchantHandlesShippingCost": false
        },
        "consumerType": {
          "supportedTypes": ["B2C", "B2B"],
          "default": "B2C"
        }
      },
    
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'ef160d0b15ef4bf3b243c8f6a6183b85'
    }


  })
    .then(res => {
      if (res.status == 200) {

        console.log("success", res)
        return new Promise((done) => {
          done(res);
        });
        //handle success here
      }
      console.log(res.status);
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
    })
    .catch(error => {
      console.log("Error retrieving paymentId", error)
    })
}
  
  // module.exports = route;
  
  

