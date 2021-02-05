module.exports = options = {
  host: 'http://localhost:8080/createorder',
  uri: 'https://test.api.dibspayment.eu/v1/payments',//test
  // uri: 'https://api.dibspayment.eu/v1/payments',//live
  method: 'POST',
  body : `{
    "order": {
      "items": [{
        "reference": "13",
        "name": "testproduct 1",
        "quantity": 1,
        "unit": "pcs",
        "unitPrice": 40000,
        "taxRate": 2500,
        "taxAmount": 10000,
        "grossTotalAmount": 40000,
        "netTotalAmount": 30000
      }],
      "merchantNumber": 100020578,
      "amount": 40000,
      "currency": "DKK",
      "reference": "Demo Order"
    }, 
    "checkout":{
      "charge":false,
      "publicDevice":true,
      "integrationType":"EmbeddedCheckout",
 
      "url":"http://localhost:8080/createorder",
      "returnUrl":"http://localhost:8080/payment",
      "termsUrl":"http://localhost:8080/toc",
      "appearance": {
        "displayOptions": {
          "showMerchantName": true,
          "showOrderSummary": true
        },
        "textOptions": {
          "completePaymentButtonText" : "order"
        }
      },
      "merchantHandlesConsumerData":true,
      "consumer":{  
        "reference":"1",
           "email":"aaron.aa@me.com",
           "shippingAddress":{  
              "addressLine1":"Taastrup Have 1",
              "addressLine2":"",
              "postalCode":"2630",
              "city":"Taastrup",
              "country":"DNK"
           },
           "phoneNumber":{  
              "prefix":"+45",
              "number":"91435718"
           },
     
         "company":{  
          "name":"PinkOrange",
          "contact":{  
             "firstName":"Julia",
              "lastName":"Sand"
           }
         }
       }
  }
}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'ef160d0b15ef4bf3b243c8f6a6183b85'
    // 'Authorization': 'b7989e81d50b47228ac61d7763986548'
  },
};


  



  

