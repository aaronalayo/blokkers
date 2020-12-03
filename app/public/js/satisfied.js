$(document).ready(function(){

  img = JSON.parse(sessionStorage.getItem("img"));
  $('#satisfieddiv').html(img);
  console.log(img);
})