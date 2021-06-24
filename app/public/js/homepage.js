
function playVideo() {
    document.getElementById('intro-video').play();
    for(let i = 0; i < $('.page').length; i++){
        let elm = $('.page')[i];
        if( $(document).scrollTop() >= $(elm).offset().top ){
            currentPos = i;
        }
        
    }
}


function getCart() {
    const fetchJson = async url => {
        const response = await fetch(url)
        return response.json()
    }
    return new Promise(function (resolve) {
        const cart = fetchJson('/cart');
        setTimeout(function () {
            resolve(cart)
        }, 200);
    });
};
async function setCart() {
    try {
        await getCart().then((data) => {
            
            if(typeof data === undefined ||
                !data ||
                data === "" ||
                data.length < 1){
                console.log("no data")
                
            }else{
                sessionStorage.setItem("posters", JSON.stringify(data.cart));
            }
            
            })
    } catch (error) {
        console.log(error)
    }
       
    };




