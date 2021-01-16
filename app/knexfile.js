'--unhandled-rejections=strict'
const { knexSnakeCaseMappers} = require('objection');



const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();



module.exports = {
  development: {
    client: "pg",

    connection: {
      user: process.env.PGUSER,
      host: process.env.PGHOST || process.env.CLOUD_SQL_CONNECTION_NAME,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      timezone: 'utc+1',
      ssl: process.env.PGSSLMODE,
      ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync("../app/certificates/server-ca.pem", "utf8"),
        key: fs.readFileSync("../app/certificates/client-key.pem", "utf8"),
        cert: fs.readFileSync("../app/certificates/client-cert.pem", "utf8"),
      },
    },
  },
  ...knexSnakeCaseMappers(),
};

