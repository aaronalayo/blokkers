$(document).ready(function () {
  $("#satisfiedtable").html('');
  let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));
  if (posterToEdit) {
    let k = 0;
    for (let i = 0; i <= 3; i++) {
      $("#satisfiedtable").append("<tr>");
      for (let j = k; j <= k + 2; j++) {
        $("#satisfiedtable").append(`<td id=${j + 1} >`);
        $("#" + (j + 1)).append(`<img src="${posterToEdit.paths[j]}">`);
      }
      $("#satisfiedtable").append("</tr>");
      k = k + 3;
    }

  }
  $("#addbasket_button").show();
  $("#cancel_button").show();

});

function editPoster(){
$("#satisfiedtable").html('');

};

function addtobasket(){
  
  // imgs = document.getElementById('satisfiedtable').getElementsByTagName("img");
  // var imgSrcs = [];
  // let origin = window.location.origin;
  // for (var i = 0; i < imgs.length; i++) {
  
  //   imgSrcs.push(imgs[i].src.substr(origin.length));
  // }
  // const paths =[];


  // for (const key in imgSrcs) {
    
  //   paths.push(imgSrcs[key]);
  // }

  // let poster = {
  //     "pname": pname,
  //     "paths": paths,
  //     "size": size,
  //     "quantity": 1,
  //     "price": 0   
  // };
  let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));
  let posters = [];
  if(sessionStorage.getItem("posters") != null){
    posters = JSON.parse(sessionStorage.posters);
  }
  posters.push(posterToEdit);
  sessionStorage.setItem("posters", JSON.stringify(posters));
  sessionStorage.removeItem('posterToEdit');
};



