
$(document).ready(function () {

  let id = document.getElementById('a2')
  getSizeDetails(id);
  loadPosterEdit();
});

//gets the formats with their prices and returns them as Promise
function getFormats() {
  const fetchJson = async url => {
    const response = await fetch(url)
    return response.json()
  }
  return new Promise(function (resolve) {
    const formats = fetchJson('/formats');
    setTimeout(function () {
      resolve(formats)
    }, 50);
  });
};
async function getSizeDetails(id) {
  let price = 0;
  let dimension;
  if (id) {


    let size = $(id).val().toUpperCase();
    await getFormats().then(data => {
      for (let [key] of Object.entries(data.formats)) {
        if (size === data.formats[key].format_no) {
          price = data.formats[key].price;
          dimension = data.formats[key].dimension;
        }
      }
      $("#dimension").text(dimension);
      $("#dimensionprise").text(price + " DKK");
    });
  };
};
//changes the size to the one the right
function changeSizeRight() {
  if ($("#a3").is(':checked')) {
    $("#a2").prop("checked", true);
  }
  else if ($("#a2").is(':checked')) {
    $("#a1").prop("checked", true);
  }
};

//changes the size to the one on the left
function changeSizeLeft() {
  if ($("#a1").is(':checked')) {
    $("#a2").prop("checked", true);
  }
  else if ($("#a2").is(':checked')) {
    $("#a3").prop("checked", true);
  }
};

//appends a letter to the name 
function addLetter(id) {
  let letter = $(id).text();
  $("#name").val($("#name").val() + letter);
};

//validates if the name is less than 12 characters
function validateForm() {
  $('#colourtable').html('');
  $('#chooseletter').html('');
  $('#choosecolor').html('');
  // $("#posterdiv").hide();
  $("#colourtable").hide();
  $("#done_button").hide();
  const nameFilter = /^[a-zA-Z \-\_\/!0-9æøåÆØÅ\.,!?():+\[\]\n\t\r]*$/;
  let name = document.getElementById('name').value
  if (name == "") {
    alert("Please enter letters");
  } else if (nameFilter.test(String(name).toLowerCase()) == false) {
    alert("Invalid letters!");

  } else if (name.length > 13) {
    alert("Your letters must have between 1 and 12 characters!");
    $("#name").val("");
    $('#tableposter').html(''); //clear the table
    $('#posterfooter').html('');
    addCircles()
  } else {
    addCircles(), getName()
  }
};
$(function () {
  $('#name').keypress(function (event) {
    event.preventDefault();
    return false;
  });
});
//adds a circle around each letter present in the name
function addCircles() {
  $(".circle").each(function () {
    $(this).removeClass("circle");
  });
  const name = $("#name").val();
  let id;
  for (let i = 0; i < name.length; i++) {
    id = name.charAt(i).toLowerCase();
    $("#" + id).addClass("circle");
  }
};

//creates an empty table with 3 columns and 4 rows
function createTable() {
  let k = 0;
  for (let i = 0; i <= 3; i++) {
    $('#tableposter').append('<tr>');
    for (let j = k; j <= k + 2; j++) {
      $('#tableposter').append(`<td id=${j + 1} onclick=showColor(this.id) >`);
    }
    $('#tableposter').append('</tr>');
    k = k + 3;
  }
};


//displays a poster with the name
function getName() {
  // $("#posterdiv").show();
  let name = $("#name").val().toLowerCase();
  const letters = name.split('');
  while (name.length < 13) {
    for (let i = 0; i <= letters.length - 1; i++) {
      name += letters[i];
    }
  }

  //clears the tables
  // $('#posterfooter').html('');
  $('#tableposter').html('');
  $('#colourtable').html('');
  // $('#choosecolor').html('');
  // $('#chooseletter').html('');

  //creates a new table and fills it with the new name letters
  createTable();
  let k = 0;
  for (let i = 0; i <= 3; i++) {

    for (let j = k; j <= k + 2; j++) {
      switch (name[j]) {
        case 'å':
          $("#" + (j + 1)).append(`<img  src="/images/alfabet/aa/aa1.png">`);
          break;
        case 'æ':
          $("#" + (j + 1)).append(`<img  src="/images/alfabet/ae/ae1.png">`);
          break;
        case 'ø':
          $("#" + (j + 1)).append(`<img  src="/images/alfabet/oe/oe1.png">`);
          break;
        case '-':
          $("#" + (j + 1)).append(`<img  src="/images/alfabet/-/-1.png">`);
          break;
        default:
          $("#" + (j + 1)).append(`<img  src="/images/alfabet/${name[j]}/${name[j]}1.png">`);
      }
    }
    k = k + 3;
  }
  $('#tableposter').append('<tfoot id="posterfooter">');
  $('#posterfooter').text("Click on a letter to change the color");
};


//displays the different letter design
function showColor(id) {
  $("#colourtable").show();
  $('#colourtable').html('');
  // $('#choosecolor').html('');
  // $('#chooseletter').html('');
  let src = document.getElementById(id).childNodes[0].src;
  let parts = src.split('/');
  let lastSegment = parts.pop();

  $('#colourtable').append('<caption id="choosecolor"></caption>');
  for (let i = 0; i < 2; i++) {
    $('#colourtable').append('<tr>');
    for (let j = 0; j < 4; j++) {
      let key = (j+1)+(i*4);
      switch (parts[parts.length - 1]) {
        case 'å':
          $('#colourtable').append(`<td id=img${key}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/aa${key}.png" >` + '</td>');
          break;
        case 'æ':
          $('#colourtable').append(`<td id=img${key}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/ae${key}.png">` + '</td>');
          break;
        case 'ø':
          $('#colourtable').append(`<td id=img${key}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/oe${key}.png">` + '</td>');
          break;
        case '-':
          $('#colourtable').append(`<td id=img${key}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/-${key}.png">` + '</td>');
          break;
        default:
          $('#colourtable').append(`<td id=img${key}-${id} onclick=changeColor(this.id)>` + `<img  src="/images/alfabet/${parts[parts.length - 1]}/${(parts[parts.length - 1])}${key}.png">` + '</td>');     
      }
      
    }

    $('#colourtable').append('</tr>');
    
  }
  
  $('#colourtable').append('<caption style="caption-side:bottom" id="chooseletter"></caption>')
  $('#choosecolor').text("Choose your color");
  $('#chooseletter').text("Click on the letter to change the color");
  $("#done_button").show();
};


//changes the letter colour on the poster
function changeColor(id) {
  let parts = id.split('-');
  let lastSegment = parts.pop();
  $("#" + lastSegment).empty();
  let src = document.getElementById(id).childNodes[0].src;
  $("#" + lastSegment).append(`<img  src=${src}>`);
};

function onPressBackspace() {
  let name = document.getElementById('name').value;
  document.getElementById('name').value = name.substring(0, name.length - 1);
};

//stores the poster name, size and letter paths to sessionStorage
function getSrc() {
  imgs = document.getElementById('tableposter').getElementsByTagName("img");
  let imgSrcs = [];
  let origin = window.location.origin;
  for (var i = 0; i < imgs.length; i++) {
  
    imgSrcs.push(imgs[i].src.substr(origin.length));
  }
  const paths =[];


  for (const key in imgSrcs) {
    
    paths.push(imgSrcs[key]);
  }
  let pname = $("#name").val().toLowerCase();
  let size = $("input[name='size']:checked").val();
  let posterToEdit = {
    "pname": pname,
    "paths": paths,
    "size": size.toUpperCase(),
    "quantity": 1,
    "price": 0   
};
if(sessionStorage.getItem("posterToEdit") != null){
  sessionStorage.removeItem('posterToEdit');
  sessionStorage.setItem('posterToEdit', JSON.stringify(posterToEdit));
}else{
  sessionStorage.setItem('posterToEdit', JSON.stringify(posterToEdit));
}

};

$(function() {
  $('a[href*=\\#]:not([href=\\#])').on('click', function() {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.substr(1) +']');
      
      if (target.length) {
          $('html,body').animate({
              scrollTop: target.position().top
          }, 400);
          console.log(target.position().top)
          return false;
      }
  });
});

function loadPosterEdit() {
  console.log('Loading poster first time');

  $('#tableposter').html('');
  createTable();
    let posterToEdit = JSON.parse(sessionStorage.getItem("posterToEdit"));
    // console.log(posterToEdit)
    if (posterToEdit) {
      $('#name').val(posterToEdit.pname.toUpperCase());
      let k = 0;
      
      for (let i = 0; i <= 3; i++) {
       
        for (let j = k; j <= k + 2; j++) {
          $("#tableposter").append(`<td id=${j + 1} >`);
          $("#" + (j + 1)).append(`<img src="${posterToEdit.paths[j]}">`);
        }

        k = k + 3;
      }
 
      $('#tableposter').append('<tfoot id="posterfooter">');
      $('#posterfooter').text("Click on a letter to change the color");

    }
  };