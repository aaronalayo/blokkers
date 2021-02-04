
  $( document ).ready(function() {

    // loadDoc();
    let checkoutOptions = {
      checkoutKey: 'test-checkout-key-baa32b6941d04dedb5693f1e90456137', // [Required] Test or Live checkout key with dashes
      paymentId: 'ef160d0b15ef4bf3b243c8f6a6183b85', // [Required] Payment ID (GUID format) without dashes.
      containerId: "dibs-complete-checkout", // [Optional] Default: dibs-checkout-content
      language: "en-GB", // [Optional] Default value: en-GB
    }
    let checkout = new Dibs.Checkout(checkoutOptions);
  //   checkout.on('payment-completed', function (response) {
  //     console.log(response)
  //     window.location = '/payment';
  //   })
  // });


  //   let checkoutOptions = {
  //     checkoutKey: "ef160d0b15ef4bf3b243c8f6a6183b85", // [Required] Test or Live checkout key with dashes
  //     paymentId : this.response.data.paymentId, // [Required] Payment ID (GUID format) without dashes.
  //     containerId : "dibs-complete-checkout", // [Optional] Default: dibs-checkout-content
  //     language: "en-GB", // [Optional] Default value: en-GB

  // };
 

// $("#CreatePayment").on('click', function() {
//             $.ajax({
//                 url: '/payment',
//                 data: {
//                     action: 'createPay',
//                     // orderID
//                 },
//                 dataType: 'json',
//                 success: function(data) {
//                     paymentID = JSON.stringify(data);
//                     var obj = jQuery.parseJSON(paymentID);
//                     paymentID = obj.paymentId;
//                     initCheckout(paymentID);
//                 }
//             });
//         });


  
  //Gets posters and customers from sessionStorage
  //and sends them to backend
  // function getInfo(){
  //   let customer = JSON.parse(sessionStorage.getItem('customer'));
  //   let posters = JSON.parse(sessionStorage.getItem('posters'));
   
  //   $.ajax({
  //     type: 'POST',
  //     url: '/sendfiles',
  //     data: {
  //       posters:posters,
  //       customer:customer},
  //     ContentType: 'application/json',
  //     dataType: "json",
  //   }).done(function (data) {
  //     console.log('success', data);
  //   }).fail(function (jqXHR, textStatus, errorThrown) {
  //     var contentType = jqXHR.getResponseHeader("Content-Type");
  //     if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
  //       window.location.href = "/";
  //       console.log('FAILED! ERROR: ' + errorThrown);
  //     }
  //   });
  // };

  const order = {
      
    "order":{  
        "items":[  
           {  
              "reference":"abcd",
              "name":"abcd",
              "quantity":1,
              "unit":"string",
              "unitPrice":400.00,
              "taxRate":200.00,
              "taxAmount":20.00,
              "grossTotalAmount":600.00,
              "netTotalAmount":400.00
           }
        ],
        "amount":1,
        "currency":"dkk",
        "reference":"abcd"
    },
    // Use merchantNumber if you're a partner and initiating the checkout with your partner keys
    "merchantNumber":100020578,
    "checkout":{
      //If charge is set to true and consumer selects payment by invoice, reservation will be declined automatically.
      "charge":true,
      "publicDevice":true,
      "integrationType":"string",
      "url":"string",
      "returnUrl":"string",
      "termsUrl":"string",
      "appearance": {
        "displayOptions": {
          "showMerchantName": false,
          "showOrderSummary": false
        },
        "textOptions": {
          "completePaymentButtonText" : "order"
        }
      },
      "merchantHandlesConsumerData":true,
      "consumer":{  
        "reference":"string",
           "email":"string",
           "shippingAddress":{  
              "addressLine1":"string",
              "addressLine2":"string",
              "postalCode":"string",
              "city":"string",
              "country":"string"
           },
           "phoneNumber":{  
              "prefix":"string",
              "number":"string"
           },
        "privatePerson":{  
          "firstName":"string",
          "lastName":"string"
         },
         "company":{  
          "name":"string",
          "contact":{  
             "firstName":"string",
              "lastName":"string"
           }
         }
       },
        // if merchantHandlesConsumerData = false specify which consumerTypes should be available in checkout. (B2B or B2C),
        // if merchantHandlesConsumerData=true these parameters will be ignored. 
      
      "consumerType":{  
           "default":"string",
           "supportedTypes":[  
              "string"
           ]
        },
        "merchantHandlesShippingCost":true,
        //Boolean value (true/false). If set to true,
        // requires paymentID to be updated with shipping.costSpecified = true before customer can complete a purchase. 
       
      "shipping":{  
           //Specify allowed shipping countries 
        "countries":[  
              {  
                 "countryCode":"string"
              }
           ]
        }
     },
     // Notification Parameters 
      "notifications":{  
        "webHooks":[  
           {  
              "eventName":"string",
              "url":"string",
              "authorization":"string",
              "headers": [
                 {
                    "string": "string"
                 },
                 {
                    "string": "string"
                 }
              ]
           }
        ]
     },
     // Specify Invoice fee added to total price when invoice is used as payment method.  
    "paymentMethods":[
     {
        "name":"easyinvoice",
        "fee":{
           "reference":"invFee",
           "name":"fee",
           "quantity":1,
           "unit":"ct",
           "unitPrice":1000,
           "taxRate":2500,
           "taxAmount":250,
           "grossTotalAmount":1250,
           "netTotalAmount":1000
        }
     }
   ]
  }

//   axios.defaults.headers = {
//     'Content-Type': 'application/json',
//     'Accept':'application/json',
//     'Authorization':'ef160d0b15ef4bf3b243c8f6a6183b85',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers':'Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
// }

  // axios.post('https://test.api.dibspayment.eu/v1/payments', {  
  //     order: order, 
  //     mode: 'no-cors',
  //     })
  //   .then(res => {
  //     if(res.status == 200){
  //       console.log("success",res)
  //     //handle success here
  //   }
  //     console.log(res.status);
  //     console.log(`statusCode: ${res.statusCode}`)
  //     console.log(res)
  //   })
  //   .catch(error => {
      
  //   })
  
  
})


