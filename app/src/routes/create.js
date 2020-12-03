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
    



router.get('/satisfied', async(req, res) =>{
 let img = [];
  img = req.body.img;
  console.log(img)
  return res.status(200).json(img); 
});















module.exports= router;