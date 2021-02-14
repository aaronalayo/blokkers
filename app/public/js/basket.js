$( document ).ready(function() {
    console.log("loaded");
    
    displayPosters();
    calculateTotal();

});
let posters = JSON.parse(sessionStorage.posters);

//displays all posters that are added to basket
function displayPosters(){
    
    //checks if there are posters added, if not it shows empty-basket div
    if(!posters.length > 0){
        $("#basket-header").hide();
        $("#total-amount-box").hide();
        $("#empty-basket").show();
    }

    //goes through each poster and displays it with it's size, price and quantity
    posters.forEach(poster => {
        let name;
        
        //checks if element with id same as the poster name exist
        //if yes it changes the name of the poster so a new row can be added for a poster with same name
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
        $(`#poster-display-${name}`).append(`<div class="basket-table" id=${name}>`);
        $(`#${name}`).append(`<table class="basket-table" id="table-${name}">`);
        let k = 0;
        for (let i = 0; i <= 3; i++) {
            $(`#table-${name}`).append(`<tr id=tr-${i + 1}-${name}>`)
            for (let j = k; j <= k + 2; j++) {
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
            <span id="${name}-price">${calculatePosterPrice(poster)}</span>
        </div>
        <button class="remove-poster-btn" onclick="remove(`+ JSON.stringify(poster).replace(/"/g, '&quot;') +`)">Remove <i class="fa fa-trash-o"></i></button>`);
        $(`#poster-display-${name}`).append(`<hr class="basket-devider">`);
       // $("#name").text(name);
        $("#size").text(poster.size);
        
    });    
    
};

//updates the quantity of the poster in the sessionStorage and updates the price
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

//increments the quantity of the poster 
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

//decrements the quantity of the poster
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

//removes a poster from the sessionStorage
function remove(poster){
    posters.forEach(p => {
        if(p.pname === poster.pname){
            const index = posters.indexOf(p);
            if (index > -1) {
                posters.splice(index, 1);
                console.log("deleted");
                console.log(posters);
                sessionStorage.setItem("posters", JSON.stringify(posters));
                window.location.href = window.location.href
            }
        }
    }); 
};

//gets the formats with their prices and returns them as Promise
function getFormats() {
    const fetchJson = async url => {
        const response = await fetch(url)
        return response.json()
    }
    return new Promise(function (resolve) {
        const formats = fetchJson('/formats');
        setTimeout(function () {
            resolve(formats)
        }, 50);
    });
};

//calculates the poster price based on the format and quantity
 async function calculatePosterPrice(poster){
    
    let price =0;
    let amount=0;
    await getFormats().then(data => {
        for (let [key] of Object.entries(data.formats)) {
            
            if (poster.size === data.formats[key].format_no) {
               
                price = data.formats[key].price;
                poster.price = price;
                
                amount = poster.price * poster.quantity;
                
                
                
                
            }
            sessionStorage.setItem("posters", JSON.stringify(posters));
            
          
        }
        $("#" + poster.pname + "-price").text(amount.toFixed(2));
        
    }); 
    return price
};

function calculateTotal() {
    let total=0;
    let subTotal=0;
    let taxes=0;
    let subTaxes=0;
    let price =0;
    let sub = 0;
    getFormats().then(data => {
    posters.forEach(poster => {
        $("#subtotal-amount").text("...");
        $("#taxes-amount").text("...");
        $("#total-amount").text("...");
        
            for (let [key] of Object.entries(data.formats)) {
                if (poster.size === data.formats[key].format_no) {
                    price = data.formats[key].price;
                    subTotal = price * poster.quantity;
                    subTaxes = (price * poster.quantity * 25) / 100;       
                    
                }
              
            }
            taxes += subTaxes;    
            sub += subTotal;
            total += subTotal  
                     
           

        });
         // taxes = taxes.toFixed(Math.max(((taxes + '').split(".")[1] || "").length, 2));

            // total = total.toFixed(Math.max(((total + '').split(".")[1] || "").length, 2));
            $("#subtotal-amount").text(sub.toFixed(2));
            $("#taxes-amount").text(taxes.toFixed(2));
            $("#total-amount").text(total.toFixed(2));
    });
    // return total

};

