


function displayPoster(){
  $("#satisfiedtable").html('');
  let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));

  if (posterToEdit === null) {
    // console.log(posterToEdit)
    window.location.href = "http://localhost:8080/";
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
    
      // $("#addbasket_button").show(2000);
      // $("#cancel_button").show();

   
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
  // addToCart();
};



function addToCart(){
  let posters = JSON.parse(sessionStorage.getItem('posters'));
  
  $.ajax({
    global: false,
    type: 'POST',
    url: '/updatecart',
    data: {
      posters:posters
    },
    ContentType: 'application/json',
    dataType: "json",
  }).done(function (data) {
    console.log('success', data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    var contentType = jqXHR.getResponseHeader("Content-Type");
    if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
      window.location.href = "/";
      console.log('FAILED! ERROR: ' + errorThrown);
    }
  });
};

