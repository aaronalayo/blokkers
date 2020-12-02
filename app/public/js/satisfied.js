// document.getElementById("satisfieddiv").innerHTML=sessionStorage.getItem("page1content");
// console.log(sessionStorage.getItem("page1content"));

$(document).ready(function(){
   
      $.getJSON("createposter.js", function(result){
        $.each(result, function(i, field){
          $("div").append(field + " ");
        });
      });
    });
