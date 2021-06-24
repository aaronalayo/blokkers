
//Displays the poster in the cart with size, quantity and price
function displayCart(){
  if(sessionStorage.posters){

 
  let posters = JSON.parse(sessionStorage.posters);
  let total = 0;
  for (let i = 0; i < posters.length; i++) {
    total += posters[i].quantity;
    $(".basket-container").append(
        `<div id="poster-display-${posters[i].pname}">
        <p>
        <div class="itemscart">
        <span id=${posters[i].pname}>${posters[i].pname}</span> 
        <span class="size">${posters[i].size}</span><span class="poster"> poster</span>
        <span class="x">x</span> <span id="amount" class="quantity">${posters[i].quantity}</span>
        <span id='itemprice' class="price ${posters[i].size}-price">${posters[i].price +" DKK"}</span>
        </div>
        
        </p>
        <hr>
        
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
  $('#shippingprice').append(`<p id="shippingpricetext">Shipping<span class="price"><b>0 DKK</b></span></p>`);
  $('#taxes').append(`<p id="taxesText">Taxes(incl.)<span id="totalTaxes" class="price"><b></b></span></p>`); 
  $('#totalbasket').append(`<p>Total<span id="totalprice" class="price" style="color:black"><b></b></span></p>`);
  setTaxes();
  setTotal();
};
};

//Display the total for all posters in the cart
function countInPosters() {
  if(sessionStorage.posters){
  let posters = JSON.parse(sessionStorage.posters);
  let count = 0;
  let totalItems = 0;
  for (let i = 0; i < posters.length; i++) {
    count = posters[i].quantity;
    totalItems+= count
    // console.log(totalItems)
  }
  return totalItems
}
};

$("#totalItems").text(countInPosters())

//Displays the billing form if customer selects to
function displayForm() {
  $("#billingform").hide().prop('required', true)
  if ($('.check').is(":checked")) {
      $("#billingform").hide(300);
  } else {
      $("#billingform").show(300);
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
function getDiscounts() {
  const fetchJson = async url => {
      const response = await fetch(url)
      return response.json()
  }
  return new Promise(function (resolve) {
      const formats = fetchJson('/discounts');
      setTimeout(function () {
          resolve(formats)
      }, 200);
  });
};
//Sets the total price 
async function setTotal() {
  if(sessionStorage.posters){
  let posters = JSON.parse(sessionStorage.posters);
  let totalOrder = 0;
  let subTotal;
  let rate = 0;
  let total = 0;
  let discount = JSON.parse(sessionStorage.getItem("discount"));
  if (discount) {
    await getDiscounts().then(data => {
      if (data) {
        for (let [key] of Object.entries(data.discounts)) {
          if (discount === data.discounts[key].discount_code) {
            posters.forEach(poster => {
              subTotal = poster.price * poster.quantity
              // console.log(subTotal)
              total += subTotal;
              rate = (total * parseInt(data.discounts[key].discount_rate)) / 100;
              totalOrder = total - rate;
            });
            totalOrder = totalOrder.toFixed(Math.max(((totalOrder + '').split(".")[1] || "").length, 2))
            $("#totalprice").text(totalOrder +" DKK");
          }
        }
      }
    });
  } else if(!discount){
    posters.forEach(poster => {
      subTotal = poster.price * poster.quantity
      // console.log(subTotal)
      totalOrder += subTotal;
      // console.log(totalOrder);
    });
    totalOrder = totalOrder.toFixed(Math.max(((totalOrder+'').split(".")[1]||"").length, 2)); 
    $("#totalprice").text(totalOrder+" DKK");
  }
  return totalOrder
}
};

function setTaxes(){
  if(sessionStorage.posters){
  let posters = JSON.parse(sessionStorage.posters);
  let taxes= 0;
 let subTotal;
  posters.forEach(poster => {
    subTotal = (poster.price * poster.quantity * 25)/100
    taxes += subTotal;   
  });
  taxes = taxes.toFixed(Math.max(((taxes+'').split(".")[1]||"").length, 2));
  $("#totalTaxes").text(taxes);
  return taxes
}
};

//Regex expressions for form validation
const nameFilter = /^[a-zA-Z \-\_\/!0-9æøåÆØÅ\.,!?():+\[\]\n\t\r]*$/;
const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneFilter = /^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}/;
const addressFilter = /^([A-zæøåÆØÅ]{2,40}\.?\s)+([0-9]){1,5}[,]?\w?(\s.*)?$/;
const cityFilter = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
const zipFilter = /\d{4}/;


//Gets the customer information and sends to backend
function getInfo() {
  let shippingfullname = $("#shippingfullname").val();
  let email = $("#shippingemail").val();
  let shippingcode =$('#shippingcode').val();
  
  let billingcode =$('#billingcode').val();
  let shippingphone = $("#shippingphone").val();
  let shippingaddress = $("#shippingaddress").val();
  let shippingcity = $("#shippingcity").val();
  let shippingzip = $("#shippingzip").val();
  let billingfullname = $("#billingfullname").val();
  let billingphone = $("#billingphone").val();
  let billingaddress = $("#billingaddress").val();
  let billingcity = $("#billingcity").val();
  let billingzip = $("#billingzip").val();
  let newsletter = $(".checknews")[0].checked;


  //Checks form attributes
  if (nameFilter.test(String(shippingfullname).toLowerCase()) == false) {
    alert("Enter a valid name");
  } else
    if (emailFilter.test(String(email).toLowerCase()) == false) {
      alert("Enter a valid email");
    } else if (phoneFilter.test(String(shippingphone).toLowerCase()) == false) {
      alert("Enter a valid phone number");
    } else if (addressFilter.test(String(shippingaddress).toLowerCase()) == false) {
      alert("Enter a valid address");
    } else if (cityFilter.test(String(shippingcity).toLowerCase()) == false) {
      alert("Enter a valid city");
    } else if (zipFilter.test(String(shippingzip).toLowerCase()) == false) {
      alert("Enter a valid zip code");
    } else {

      const customer = {
        shippingfullname: shippingfullname,
        email: email,
        shippingphone: shippingcode + shippingphone,
        shippingaddress: shippingaddress,
        shippingcity: shippingcity,
        shippingzip: shippingzip,
        billingfullname: billingfullname,
        billingphone: billingcode + billingphone,
        billingaddress: billingaddress,
        billingcity: billingcity,
        billingzip: billingzip,
        newsletter: newsletter,
      };

      sessionStorage.setItem("customer", JSON.stringify(customer));
      let discountCode = JSON.parse(sessionStorage.getItem('discount'));
      let posters = JSON.parse(sessionStorage.getItem("posters"));
      //Ajax POST method to send to create order route
      if (shippingfullname, email, shippingphone, shippingaddress, shippingcity, shippingzip) {
        $.ajax({
          type: "POST",
          url: "/createpaymentorder",
          data: {
            discountCode: discountCode,
            posters: posters,
            shippingfullname: shippingfullname,
            email: email,
            shippingphone: shippingcode + shippingphone,
            shippingaddress: shippingaddress,
            shippingcity: shippingcity,
            shippingzip: shippingzip,
            billingfullname: billingfullname,
            billingphone: billingcode + billingphone,
            billingaddress: billingaddress,
            billingcity: billingcity,
            billingzip: billingzip,
            newsletter: newsletter,
          },

        })
          .done(function (data, response) {
            $("#btnSubmit").attr("disabled", true);
            if (response === "success") {
              let obj = jQuery.parseJSON(data);
              let paymentID = obj.paymentId;
              let hostedPayPageUrl = obj.hostedPaymentPageUrl
              storeOrder(paymentID);
              
              // initCheckout(paymentID,hostedPayPageUrl);
              window.location = hostedPayPageUrl;
              // sessionStorage.clear();
            } else {
              console.log("error")
            }
          }).fail(function (jqXHR, textStatus, errorThrown) {
            var contentType = jqXHR.getResponseHeader("Content-Type");
            if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
            }
          })
      }
    }
};




function storeOrder(paymentId){
  
  let customer = JSON.parse(sessionStorage.getItem('customer'));
  let posters = JSON.parse(sessionStorage.getItem('posters'));

  $.ajax({
    global: false,
    type: 'POST',
    url: '/createorder',
    data: {
      posters:posters,
      customer:customer,
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


function suscribe(){
  
  let email = $("#shippingemail").val();
// console.log(email)
  $.ajax({
    global: false,
    type: 'POST',
    url: 'https://blokkers.us1.list-manage.com/subscribe/post?u=c64ec13be070320812876301f&amp;id=8c0776ff43',
    data: {
      email:email,
  
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
