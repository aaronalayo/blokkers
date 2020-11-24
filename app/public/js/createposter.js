
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
      $('#tableposter').append(`<td id=${j+1}>`);
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
              $("#" + (j+1)).append(`<img  src="/images/Alfabet/${name[j]}/AA1.jpg">`);
            break;
          case 'æ':
            $("#" + (j+1)).append(`<img  src="/images/Alfabet/${name[j]}/AE1.jpg">`);
              //$('#tableposter').append(`<td id=img${j}>` + `<img  src="/images/Alfabet/${name[j]}/AE1.jpg">` + '</td>');
            break;
            case 'ø':
              $("#" + (j+1)).append(`<img  src="/images/Alfabet/${name[j]}/OE1.jpg">`);
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
<<<<<<< HEAD
    $('#tableposter').html(''); //clear the table
                 $('#tableposter').append('<tr>');
                    
                    for(var i=0; i<=2; i++){ //fill the table
                        switch(name[i]) {
                            case 'å':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AA1.jpg">` + '</td>');
                              break;
                            case 'æ':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AE1.jpg">` + '</td>');
                              break;
                              case 'ø':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/OE1.jpg">` + '</td>');
                              break;
                            default:
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/${name[i].toUpperCase()}1.jpg">` + '</td>');
                          }
                    }
                $('#tableposter').append('</tr>');      
                $('#tableposter').append('<tr>');
                    for(var i=3; i<=5; i++){ //fill the table
                        switch(name[i]) {
                            case 'å':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AA1.jpg">` + '</td>');
                              break;
                            case 'æ':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AE1.jpg">` + '</td>');
                              break;
                              case 'ø':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/OE1.jpg">` + '</td>');
                              break;
                            default:
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/${name[i].toUpperCase()}1.jpg">` + '</td>');
                          } 
                    }
                $('#tableposter').append('</tr>');      
              
                $('#tableposter').append('<tr>');
                    for(var i=6; i<=8; i++){ //fill the table
                        switch(name[i]) {
                            case 'å':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AA1.jpg">` + '</td>');
                              break;
                            case 'æ':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AE1.jpg">` + '</td>');
                              break;
                              case 'ø':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/OE1.jpg">` + '</td>');
                              break;
                            default:
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/${name[i].toUpperCase()}1.jpg">` + '</td>');
                          }
                
                    }
                $('#tableposter').append('</tr>');    
                $('#tableposter').append('<tr>');
                    for(var i=9; i<=11; i++){ //fill the table

                        switch(name[i]) {
                            case 'å':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AA1.jpg">` + '</td>');
                              break;
                            case 'æ':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/AE1.jpg">` + '</td>');
                              break;
                              case 'ø':
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/OE1.jpg">` + '</td>');
                              break;
                            default:
                                $('#tableposter').append(`<td id=img${i}>` + `<img  src="/images/Alfabet/${name[i]}/${name[i].toUpperCase()}1.jpg">` + '</td>');
                          }
                    }
                $('#tableposter').append('</tr>');     
           
            }
=======


>>>>>>> 4e1e0230c5b256d9ac904e668df7801191352317
