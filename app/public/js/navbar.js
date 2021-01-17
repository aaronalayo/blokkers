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