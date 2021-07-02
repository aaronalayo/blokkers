

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
      // console.log(paymentDetails.payment.created)
      // date = date.toLocaleString("da-DK");
      date = date.toString().substr(0, 21);
      $("#date").text(date);
      let orderDetails = data[0].order;
      // console.log(orderDetails)
      $("#orderNumber").text("Order #" + orderDetails[0].order_no);
      let itemsDetails = data[0].items;
      displayOrder(itemsDetails);
      setTotalPay(paymentDetails.payment,itemsDetails);
      setCustomerInfo(orderDetails);
      if (paymentId) {
        if (!localStorage.paymentId || localStorage.paymentId === 'undefined' ) {
          // console.log('setting payment status in LS')
          localStorage.setItem("paymentId", "true");
          sendFiles(paymentId);
          sendMail(paymentDetails, date);
          // console.log( localStorage.paymentId)
        } else {         
          localStorage.clear();
          sessionStorage.clear();
          // document.body.style.display == "none";
          window.location.href = "/";
        }
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

async function setTotalPay(payment, items) {
  // console.log(items)
  if (payment === undefined || !payment) {
    // console.log("Waiting for data");
  } else {
    let totalPay = payment.orderDetails.amount / 100;
    let taxes = 0;
    let subTotal = 0;
    let sub =0;
    let subTaxes =0;
    let rate;
    for (let i = 0; i < items.length; i++) {
      
      sub = parseInt(items[i].total_price);
      subTaxes =  (items[i].total_price / 1.25 - sub )* -1;
      subTotal += sub;
      taxes += subTaxes;
        }
        let discount = JSON.parse(sessionStorage.getItem("discount"));
        if (discount === undefined || !discount) {
          rate =0;
        }else{
          await getDiscounts().then((data) => {
            if (data) {
              for (let [key] of Object.entries(data.discounts)) {
                if (discount === data.discounts[key].discount_code) {
                  rate = data.discounts[key].discount_rate;
                  // console.log(subTotal)
                  rate = (subTotal * parseInt(data.discounts[key].discount_rate)) / 100;
                  $("#discountSpan").show();
                  $("#discount").show();

                }
              }
            }
          });
        }
    $("#discount").text(rate.toFixed(2) + " DKK");
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
  let shippingCountry = "Demmark";
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
  // console.log(customer, posters,paymentId)
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
function sendMail(paymentDetails, date) {
  let discount = JSON.parse(sessionStorage.getItem("discount"));
  let customer = JSON.parse(sessionStorage.getItem('customer'));  
  $.ajax({
    global: false,
    type: 'POST',
    url: '/sendmail',
    data: {
      // posters: posters,
      customer: customer,
      paymentDetails: paymentDetails,
      date:date,
      discount: discount
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

function checkRefresh()
{
	// Get the time now and convert to UTC seconds
	let today = new Date();
	let now = today.getUTCSeconds();

	// Get the cookie
	let cookie = document.cookie;
	let cookieArray = cookie.split('; ');

	// Parse the cookies: get the stored time
	for(let loop=0; loop < cookieArray.length; loop++)
	{
		let nameValue = cookieArray[loop].split('=');
		// Get the cookie time stamp
		if( nameValue[0].toString() == 'SHTS' )
		{
			var cookieTime = parseInt( nameValue[1] );
		}
		// Get the cookie page
		else if( nameValue[0].toString() == 'SHTSP' )
		{
			var cookieName = nameValue[1];
		}
	}

	if( cookieName &&
		cookieTime &&
		cookieName == escape(location.href) &&
		Math.abs(now - cookieTime) < 5 )
	{
		// Refresh detected

		// Insert code here representing what to do on
		// a refresh
    localStorage.clear();
		// If you would like to toggle so this refresh code
		// is executed on every OTHER refresh, then 
		// uncomment the following line
		// refresh_prepare = 0; 
	}	

	// You may want to add code in an else here special 
	// for fresh page loads
}

function prepareForRefresh()
{
	if( refresh_prepare > 0 )
	{
		// Turn refresh detection on so that if this
		// page gets quickly loaded, we know it's a refresh
		let today = new Date();
		let now = today.getUTCSeconds();
		document.cookie = 'SHTS=' + now + ';';
		document.cookie = 'SHTSP=' + escape(location.href) + ';';
	}
	else
	{
		// Refresh detection has been disabled
		document.cookie = 'SHTS=;';
		document.cookie = 'SHTSP=;';
	}
}

function disableRefreshDetection()
{
	// The next page will look like a refresh but it actually
	// won't be, so turn refresh detection off.
	refresh_prepare = 0;

	// Also return true so this can be placed in onSubmits
	// without fear of any problems.
	return true;
} 

// By default, turn refresh detection on
let refresh_prepare = 1;


window.onbeforeunload = function() {
  localStorage.removeItem("paymentId");
 
};