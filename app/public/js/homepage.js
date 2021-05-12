
function playVideo() {
    document.getElementById('intro-video').play();
    for(let i = 0; i < $('.page').length; i++){
        let elm = $('.page')[i];
        if( $(document).scrollTop() >= $(elm).offset().top ){
            currentPos = i;
        }
        
    }
}
    // document.addEventListener("touchmove", scrollUp, true);
    // document.addEventListener("scroll", scrollDown, true);
//     document.addEventListener('touchmove', function(e) {e.preventDefault();}, true);
//     document.addEventListener('scroll', function(e) {e.preventDefault();}, true);
//     $(document).bind('DOMMouseScroll', { passive: false }, function(e){
 
//         if(e.originalEvent.detail > 0) {
//             scrollDown();
//         }else {
//             scrollUp();   
//         }
//         return false;
//     });

//     $(document).bind('mousewheel', { passive: false }, function(e){
//         e.preventDefault();
//         if(e.originalEvent.wheelDelta < 0) {
//             scrollDown();
//         }else {
//             scrollUp();     
//         }
//         return false;
//     });
// };
    
// function scrollUp(){
//     if(!scrolling && currentPos > 0 ){
//         scrolling = true;
//         currentPos --;
//         let scrollToElement = $('.page')[currentPos];
//         $('html, body').animate({
//             scrollTop: $(scrollToElement).offset().top
//         }, 400, function(){
//             scrolling = false;
//         });      
//     }
// };   

// function scrollDown(){   
//     if(!scrolling && currentPos < $('.page').length-1  ){
//         scrolling = true;
//         currentPos ++;
//         let scrollToElement = $('.page')[currentPos];
//         $('html, body').animate({
//             scrollTop: $(scrollToElement).offset().top
//         }, 400,function(){
//             scrolling = false;
//         }); 
//     }
// };    


// let slideIndex = 1;
// showSlides(slideIndex);

// // Next/previous controls
// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }

// // Thumbnail image controls
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

// function showSlides(n) {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   if (n > slides.length) {slideIndex = 1}
//   if (n < 1) {slideIndex = slides.length}
//   for (i = 0; i < slides.length; i++) {
//       slides[i].style.display = "none";
//   }

//   slides[slideIndex-1].style.display = "block";

// }

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




