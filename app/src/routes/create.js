const route = require('express').Router();
const fs = require('fs');
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
    

// route.get("/create", (req, res) => {
//     return res.render(navbar + createposterPage + footer, );
//   });
route.post('/create', async(req, res) =>{
 const name = req.body.name;
 letters(name);
//  res.render('user', { name: 'Tobi' }, function (err, html)
//  var page = await readFile('./public/createposter.html', 'utf8');
//  page = page.replace(/{letter1}/g, name[0]);
//  page = page.replace(/{letter11}/g, name[0].toUpperCase());
});















module.exports= route;