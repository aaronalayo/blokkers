

function getData() {
  
  Promise.all([
    fetch('/data'),
  ]).then(function (responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function (response) {
      return response.json();
    }));
  }).then(function (data) {
    // Log the data to the console
    // You would do something with both sets of data here
    // console.log(data);
    if (data === undefined || !data) {
      // console.log("Waiting for data");
    } else {
      let paymentDetails = data[0].data;
      paymentDetails = JSON.parse(paymentDetails);

      let paymentId = paymentDetails.payment.paymentId;
      let date = new Date(paymentDetails.payment.created);
      date = date.toUTCString();
      $("#date").text(date.toString().substr(0, 22));
      let orderDetails = data[0].order;
      // console.log(orderDetails)
      $("#orderNumber").text("Order #" + orderDetails[0].order_no);
      let itemsDetails = data[0].items;
      displayOrder(itemsDetails);
      setTotalPay(paymentDetails.payment);
      setCustomerInfo(orderDetails);
      if (paymentId) {
        if (!localStorage.paymentId || localStorage.paymentId === 'undefined' ) {
          // console.log('setting payment status in LS')
          localStorage.setItem("paymentId", "true");
          sendFiles(paymentId);
          // console.log( localStorage.paymentId)
        } else {
          console.log(localStorage.paymentId);
          // for (let i = 0; i < localStorage.length; i++) {
          //   let storedValue = localStorage.key(i);
          //   console.log(`Item at ${i}: ${storedValue}`);
          // }
          window.location.href = "/";
          localStorage.clear();
          sessionStorage.clear();
          // console.log( localStorage.paymentId == 'true')
        }
        // if(!storedValue || storedValue == null ){
        //   sendFiles(paymentId);
        //   localStorage.setItem('paymentId', "true");
        //  }else {
        //   if(localStorage.localStorage.key(0) === true){
        //     window.location.href = "/";
        //   }
        //  }
      } else {
        console.log("waiting for data");
      }
    }
  }).catch(function (error) {
    // if there's an error, log it
    console.log(error);
  });

};

function displayOrder(items) {
  for (let i = 0; i < items.length; i++) {
    let paths = JSON.stringify(items[i].item_paths).replace(/"/g, '').replace(/\\/g, '').replace(/[{}]/g, '');
    paths = paths.split(",");
    // console.log(paths)
    let name = items[i].item_name;
    $(".order-container").append(`<div id="poster-display-${name}"></div>`);
    $(`#poster-display-${name}`).append(`<div class="order-table" id=${name}></div>`);
    $(`#${name}`).append(`<table class="order-table" id="table-${name}"></table>`);
    let k = 0;
    for (let i = 0; i <= 3; i++) {
      $(`#table-${name}`).append(`<tr id=tr-${i + 1}-${name}></tr>`)
      for (let j = k; j <= k + 2; j++) {
        $(`#tr-${i + 1}-${name}`).append(`<td id=${j + 1}-${name}></td>`);
        $(`#${j + 1}-${name}`).append(`<img src="${paths[j]}">`);
      }
      k = k + 3;
    }
    $(`#poster-display-${name}`).append(`
        <div class="size-poster">
            <span>${items[i].item_format}</span><span> poster </span><span class="poster" id=${name}>${name} - </span>
        </div>      
        <div class="quantity">
            <span id="${name}-quantity">${items[i].amount}</span>
        </div>
        <div class="poster-price">
            <span id="${name}-price">${items[i].total_price + " DKK"}</span>
        </div>
        `);
    $(`#poster-display-${name}`).append(`<hr class="basket-devider">`);
  }
  
};

function setTotalPay(payment) {
  if (payment === undefined || !payment) {
    // console.log("Waiting for data");
  } else {
    let totalPay = payment.orderDetails.amount / 100;

    let taxes = ((totalPay * 25)/ 100 );
    let subTotal = totalPay;
    $("#subtotal-amount").text(subTotal.toFixed(2) + " DKK");
    $("#taxes-amount").text(taxes.toFixed(2) + " DKK");
    $("#total-amount").text(totalPay.toFixed(2) + " DKK");

  }
};

function setCustomerInfo(order) {
  let shippingName = order[0].customer.shipping_full_name;
  let shippingAddress = order[0].customer.shipping_address;
  let shippingZip = order[0].customer.shipping_zip_code;
  let shippingCity = order[0].customer.shipping_city
  let shippingCountry = "DK";
  let shippingEmail = order[0].customer.email;

  let billingName = order[0].customer.billing_full_name != null ? order[0].customer.billing_full_name : shippingName;
  let billingAddress = order[0].customer.billing_address != null ? order[0].customer.billing_address : shippingAddress;
  let billingZip = order[0].customer.billing_zip_code != null ? order[0].customer.billing_zip_code : shippingZip;
  let billingCity = order[0].customer.billing_city != null ? order[0].customer.billing_city : shippingCity;
  let billingCountry = order[0].customer.billing_country != null ? order[0].customer.billing_country : shippingCountry;
  let billingEmail = order[0].customer.email;

  
  $("#shippingname").text(shippingName);
  $("#shippingaddress").text(shippingAddress);
  $("#shippingzip").text(shippingZip);
  $("#shippingcity").text(shippingCity);
  $("#shippingcountry").text(shippingCountry);
  $("#shippingemail").text(shippingEmail);

  $("#billingname").text(billingName);
  $("#billingaddress").text(billingAddress);
  $("#billingzip").text(billingZip);
  $("#billingcity").text(billingCity);
  $("#billingcountry").text(billingCountry);
  $("#billingemail").text(billingEmail);
}
function sendFiles(paymentId) {
 
  let customer = JSON.parse(sessionStorage.getItem('customer'));
  let posters = JSON.parse(sessionStorage.getItem('posters'));
  console.log(customer, posters)
  $.ajax({
    global: false,
    type: 'POST',
    url: '/sendfiles',
    data: {
      posters: posters,
      customer: customer,
      paymentId: paymentId
    },
    ContentType: 'application/json',
    dataType: "json",
  }).done(function (data) {
 
    console.log('success', data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    var contentType = jqXHR.getResponseHeader("Content-Type");
    if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
      window.location.href = "/";
      console.log('FAILED! ERROR: ' + errorThrown);
      
    }
    
  });

};
// window.onbeforeunload = function() {
  
// };
