$( document ).ready(function() {
  setBody();
});
     
  function getData() {
    const fetchJson = async url => {
        const response = await fetch(url)
        return response.json()
    }
    return new Promise(function (resolve) {
        const data = fetchJson('/data');
        setTimeout(function () {
            resolve(data)
        }, 100);
    });
};
async function setBody(){
  let paymentId;
  await getData().then(data =>{
let details =JSON.parse(Object.values(data));
console.log(details)
paymentId = details.payment.paymentId;
    $('#data').text(details.payment.paymentId )
    $('#paymentDetailsCard').text(details.payment.paymentDetails.cardDetails.expiryDate);
    $('#cardNumber').text(details.payment.paymentDetails.cardDetails.maskedPan);
    $('#paymentType').text(details.payment.paymentDetails.paymentType);
    $('#reservedAmount').text(details.payment.summary.reservedAmount);
  });

sendFiles(paymentId);

}

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
