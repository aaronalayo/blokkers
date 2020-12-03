// document.getElementById("satisfieddiv").innerHTML=sessionStorage.getItem("page1content");
// console.log(sessionStorage.getItem("page1content"));

$(document).ready(function(){
   
  $.get("/satisfied", details => {
    $('#satisfieddiv').html(details)
    console.log(details)
  }).fail(function (error) {
      console.log(error)
  })
})