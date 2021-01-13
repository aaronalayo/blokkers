function myFunction() {
   let x = document.getElementById("menu");
   if (x.style.display === "block") {
      $("#menu").slideUp(800);
   } else {
      $("#menu").slideDown(800);
   } 
};

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') {
      // close modal here
      closeNav();
   }
});

function openNav() {
   document.getElementById("mySidenav").style.width = "250px";
};

function closeNav() {
   document.getElementById("mySidenav").style.width = "0";
};