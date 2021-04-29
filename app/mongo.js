const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');


module.exports = store = new MongoDBStore({
    uri: `${process.env.DB_HOST}${process.env.DB}`,
    collection: "posters",
    touchAfter: 24 * 3600, // time period in seconds
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    }
  });
  

  module.exports = async function main() {

  try {
 
      const mongoDbUrl = process.env.DB_HOST;
      // mongoCon();
      // Use new url parser and unified topology to fix deprecation warning
      MongoDBStore = mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(async function() {
          console.log(`Successfully connected to MongoDB database at ${mongoDbUrl}!`);
      }).catch(function(error) {
          console.log(`Error whilst connecting to MongoDB database at ${mongoDbUrl}! ${error}`);
      });
      mongoose.set('useCreateIndex', true); // Fixes deprecation warning
      // mongoose.Collection('posters');
  } catch (err) {
      console.log(`Error whilst doing database setup! ${err}`);
  }
  try {
    // app.use(cookieParser());
    // app.use(session({
    //   saveUninitialized: false, // don't create session until something stored
    //   resave: false, //don't save session if unmodified
    //   store: store,
    //   secret: process.env.SESSION_SECRET,
    //   saveUninitialized: true,
    //   unset: 'destroy',
    //   name: 'blokkers',
    //   domain: ".blokkers.dk",
    //   SameSite: 'none',
    //   cookie: {
    //       maxAge: 1000 * 60 * 60 * 24 * 15, // 2 week
    //       httpOnly: false,
    //       secure: false // TODO: Update this on production     
    //      }
    // }));
    
    //   console.log("Sessions successfully initialized!");
  } catch (err) {
      console.log(`Error setting up a mongo session store! ${err}`);
  }
}
 
