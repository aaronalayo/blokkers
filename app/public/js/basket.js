$( document ).ready(function() {
    console.log("loaded");
    displayPosters();
    calculateTotal();
});
var posters = JSON.parse(sessionStorage.posters);

function displayPosters(){
    if(!posters.length > 0){
        $("#basket-header").hide();
        $("#total-amount-box").hide();
        $("#empty-basket").show();
    }
    posters.forEach(poster => {
        console.log(poster);
        var name;
        if(!$("#" + poster.pname).length){
            name = poster.pname;
        }
        else{
            name = poster.pname + 1;
            while($("#" + name).length){
                name = name + 1;
            }
            poster.pname = name;
            sessionStorage.setItem("posters", JSON.stringify(posters));
        }
        $(".basket-items").append(`<div id="poster-display-${name}">`);
        // $(`#poster-display-${name}`).append(`<input class="basket-checkbox" type="checkbox" name=${name}>`);
        $(`#poster-display-${name}`).append(`<div class="basket-table" id=${name}>`);
        $(`#${name}`).append(`<table class="basket-table" id="table-${name}">`);
        var k = 0;
        for (var i = 0; i <= 3; i++) {
            $(`#table-${name}`).append(`<tr id=tr-${i + 1}-${name}>`)
            for (var j = k; j <= k + 2; j++) {
                $(`#tr-${i + 1}-${name}`).append(`<td id=${j + 1}-${name}> `);
                $(`#${j + 1}-${name}`).append(`<img src="${poster.paths[j]}">`);
                }
                $(`#table-${name}`).append("</tr>");
                k = k + 3;
        }
        $(`#${name}`).append("</table>");
        $(`#poster-display-${name}`).append(`<div class="size-poster">
            <span>${poster.size}</span><span> poster</span>
        </div>
        <div class="quantity">
            <span>Quantity</span>
            <span><button id="${name}-decrease" onclick="decrement(`+ JSON.stringify(poster).replace(/"/g, '&quot;') +`)"><</button></span>
            <span id="${name}-quantity">${poster.quantity}</span>
            <span><button onclick="increment(`+ JSON.stringify(poster).replace(/"/g, '&quot;') +`)">></button></span>
        </div>
        <div class="poster-price">
            <span id="${name}-price">${calculatePosterPrice(poster)}</span><span> dkk</span>
        </div>
        <button class="remove-poster-btn" onclick="remove(`+ JSON.stringify(poster).replace(/"/g, '&quot;') +`)">Remove <i class="fa fa-trash-o"></i></button>`);
        $(`#poster-display-${name}`).append(`<hr class="basket-devider">`);
       // $("#name").text(name);
        $("#size").text(poster.size);
    });    
};

function updateQuantity(poster, quantity){
    posters.forEach(p => {
        if(p.pname === poster.pname){
            p.quantity = quantity;
            sessionStorage.setItem("posters", JSON.stringify(posters));
            $("#" + poster.pname + "-price").text(p.price * p.quantity);
            calculateTotal();
        }
    });
};

function increment(poster){
    let str = "#" + poster.pname + "-quantity";
    let a = $(str).text();
    a++;
    if(a > 1){
        $("#" + poster.pname + "-decrease").prop('disabled', false);
    }
    $(str).text(a);
    updateQuantity(poster, a);
    
};

function decrement(poster){
    let str = "#" + poster.pname + "-quantity";
    let a = $(str).text();
    if(a == 1){
        $("#" + poster.pname + "-decrease").prop('disabled', true);
    }else{
        a--;
        $(str).text(a);
        updateQuantity(poster, a);
    }
};

function remove(poster){
    console.log(poster);
    posters.forEach(p => {
        if(p.pname === poster.pname){
            const index = posters.indexOf(p);
            if (index > -1) {
                posters.splice(index, 1);
                console.log("deleted");
                console.log(posters);
                sessionStorage.setItem("posters", JSON.stringify(posters));
                document.location.reload(true)
            }
        }
    }); 
};

function getFormats() {
    const fetchJson = async url => {
        const response = await fetch(url)
        return response.json()
    }
    return new Promise(function (resolve) {
        const formats = fetchJson('/formats');
        setTimeout(function () {
            resolve(formats)
        }, 200);
    });
};

async function calculatePosterPrice(poster){
    let price;
    await getFormats().then(data => {
        for (let [key] of Object.entries(data.formats)) {
            if (poster.size === data.formats[key].format_no) {
                price = data.formats[key].price;
                poster.price = price;
                sessionStorage.setItem("posters", JSON.stringify(posters));
                $("#" + poster.pname + "-price").text(poster.price * poster.quantity);
            }
        }
    });     
};

function calculateTotal(){
    let total = 0;
    posters.forEach(poster => {
        total += poster.quantity * poster.price;
    });
    $("#subtotal-amount").text(total);
    $("#total-amount").text(total);
    return total;
};