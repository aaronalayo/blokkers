
  function changeSizeRight(){
    if($("#a3").is(':checked')){
        $("#a2").prop("checked", true);
    }
    else if($("#a2").is(':checked')){
        $("#a1").prop("checked", true);
    }
}
function changeSizeLeft(){
    if($("#a1").is(':checked')){
        $("#a2").prop("checked", true);
    }
    else if($("#a2").is(':checked')){
        $("#a3").prop("checked", true);
    }
}

function addLetter(id){
   var letter = $(id).text();
   $("#name").val($("#name").val() + letter);
//    $(id).addClass("circle");
}

function addCircles(){
    var elements = document.getElementsByClassName("circle");
    console.log(elements);
    for(var i = 0; i <elements.length; i++){
        $(elements[i]).removeClass("circle");
        console.log(elements[i]);
    }
    const name = $("#name").val();
    var id;
    for (var i = 0; i < name.length; i++) {
        id = name.charAt(i).toLowerCase();
       // console.log(id);
        $("#" + id).addClass("circle");
    }
}

    // function sendName() {
    //     const name = $("#name").val().toLowerCase();
    //       $.post("/create", { name: name });


    //     }

//     function putImage() {
//         $.get( "http://localhost:2000/create", function( data ) {
//             // $( "img1" ).html( data );
//             console.log(data)
// });
//     }

function createTable(){
  var k = 0;
  for(var i=0; i<=3; i++){
    $('#tableposter').append('<tr>');
    for(var j = k; j<= k + 2; j++){
      $('#tableposter').append(`<td id=${j+1} onclick=showColor(this.id)>`);
      console.log((j+1));
    }
    $('#tableposter').append('<tr>');
    k=k+3;
  }
}
function getName() {
    let name = $("#name").val().toLowerCase();
    const letters = name.split('');
    while(name.length < 13){
        for(var i =0; i <= letters.length-1; i++){
            name += letters[i];   
      }  
  }
  $('#tableposter').html(''); //clear the table
  createTable();
  var k = 0;
  for(var i=0; i<=3; i++){
    $('#tableposter').append('<tr>');
    for(var j=k; j<=k + 2; j++){ //fill the table
      switch(name[j]) {
          case 'å':
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/AA1.jpg">` + '</td>');
              $("#" + (j+1)).append(`<img  src="/images/Alfabet/aa/AA1.jpg">`);
            break;
          case 'æ':
            $("#" + (j+1)).append(`<img  src="/images/Alfabet/ae/AE1.jpg">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/AE1.jpg">` + '</td>');
            break;
            case 'ø':
              $("#" + (j+1)).append(`<img  src="/images/Alfabet/oe/OE1.jpg">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/OE1.jpg">` + '</td>');
            break;
          default:
            $("#" + (j+1)).append(`<img  src="/images/Alfabet/${name[j]}/${name[j].toUpperCase()}1.jpg">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/${name[j].toUpperCase()}1.jpg">` + '</td>');
              console.log((j+1));
        }
        
    }
    $('#tableposter').append('<tr>');
    k = k+3;
  }
}

function showColor(id){
  $('#colourtable').html('');
    var src = document.getElementById(id).childNodes[0].src;
    var parts = src.split('/');
    var lastSegment = parts.pop();

    console.log(parts[parts.length - 1]);
    for(var i = 0; i<= 2; i++){
      switch(parts[parts.length - 1]){
        case 'å':
              $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/Alfabet/${parts[parts.length - 1]}/AA${i+1}.jpg" >` + '</td>');    
            break;
          case 'æ':
              $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/Alfabet/${parts[parts.length - 1]}/AE${i+1}.jpg">` + '</td>');
            break;
            case 'ø':
              $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/Alfabet/${parts[parts.length - 1]}/OE${i+1}.jpg">` + '</td>');
            break;
          default:
            $('#colourtable').append(`<td id=img${i}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/Alfabet/${parts[parts.length - 1]}/${(parts[parts.length - 1].toUpperCase())}${i+1}.jpg">` + '</td>');
      }
    }
}

function changeColor(id){
  var parts = id.split('-');
  var lastSegment = parts.pop();
  $("#" + lastSegment).empty();
  var src = document.getElementById(id).childNodes[0].src;
  $("#" + lastSegment).append(`<img  src=${src}>`);
}
