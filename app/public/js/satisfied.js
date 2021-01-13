$(document).ready(function () {
  imgs = JSON.parse(sessionStorage.getItem("imgs"));
  size = JSON.parse(sessionStorage.getItem('size'));
  pname = JSON.parse(sessionStorage.getItem('pname'));
  let k = 0;
  for (let i = 0; i <= 3; i++) {
    $("#satisfiedtable").append("<tr>");
    for (let j = k; j <= k + 2; j++) {
      $("#satisfiedtable").append(`<td id=${j + 1} >`);
      $("#" + (j + 1)).append(`<img src="${imgs[j]}">`);
      console.log(j + 1);
    }
    $("#satisfiedtable").append("<tr>");
    k = k + 3;
  }
  $("#addbasket_button").show();
  $("#cancel_button").show();
});

function addtobasket(){
  imgs = document.getElementById('satisfiedtable').getElementsByTagName("img");
  var imgSrcs = [];

  for (var i = 0; i < imgs.length; i++) {
    imgSrcs.push(imgs[i].src);
  }
  const paths =[];

  for (const key in imgSrcs) {
    paths.push(imgSrcs[key].slice(21,47));
  }

  let poster = {
      "pname": pname,
      "paths": paths,
      "size": size,
      "quantity": 1,
      "price": 0   
  };
  console.log(poster);
  let posters = [];
  if(sessionStorage.getItem("posters") != null){
    console.log(true);
    posters = JSON.parse(sessionStorage.posters);
  }
  posters.push(poster);
  sessionStorage.setItem("posters", JSON.stringify(posters));
  console.log(sessionStorage.getItem("posters"));
};
