$( document ).ready(function() {
  displayCart();
});

function displayCart(){
  let total = 0;
  for (let i = 0; i < posters.length; i++) {
    total += posters[i].quantity;
    $(".basket-container").append(
        `<div id="poster-display-${posters[i].pname}">
        <span id=${posters[i].pname}>${posters[i].pname}</span> 
        <span class="size">${posters[i].size}</span><span class="poster"> poster</span>
  
        <span class="x">x</span> <span id="amount" class="quantity">${posters[i].quantity}</span><span id='itemprice' class="price ${posters[i].size}-price">${posters[i].price}</span>
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

function displayForm() {
  $("#invoiceform").hide().prop('required', true)
  if ($('.check').is(":checked")) {
      $("#invoiceform").hide(300);
  } else {
      $("#invoiceform").show(300);
  }
};

function newsLetter() {
  $('.checknews').click(function () {
    $('.checknews').attr("checked", "checked");
  })
  $('.checknews').click(function () {
    $('.checknews').removeAttr("checked");
  });
};

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

function getInfo() {
  // let quantity = posters.map(poster => poster.quantity);
  // let name = posters.map(poster => poster.pname)
  // posters = posters.filter(({ pname }, index) => !name.includes(pname, index + 1))
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

  const customer = {
    fullname: fullname,
    email: email,
  };

  sessionStorage.setItem("customer", JSON.stringify(customer));


  $(document).ready(function () {
    $("#addresssform").on("submit", function (e) {
      e.preventDefault()
      if (fullname, email, phone, address, city, zip) {
        $.ajax({
          type: "POST",
          url: "/createorder",
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
        })
          .done(function (data) {

          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            
            var contentType = jqXHR.getResponseHeader("Content-Type");
            if (jqXHR.status == 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
              window.location = "http://localhost:2000/payment";
              console.log("FAILED! ERROR: " + errorThrown);
            }
          });
          
        }
    });
    
  });


}
