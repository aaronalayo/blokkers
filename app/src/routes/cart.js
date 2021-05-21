
const session = require("express-session");
const route = require("express").Router();

const cookieParser = require("cookie-parser");
route.use(cookieParser());
const home = "/";
const basket = "/basket";

// const db = require("../model/Mongo");
const dotenv = require("dotenv");
dotenv.config();




// const Posters = db.posters;

// db.mongoose
//   .connect(`${process.env.DB_HOST}/${process.env.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");

//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });


// route.post('/setcart', async (req, res) => {
//     const posters = req.body.posters;

//     try {
//         if(!req.session.cart) {
//             req.session.cart = {
//                 posters: posters,
//             };
            
//         } 
        
        // posters.forEach(async poster => {
        //   const foundPoster = Posters.findOne({id:poster.id})
        //      let cart = new Posters({
        //        id : poster.id,
        //        paths: poster.paths,
        //        pname: poster.pname,
        //        price: poster.price,
        //        quantity: poster.quantity,
        //        size : poster.size
        //       });

        //    await cart.save(cart, function (err, doc) {
        //      if (err) return console.error(err);
        //      console.log("Document inserted successfully!");
        //    });
        //   });
         
        
    // } catch (error) {
    //     res.status(400).send('Bad request');
    // }

    // });

route.post("/setcart", async (req, res) => {
    // console.log("setting cart")
    const posters = req.body.posters;
    
    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 15, // would expire after 2 weeks
      httpOnly: true, // The cookie only accessible by the web server
      signed: false, // Indicates if the cookie should be signed
      secret: process.env.SESSION_SECRET,
      secure: false, // TODO: Update this on production
      

  }

 //  posters.forEach(async poster => {
 //   let cart = new Cart({
 //     id : poster.id,
 //     paths: poster.paths,
 //     pname: poster.pname,
 //     price: poster.price,
 //     quantity: poster.quantity,
 //     size : poster.size
 //   });

   // await cart.save(cart,function(err, doc) {
   //   if (err) return console.error(err);
   //   console.log("Document inserted successfully!");
   // });

 // })

  // Set cookie
  res.cookie('cart', posters, options) // options is optional
  res.redirect(basket);
  });

  route.post("/updatecart", async (req, res) => {
   const posters = req.body.posters;
   // console.log(posters);
   let options = {
     maxAge: 1000 * 60 * 60 * 24 * 15, // would expire after 2 weeks
     httpOnly: true, // The cookie only accessible by the web server
     signed: false, // Indicates if the cookie should be signed
     secret: process.env.SESSION_SECRET,
     secure: false, // TODO: Update this on production

 }

 // posters.forEach(async poster => {

 // let updatedCart = {
 //    id: poster.id,
 //    paths: poster.paths,
 //    pname: poster.pname,
 //    price: poster.price,
 //    quantity: poster.quantity,
 //    size: poster.size
 //  };

 //  let cart = mongoose.model('Cart', 'posters');
 //  await cart.updateOne(updatedCart, function(err, doc) {
 //   if (err) return console.error(err);
 //   console.log("Document updated successfully!");
 // });

 // })

 // Set cookie
 res.cookie('cart', posters, options) // options is optional
 res.redirect(basket);
 });
 route.post("/deletecart", async (req, res) => {
    // let cart = req.cookies.cart;
    res.clearCookie('cart', { path: '/' }).redirect(basket);
  

 });

module.exports = route;
