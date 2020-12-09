$(document).ready(function () {
  imgs = JSON.parse(sessionStorage.getItem("imgs"));
  size = JSON.parse(sessionStorage.getItem('size'));
  name = JSON.parse(sessionStorage.getItem('name'));
  var k = 0;
  for (var i = 0; i <= 3; i++) {
    $("#satisfiedtable").append("<tr>");
    for (var j = k; j <= k + 2; j++) {
      $("#satisfiedtable").append(`<td id=${j + 1} >`);

      $("#" + (j + 1)).append(`<img  src="${imgs[j]}">`);

      console.log(j + 1);
    }
    $("#satisfiedtable").append("<tr>");
    k = k + 3;
  }
  $("#addbasket_button").show();
  $("#cancel_button").show();
});

function addtobasket(){

  // console.log(size)

  imgs = document.getElementById('satisfiedtable').getElementsByTagName("img");
  var imgSrcs = [];

  for (var i = 0; i < imgs.length; i++) {
      imgSrcs.push(imgs[i].src);
  }
  const paths =[];
    for (const key in imgSrcs) {
    
    paths.push(imgSrcs[key].slice(21,47));
    
  }


  
  // $.post('/createorder', {'name':name,'paths': paths, 'size': size});
  $.ajax({
    url: '/createorder',
    type: 'POST',
    ContentType: 'application/json',
    dataType: "json",
    data:
      {'name':name,'paths': paths, 'size': size},
  }).done(function(response){
    console.log('success');
  }).fail(function(jqXHR, textStatus, errorThrown){
    console.log('FAILED! ERROR: ' + errorThrown);
  });
};