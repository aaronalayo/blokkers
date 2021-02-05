module.exports = options = {
  host: 'http://localhost:8080',
  uri: 'https://test.api.dibspayment.eu/v1/payments',
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
        "taxAmount": 100,
        "grossTotalAmount": 400,
        "netTotalAmount": 300
      }],
      "merchantNumber": 100020578,
      "amount": 400,
      "currency": "DKK",
      "reference": "Demo Order"
    }, 
    "checkout":{
      "charge":true,
      "publicDevice":true,
      "integrationType":"EmbeddedCheckout",
 
      "url":"http://localhost:8080",
      "returnUrl":"http://localhost:8080/chechout",
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
    'Authorization': 'test-secret-key-ef160d0b15ef4bf3b243c8f6a6183b85'
  },
};


  



  

