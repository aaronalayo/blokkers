'--unhandled-rejections=strict'
const { knexSnakeCaseMappers} = require('objection');

const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  
  development: {
    client: 'pg',

    connection: {
      user:process.env.PGUSER,
      host: process.env.PGHOST,
      database:process.env.PGDATABASE,
      password:process.env.PGPASSWORD,
      port:process.env.PGPORT,
      ssl: process.env.PGSSLMODE,
      ssl: {
        rejectUnauthorized: false
      },
      // ssl: {
      //   ca: fs.readFileSync(__dirname + "/server-ca.pem"),
      //   cert: fs.readFileSync(__dirname + '/client-cert.pem'),
      //   key: fs.readFileSync(__dirname + '/client-key.pem')
      // }
      // }
    },
    ...knexSnakeCaseMappers()
  }

};
