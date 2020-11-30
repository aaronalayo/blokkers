
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

function validateForm() {
  var empt = document.getElementById('name').value
  if (empt == ""){
  alert("Please enter a name");

} else {
  addCircles(), getName()
}
}

function addCircles(){
  $(".circle").each(function() {
    $(this).removeClass("circle");
  });
  const name = $("#name").val();
  
  var id;
  for (var i = 0; i < name.length; i++) {
      id = name.charAt(i).toLowerCase();
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
  $('#posterfooter').html('');

  $('#tableposter').html(''); //clear the table
  $('#colourtable').html(''); //clear the table
  $('choosecolor').html('');
  createTable();
  var k = 0;
  for(var i=0; i<=3; i++){
    $('#tableposter').append('<tr>');
    for(var j=k; j<=k + 2; j++){ //fill the table
      switch(name[j]) {
          case 'å':
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/AA1.jpg">` + '</td>');
              $("#" + (j+1)).append(`<img  src="/images/alfabet/aa/aa1.png">`);
            break;
          case 'æ':
            $("#" + (j+1)).append(`<img  src="/images/alfabet/ae/ae1.png">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/AE1.jpg">` + '</td>');
            break;
            case 'ø':
              $("#" + (j+1)).append(`<img  src="/images/alfabet/oe/oe1.png">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/OE1.jpg">` + '</td>');
            break;
            case '-':
              $("#" + (j+1)).append(`<img  src="/images/alfabet/-/-1.png">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/OE1.jpg">` + '</td>');
            break;
          default:
            $("#" + (j+1)).append(`<img  src="/images/alfabet/${name[j]}/${name[j]}1.png">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/${name[j].toUpperCase()}1.jpg">` + '</td>');
              console.log((j+1));
        }
        
    }
    $('#tableposter').append('<tr>');
    k = k+3;
  }
  $('#posterfooter').append(`<p>Click on the letters to change the colors</p>`);
}

function showColor(id){
  $('#colourtable').html('');
  $('#choosecolor').html('');
  $('#chooseletter').html('');
    var src = document.getElementById(id).childNodes[0].src;
    var parts = src.split('/');
    var lastSegment = parts.pop();

    console.log(parts[parts.length - 1]);
    
 
    for(var i = 0; i<= 3; i++){
 
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
     $('#choosecolor').append(`<p>Choose your color</p>`);

    
    $('#chooseletter').append(`<p>Click on the letters to change the colors</p>`);
    $('#done_button').append(`<button class="mbtn blue" type="submit" value="submit"  id="done_button">Done</button>`)
}

function changeColor(id){
  
  var parts = id.split('-');
  var lastSegment = parts.pop();
  $("#" + lastSegment).empty();
  var src = document.getElementById(id).childNodes[0].src;
 
  $("#" + lastSegment).append(`<img  src=${src}>`);
};
function onPressBackspace() {
  
  var name  = document.getElementById('name').value;
  document.getElementById('name').value=name.substring(0,name.length -1);
};
