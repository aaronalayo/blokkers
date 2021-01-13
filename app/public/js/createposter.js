function changeSizeRight(){
    if($("#a3").is(':checked')){
        $("#a2").prop("checked", true);
    }
    else if($("#a2").is(':checked')){
        $("#a1").prop("checked", true);
    }
};

function changeSizeLeft(){
    if($("#a1").is(':checked')){
        $("#a2").prop("checked", true);
    }
    else if($("#a2").is(':checked')){
        $("#a3").prop("checked", true);
    }
};

function addLetter(id){
   let letter = $(id).text();
   $("#name").val($("#name").val() + letter);
};

function validateForm() {
  let name = document.getElementById('name').value
  if (name == ""){
    alert("Please enter a name");
  } else if(name.length >13){
    alert("Name must be between 1 and 12 characters!");
    $("#name").val("");
    $('#tableposter').html(''); //clear the table
    $('#posterfooter').html('');
    addCircles()
  } else {
    addCircles(), getName()
  }
};

function addCircles(){
  $(".circle").each(function() {
    $(this).removeClass("circle");
  });
  const name = $("#name").val();
  let id;
  for (let i = 0; i < name.length; i++) {
      id = name.charAt(i).toLowerCase();
      $("#" + id).addClass("circle");
  }
};

function createTable(){
  let k = 0;
  for(let i=0; i<=3; i++){
    $('#tableposter').append('<tr>');
    for(let j = k; j<= k + 2; j++){
      $('#tableposter').append(`<td id=${j+1} onclick=showColor(this.id) >`);
      console.log((j+1));
    }
    k=k+3;
  }
}
function getName() {
    let name = $("#name").val().toLowerCase();
    const letters = name.split('');
    while (name.length < 13) {
      for(let i =0; i <= letters.length-1; i++){
        name += letters[i];   
      } 
    }
   
  $('#posterfooter').html('');
  $('#tableposter').html(''); //clear the table
  $('#colourtable').html(''); //clear the table
  $('choosecolor').html('');
  createTable();
  let k = 0;
  for(let i=0; i<=3; i++){
    for(let j=k; j<=k + 2; j++){ //fill the table
      switch(name[j]) {
          case 'å':
            $("#" + (j+1)).append(`<img  src="/images/alfabet/aa/aa1.png">`);
            break;
          case 'æ':
            $("#" + (j+1)).append(`<img  src="/images/alfabet/ae/ae1.png">`);
            break;
          case 'ø':
            $("#" + (j+1)).append(`<img  src="/images/alfabet/oe/oe1.png">`);
            break;
          case '-':
            $("#" + (j+1)).append(`<img  src="/images/alfabet/-/-1.png">`);
            break;
          default:
            $("#" + (j+1)).append(`<img  src="/images/alfabet/${name[j]}/${name[j]}1.png">`);
            console.log((j+1));
        }
    }
    k = k+3;
  }
  $('#posterfooter').text("Click on the letters to change the colors");
    
}
function showColor(id){
  $('#colourtable').html('');
  $('#choosecolor').html('');
  $('#chooseletter').html('');
    let src = document.getElementById(id).childNodes[0].src;
    let parts = src.split('/');
    let lastSegment = parts.pop();

    console.log(parts[parts.length - 1]);
    
    for(let i = 0; i<= 3; i++){
      switch(parts[parts.length - 1]){
        case 'å':
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/aa${i+1}.png" >` + '</td>');    
            break;
        case 'æ':
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/ae${i+1}.png">` + '</td>');
            break;
        case 'ø':
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/oe${i+1}.png">` + '</td>');
            break;
        case '-':
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/-${i+1}.png">` + '</td>');
            break;
        default:
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/${(parts[parts.length - 1])}${i+1}.png">` + '</td>');
      }
    }
    $('#choosecolor').text("Choose your color");
    $('#chooseletter').text("Click on the letters to change the colors");
    $("#done_button").show();
}

function changeColor(id){
  let parts = id.split('-');
  let lastSegment = parts.pop();
  $("#" + lastSegment).empty();
  let src = document.getElementById(id).childNodes[0].src;
  $("#" + lastSegment).append(`<img  src=${src}>`);
};

function onPressBackspace() { 
  let name  = document.getElementById('name').value;
  document.getElementById('name').value=name.substring(0,name.length -1);
};

function getSrc(){
  imgs = document.getElementById('tableposter').getElementsByTagName("img");
  let imgSrcs = [];
  for (var i = 0; i < imgs.length; i++) {
      imgSrcs.push(imgs[i].src);
  }
  let pname = $("#name").val().toLowerCase();
  let size = $("input[name='size']:checked").val();
  sessionStorage.setItem("imgs", JSON.stringify(imgSrcs));
  sessionStorage.setItem("size", JSON.stringify(size.toUpperCase()));
  sessionStorage.setItem("pname", JSON.stringify(pname));
};
