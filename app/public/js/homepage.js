let scrolling = false;
let currentPos = 0;


$(document).ready(function() {
    for(let i = 0; i < $('.page').length; i++){
        let elm = $('.page')[i];
        if( $(document).scrollTop() >= $(elm).offset().top ){
            currentPos = i;
        }
        
    }
    // document.addEventListener("touchmove", scrollUp, true);
    // document.addEventListener("scroll", scrollDown, true);
    document.addEventListener('touchmove', function(e) {e.preventDefault();}, true);
    document.addEventListener('scroll', function(e) {e.preventDefault();}, true);
    $(document).bind('DOMMouseScroll', { passive: false }, function(e){
 
        if(e.originalEvent.detail > 0) {
            scrollDown();
        }else {
            scrollUp();   
        }
        return false;
    });

    $(document).bind('mousewheel', { passive: false }, function(e){
        e.preventDefault();
        if(e.originalEvent.wheelDelta < 0) {
            scrollDown();
        }else {
            scrollUp();     
        }
        return false;
    });
});
    
function scrollUp(){
    if(!scrolling && currentPos > 0 ){
        scrolling = true;
        currentPos --;
        let scrollToElement = $('.page')[currentPos];
        $('html, body').animate({
            scrollTop: $(scrollToElement).offset().top
        }, 400, function(){
            scrolling = false;
        });      
    }
};   

function scrollDown(){   
    if(!scrolling && currentPos < $('.page').length-1  ){
        scrolling = true;
        currentPos ++;
        let scrollToElement = $('.page')[currentPos];
        $('html, body').animate({
            scrollTop: $(scrollToElement).offset().top
        }, 400,function(){
            scrolling = false;
        }); 
    }
};    

let slideIndex = 1;
showSlides(slideIndex);
    
function plusSlides(n) {
    

    showSlides(slideIndex += n);
};
    
function currentSlide(n) {

    showSlides(slideIndex = n);
};
    
function showSlides(n) {
    let i;
  
    let slides = document.getElementsByClassName("mySlides");

        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
 
        slides[slideIndex-1].style.display = "block";     
     

      
    setTimeout(showSlides, 2000); 

}

fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
