//displays all posters that are added to basket
function displayPosters() {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  //checks if there are posters added, if not it shows empty-basket div
  if (
    typeof posters === undefined ||
    !posters ||
    posters === "" ||
    posters.length < 1
  ) {
    $("#basket-header").hide();
    $("#total-amount-box").hide();
    $(".coupon").hide();
    $("#empty-basket").show();
  } else if (posters.length > 0) {
    //goes through each poster and displays it with it's size, price and quantity
    posters.forEach((poster) => {
      let name;
      //checks if element with id same as the poster name exist
      //if yes it changes the name of the poster so a new row can be added for a poster with same name
      if (!$("#" + poster.pname).length) {
        name = poster.pname;
      } else {
        name = poster.pname + 1;
        while ($("#" + name).length) {
          name = name + 1;
        }
        poster.pname = name;
        sessionStorage.setItem("posters", JSON.stringify(posters));
      }
      $(".basket-items").append(`<div id="poster-display-${name}"></div`);
      $(`#poster-display-${name}`).append(
        `<div class="basket-table" id=${name}></div>`
      );
      $(`#${name}`).append(
        `<table class="basket-table" id="table-${name}"></table>`
      );
      let k = 0;
      for (let i = 0; i <= 3; i++) {
        $(`#table-${name}`).append(`<tr id=tr-${i + 1}-${name}></tr>`);
        for (let j = k; j <= k + 2; j++) {
          $(`#tr-${i + 1}-${name}`).append(`<td id=${j + 1}-${name}></td> `);
          $(`#${j + 1}-${name}`).append(`<img src="${poster.paths[j]}">`);
        }
        k = k + 3;
      }
      $(`#poster-display-${name}`).append(
        `
        <div class="size-poster">
            <span>${poster.size}</span><span> poster</span>
        </div>
    
        <div class="quantity">
            <span class="quantityleft"><button id="${name}-decrease" onclick="decrement(` +
          JSON.stringify(poster).replace(/"/g, "&quot;") +
          `)"><</button></span>
            <span class="quantitynumber" id="${name}-quantity">${poster.quantity}</span>
            <span class="quantityright"><button onclick="increment(` +
          JSON.stringify(poster).replace(/"/g, "&quot;") +
          `)">></button></span>
        </div>
        <div class="poster-price">
            <span id="${name}-price"></span>
        </div>
        <div class="trash">
        <span id="trash" onclick="remove(` +
          JSON.stringify(poster).replace(/"/g, "&quot;") +
          `)"><i class="fa fa-trash-o" style="font-size:18px" aria-hidden="true""></i></span>
        </div>
        `
      );
      $(`#poster-display-${name}`).append(`<hr class="basket-devider">`);
      $("#size").text(poster.size);
      calculatePosterPrice(poster);
    });
  }
}

function updateQuantity(poster, quantity) {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  if (posters) {
    posters.forEach((p) => {
      if (p.pname === poster.pname) {
        p.quantity = quantity;

        let price = p.price * p.quantity;
        sessionStorage.setItem("posters", JSON.stringify(posters));
        $("#" + poster.pname + "-price").text(price.toFixed(2) + " DKK");
        calculateTotal();
        updateCart();
      }
    });
  }
}

//increments the quantity of the poster
function increment(poster) {
  let str = "#" + poster.pname + "-quantity";
  let a = $(str).text();
  a++;
  if (a > 1) {
    $("#" + poster.pname + "-decrease").prop("disabled", false);
  }
  $(str).text(a);
  updateQuantity(poster, a);
}

//decrements the quantity of the poster
function decrement(poster) {
  let str = "#" + poster.pname + "-quantity";
  let a = $(str).text();
  if (a == 1) {
    $("#" + poster.pname + "-decrease").prop("disabled", true);
  } else {
    a--;
    $(str).text(a);
    updateQuantity(poster, a);
  }
}

//removes a poster from the sessionStorage
function remove(poster) {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  if (posters) {
    posters.forEach((p) => {
      if (p.pname === poster.pname) {
        const index = posters.indexOf(p);
        if (index > -1) {
          posters.splice(index, 1);
          deleteCart();
          sessionStorage.setItem("posters", JSON.stringify(posters));

          window.location.href = window.location.href;
        }
      }
    });
  }
}

//gets the formats with their prices and returns them as Promise
function getFormats() {
  const fetchJson = async (url) => {
    const response = await fetch(url);
    return response.json();
  };
  return new Promise(function (resolve) {
    const formats = fetchJson("/formats");
    setTimeout(function () {
      resolve(formats);
    }, 200);
  });
}

//calculates the poster price based on the format and quantity
async function calculatePosterPrice(poster) {
  // let posters = JSON.parse(sessionStorage.getItem("posters"));
  let price = 0;
  let amount = 0;
  $("#" + poster.pname + "-price").text("...");
  await getFormats().then((data) => {
    for (let [key] of Object.entries(data.formats)) {
      console.log(data.formats)
      if (poster.size === data.formats[key].format_no) {
        price = data.formats[key].price;
        poster.price = price;
        console.log(price)
        amount = poster.price * poster.quantity;
        console.log(amount)
        update(price);
      }
    }
    $("#" + poster.pname + "-price").text(amount.toFixed(2) + " DKK");
  });
  return price;
}

function update(price) {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  posters.forEach((p) => {
    p.price = price;
  });
  sessionStorage.setItem("posters", JSON.stringify(posters));
  addToCart();
}

function calculateTotal() {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  let total = 0;
  let subTotal = 0;
  let taxes = 0;
  let subTaxes = 0;
  let price = 0;
  let sub = 0;
  $("#subtotal-amount").text("...");
  $("#taxes-amount").text("...");
  $("#total-amount").text("...");
  getFormats().then((data) => {
    if (posters) {
      posters.forEach((poster) => {
        for (let [key] of Object.entries(data.formats)) {
          if (poster.size === data.formats[key].format_no) {
            price = data.formats[key].price;
            subTotal = price * poster.quantity;
            subTaxes = ((price * poster.quantity) / 1.25 - subTotal )* -1;
          }
        }
        taxes += subTaxes;
        sub += subTotal;
        total += subTotal;
      });

      $("#subtotal-amount").text(sub.toFixed(2) + " DKK");
      $("#taxes-amount").text(taxes.toFixed(2) + " DKK");
      $("#total-amount").text(total.toFixed(2) + " DKK");
      updateDiscount();
    }
  });
}
function getDiscounts() {
  const fetchJson = async (url) => {
    const response = await fetch(url);
    return response.json();
  };
  return new Promise(function (resolve) {
    const formats = fetchJson("/discounts");
    setTimeout(function () {
      resolve(formats);
    }, 200);
  });
}
async function applyDiscount() {
  let code = $("#discount").val().toLowerCase();
  let total = $("#total-amount").text();

  total = parseFloat(total.substr(0, 6)).toFixed(2);
  let node = document.getElementById("discount-amount");
  let discountText = node.textContent || node.innerText;
  // console.log(discountText);
  await getDiscounts().then((data) => {
    if (data) {
      for (let [key] of Object.entries(data.discounts)) {
        if (discountText === data.discounts[key].discount_rate) {
          $("#discount").val("");
          alert("This discount code is already applied!");
        } else if (code === data.discounts[key].discount_code) {
          let rate = data.discounts[key].discount_rate;

          rate = rate.replace("%", "");

          rate = parseInt(rate);

          let discount = (total * rate) / 100;

          total = total - discount;
          $("#total-amount").text(total.toFixed(2) + " DKK");
          $("#discount").val("");
          $("#total-amount-box").css("height", "230px");
          $("#discount-amount").text("-" + data.discounts[key].discount_rate);
          $("#discount-row").show();

          sessionStorage.setItem("total", JSON.stringify(total));
          sessionStorage.setItem("discount", JSON.stringify(code));
        } else if (code === "" || code !== data.discounts[key].discount_code) {
          $("#discount").val("");
          alert("There is no discount for this code!");
        }
      }
    }
  });
}
async function updateDiscount() {
  let discountText = JSON.parse(sessionStorage.getItem("discount"));
  let total = $("#total-amount").text();
  total = parseFloat(total.substr(0, 6)).toFixed(2);
  if (discountText) {
    await getDiscounts().then((data) => {
      if (data) {
        for (let [key] of Object.entries(data.discounts)) {
          if (discountText === data.discounts[key].discount_code) {
            let rate = data.discounts[key].discount_rate;

            rate = rate.replace("%", "");

            rate = parseInt(rate);

            let discount = (total * rate) / 100;

            total = total - discount;
            $("#total-amount").text(total.toFixed(2) + " DKK");
            $("#discount").val("");
            $("#total-amount-box").css("height", "230px");
            $("#discount-amount").text("-" + data.discounts[key].discount_rate);
            $("#discount-row").show();
          }
        }
      }
    });
  }
}
function addToCart() {
  let posters = JSON.parse(sessionStorage.getItem("posters"));
  // console.log(posters);
  $.ajax({
    global: false,
    type: "POST",
    url: "/setcart",
    data: {
      posters: posters,
    },
    ContentType: "application/json",
    dataType: "json",
  })
    .done(function (data) {
      console.log("success", data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //   var contentType = jqXHR.getResponseHeader("Content-Type");
      //   if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
      //     // window.location.href = "/";
      //     console.log('FAILED! ERROR: ' + errorThrown);
      //   }
    });
}

function updateCart() {
  let posters = JSON.parse(sessionStorage.getItem("posters"));

  $.ajax({
    global: false,
    type: "POST",
    url: "/updatecart",
    data: {
      posters: posters,
    },
    ContentType: "application/json",
    dataType: "json",
  })
    .done(function (data) {
      console.log("success", data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //   var contentType = jqXHR.getResponseHeader("Content-Type");
      //   if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
      //     // window.location.href = "/";
      //     console.log('FAILED! ERROR: ' + errorThrown);
      //   }
    });
}
function deleteCart() {
  // let posters = JSON.parse(sessionStorage.getItem('posters'));
  $.ajax({
    global: false,
    type: "POST",
    url: "/deletecart",
    //   data: {
    //     posters:posters
    //   },
    ContentType: "application/json",
    dataType: "json",
  })
    .done(function (data) {
      console.log("success", data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //   var contentType = jqXHR.getResponseHeader("Content-Type");
      //   if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
      //     // window.location.href = "/";
      //     console.log('FAILED! ERROR: ' + errorThrown);
      //   }
    });
}
