const router = require('express').Router();;


const fs = require('fs');
const { dirname } = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);


const navbar = fs.readFileSync("./public/navbar.html", "utf8");
const footer = fs.readFileSync("./public/footer.html", "utf8");
const createposterPage = fs.readFileSync("./public/createposter.html", "utf8");


function letters(name) {
  const l =  name.split('');
  var file = fs.readdirSync("./public/alfabet");
    for (var i = 0; i <= 11; i++) {
        file.forEach((letter) => {
            if(l[i] == letter){
                console.log(file[i])
            }
            

})}
};
    



// router.post('/create', async(req, res) =>{
//  let img = [];
//   img = req.body.img;
//  console.log(img[0]);
  
// });

// let img = [];

// router.post('/satisfied', async(req, res)=>{

//   let img = req.body.imgSrc;
//   console.log(img)
//   let pathImage = [];
// try{


//     for(var i= 0; i<= img.length; i++){
//       pathImage = img[i].substring(0,img.length-23);
//       console.log(pathImage);
//   }
//   images/alfabet/f/f1.png
// }catch(error){
// console.log(error)
// }

// });
 












module.exports= router;