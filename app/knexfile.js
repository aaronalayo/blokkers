'--unhandled-rejections=strict'
const { knexSnakeCaseMappers} = require('objection');


const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.PGUSER)
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
      }
    },
    ...knexSnakeCaseMappers()
  }

};
