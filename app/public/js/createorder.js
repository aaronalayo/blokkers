$( document ).ready(function() {
  displayCart();
});

//Displays the poster in the cart with size, quantity and price
function displayCart(){
  let total = 0;
  for (let i = 0; i < posters.length; i++) {
    total += posters[i].quantity;
    $(".basket-container").append(
        `<div id="poster-display-${posters[i].pname}">
        <p>
        <span id=${posters[i].pname}>${posters[i].pname}</span> 
        <span class="size">${posters[i].size}</span><span class="poster"> poster</span>
        <span class="x">x</span> <span id="amount" class="quantity">${posters[i].quantity}</span><span id='itemprice' class="price ${posters[i].size}-price">${posters[i].price}</span>
        </p>
        <hr >
        
        </div>
    `);
      
    let contents = {}, text;
    $(`#poster-display-${posters[i].pname} span`).each(function () {
        text = $(this).text();
        if (!(text in contents)) {
          contents[text] = true;
        }
        else {
          $(this.parentNode).remove();
        }
    });
  };
  $("#totalItems").text(total);
  $('#totalbasket').append(`<p>Total<span id="totalprice" class="price" style="color:black"><b>${setTotal()}</b></span></p>`)
};

//Display the total for all posters in the cart
function countInPosters() {
  let count = 0;
  let totalItems = 0;
  for (let i = 0; i < posters.length; i++) {
    count = posters[i].quantity;
    totalItems+= count
    console.log(totalItems)
  }
  return totalItems
};

$("#totalItems").text(countInPosters())

//Displays the invoice form if customer selects to
function displayForm() {
  $("#invoiceform").hide().prop('required', true)
  if ($('.check').is(":checked")) {
      $("#invoiceform").hide(300);
  } else {
      $("#invoiceform").show(300);
  }
};

//Checks if customer wants newsletter
function newsLetter() {
  $('.checknews').click(function () {
    $('.checknews').attr("checked", "checked");
  })
  $('.checknews').click(function () {
    $('.checknews').removeAttr("checked");
  });
};

//Sets the total price 
function setTotal(){
  let total= 0;
  let subTotal;
  posters.forEach(poster => {
    subTotal = poster.price * poster.quantity 
    console.log(subTotal)
    total += subTotal
    console.log(total)
    $("#totalprice").text(total)  
  });
  return total
};

//Regex expressions for form validation
const nameFilter = /^[a-zA-Z \-\_\/!0-9æøåÆØÅ\.,!?():+\[\]\n\t\r]*$/;
const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneFilter = /^[+]45[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}/;
const addressFilter = /^([A-zæøåÆØÅ]{2,40}\.?\s)+([0-9]){1,5}\w?(\s.*)?$/;
const cityFilter = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
const zipFilter = /\d{4}/;


//Gets the customer information and sends to backend
function getInfo() {
  let fullname = $("#fname").val();
  let email = $("#email").val();
  let phone = $("#phone").val();
  let address = $("#address").val();
  let city = $("#city").val();
  let zip = $("#zip").val();
  let invoicefullname = $("#invoicefullname").val();
  let invoicephone = $("#invoicephone").val();
  let invoiceaddress = $("#invoiceaddress").val();
  let invoicecity = $("#invoicecity").val();
  let invoicezip = $("#invoicezip").val();
  let newsletter = $(".checknews")[0].checked;


  //Checks form attributes
  if(nameFilter.test(String(fullname).toLowerCase()) == false){
    alert("Enter a valid name");
  }else 
  if(emailFilter.test(String(email).toLowerCase()) == false){
    alert("Enter a valid email");
  }else if(phoneFilter.test(String(phone).toLowerCase()) == false){
    alert("Enter a valid phone number");
  }else if(addressFilter.test(String(address).toLowerCase()) == false){
    alert("Enter a valid address");
  }else if(cityFilter.test(String(city).toLowerCase()) == false){
    alert("Enter a valid city");
  } else if(zipFilter.test(String(zip).toLowerCase()) == false){
    alert("Enter a valid zip code");
  } else {

  const customer = {
    fullname: fullname,
    email: email,
  };
  // $("#CreatePayment").on('click', function () {
    const orderID = "Demo Order"
    $.ajax({
      type: "GET",
       url: '/createpayment',
       data: {
          action: 'createPay',
          orderID
       },
       dataType: 'json',
       success: function (data) {
          paymentID = JSON.stringify(data);
          var obj = jQuery.parseJSON(paymentID);
          paymentID = obj.paymentId;
          console.log(paymentID)
          initCheckout(paymentID);
          
       }
       
    });
  // });
  

  sessionStorage.setItem("customer", JSON.stringify(customer));

//Ajax POST method to send to create order route
      if (fullname, email, phone, address, city, zip) {
        $.ajax({
          type: "POST",
          url: "/createorder",
          timeout: 400,
          data: {
            posters: posters,
            fullname: fullname,
            email: email,
            phone: phone,
            address: address,
            city: city,
            zip: zip,
            invoicefullname: invoicefullname,
            invoicephone: invoicephone,
            invoiceaddress: invoiceaddress,
            invoicecity: invoicecity,
            invoicezip: invoicezip,
            newsletter: newsletter,
          },
          
          ContentType: "application/json",
          dataType: "json",
        }).done(function (link) {
         
          }).fail(function (jqXHR, textStatus, errorThrown) {
            var contentType = jqXHR.getResponseHeader("Content-Type");
            if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
              // window.location.href = "/payment"
              console.log("FAILED! ERROR: " + errorThrown);
            }
          });
          return false
        }

}

}

function initCheckout(paymentID){
  console.log("Checkout init")
  var checkoutOptions = {
    checkoutKey: 'test-checkout-key-baa32b6941d04dedb5693f1e90456137', // [Required] Test or Live checkout key with dashes
    paymentId : paymentID, // [Required] Payment ID (GUID format) without dashes.
    containerId : "dibs-complete-checkout", // [Optional] Default: dibs-checkout-content
    language: "en-GB", // [Optional] Default value: en-GB
    theme: { // [Optional] as are all values within
        textColor: "", // any css color
        primaryColor: "", // any css color
        buttonRadius: "5px",
        buttonTextColor: "", // any css color
        linkColor: "", // any css color
        footerBackgroundColor: "", // any css color
        footerOutlineColor: "", // any css color
        footerTextColor: "", // any css color
        backgroundColor: "", // any css color
        panelColor: "", // any css color
        outlineColor: "", // any css color
        primaryOutlineColor: "", // any css color
        panelTextColor: "", // any css color
        panelLinkColor: "", // any css color
        fontFamily: "Roboto", // any google font
        buttonFontWeight: 500, //number or string
        buttonFontStyle: "italic", // oblique, italic, etc. any valid css value
        buttonTextTransform: "none", //any valid css text-transform
        placeholderColor: "", // any css color
        useLightIcons: false, // boolean
        useLightFooterIcons: false // boolean
    }

};
console.log(checkoutOptions);
let checkout = new Dibs.Checkout(checkoutOptions);

checkout.on('pay-initialized', function(response) {

  console.log("Checkout on")
  /*
    Complete the desired operations such as update payment
  */
    // checkout.send('payment-order-finalized', true/false);
  });
 
//this is the event that the merchant should listen to redirect to the “payment-is-ok” page
checkout.on('payment-completed', function(response) {
               /*
               Response:
                              paymentId: string (GUID without dashes)
               */
               window.location = '/PaymentSuccessful';
});
}

