require('dotenv').config();
const env = process.env.NODE_ENV;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const DB_POOL = { min: 2, max: 50, acquireTimeoutMillis: 60 * 1000 ,createTimeoutMillis: 3000, idleTimeoutMillis : 60000,
  // reapIntervalMillis: 1000,createRetryIntervalMillis: 100,propagateCreateError: true
};

const KnexHms = require("knex")({
  client: (process.env.OS_VALUE && process.env.OS_VALUE === 'windows') ? "mysql2" : "mysql",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: process.env.DB_NAME,
    // socketPath: '/tmp/mysql.sock',
  },
  pool: DB_POOL,
});

module.exports = { KnexHms };
