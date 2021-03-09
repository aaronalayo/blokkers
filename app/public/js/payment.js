
function getData() {
Promise.all([
	fetch('/data'),
	fetch('/order')
]).then(function (responses) {
	// Get a JSON object from each of the responses
	return Promise.all(responses.map(function (response) {
		return response.json();
	}));
}).then(function (data) {
	// Log the data to the console
	// You would do something with both sets of data here
	// console.log(data);
  let paymentOrder = JSON.parse(Object.values(data[0]));
  console.log(paymentOrder)
  let orderDetails = data[1];
  

  let paymentId = paymentOrder.payment.paymentId;
  let date = new Date(paymentOrder.payment.created);
  date = date.toUTCString();
  $('#date').text(date.toString().substr(0,22));
  $('#orderNumber').text("Order #"+ 105);
  displayOrder(orderDetails.order);
  setTotal(paymentOrder.payment,orderDetails.order);
  if(paymentId){
    // sendFiles(paymentId);
  }else{
    console.log("waiting for data")
  }
}).catch(function (error) {
	// if there's an error, log it
	console.log(error);
});

}
function displayOrder(order){
 
  let total = 0;
  for (let i = 0; i < order.length; i++) {
    let paths = JSON.stringify(order[i].item.item_paths).replace(/"/g, '').replace(/\\/g,'').replace(/[{}]/g,'');
   
    paths = paths.split(",");
    console.log(paths)

    // total += order[i].quantity;
   
    let name = order[i].order_title;

  $(".order-container").append(`<div id="poster-display-${name}">`);
            $(`#poster-display-${name}`).append(`<div class="order-table" id=${name}>`);
            $(`#${name}`).append(`<table class="order-table" id="table-${name}">`);
            let k = 0;
            for (let i = 0; i <= 3; i++) {
                $(`#table-${name}`).append(`<tr id=tr-${i + 1}-${name}>`)
                for (let j = k; j <= k + 2; j++) {
                    $(`#tr-${i + 1}-${name}`).append(`<td id=${j + 1}-${name}> `);
                    $(`#${j + 1}-${name}`).append(`<img src="${paths[j]}">`);
                }
                $(`#table-${name}`).append("</tr>");
                k = k + 3;
            }
            $(`#${name}`).append("</table>");
            $(`#poster-display-${name}`).append(`
        <div class="size-poster">
            <span>${order[i].item.item_format}</span><span> poster </span><span class="poster" id=${order[i].order_title}>${order[i].order_title} - </span>
        </div>
        
        <div class="quantity">
            <span id="${name}-quantity">${order[i].amount}</span>
        </div>
        <div class="poster-price">
            <span id="${name}-price">${order[i].total_price +" DKK"}</span>
        </div>

        `);
        $(`#poster-display-${name}`).append(`<hr class="basket-devider">`); 

          }
};

function setTotal(payment, order) {

  let total = payment.orderDetails.amount/100;
  
  let taxes = ((total/100)*25);
  let subTotal = (total-taxes);
  $("#subtotal-amount").text(subTotal.toFixed(2)+" DKK");
  $("#taxes-amount").text(taxes.toFixed(2)+" DKK");
  $("#total-amount").text(total.toFixed(2)+" DKK");

};
function sendFiles(paymentId){

  let customer = JSON.parse(sessionStorage.getItem('customer'));
  let posters = JSON.parse(sessionStorage.getItem('posters'));
  $.ajax({
    global: false,
    type: 'POST',
    url: '/sendfiles',
    data: {
      posters:posters,
      customer:customer,
      paymentId:paymentId
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
