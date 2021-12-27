function displayPoster(){
  $("#satisfiedtable").html('');
  let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));

  if (posterToEdit === null) {
    // console.log(posterToEdit)
    let origin = window.location.origin;
    window.location.href = origin;
    $("#addbasket_button").hide();
    $("#cancel_button").hide();
  }else{
    $("#satisfieddiv").show();
    let k = 0;
    for (let i = 0; i <= 3; i++) {
      $("#satisfiedtable").append(`<tr id=${`satisfiedRow`+i}></tr>`);
      for (let j = k; j <= k + 2; j++) {
        $(`#${`satisfiedRow`+i}`).append(`<td id= ${`satisfied`+ (j + 1)}></td>`);
        $(`#${`satisfied`+ (j + 1)}`).append(`<img src="${posterToEdit.paths[j]}">`);
      }   
      k = k + 3;
    }  
  }
};


function editPoster(){
$("#satisfiedtable").html('');
};

function addtobasket(){
  let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));
  let posters = [];
  if(sessionStorage.getItem("posters") != null){
    posters = JSON.parse(sessionStorage.posters);
  }
  posters.push(posterToEdit);
  sessionStorage.setItem("posters", JSON.stringify(posters));
  sessionStorage.removeItem('posterToEdit');
  
};