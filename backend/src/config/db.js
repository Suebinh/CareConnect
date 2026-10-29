const { Pool } = require('pg');

// Single shared connection pool. Swap this file if the team picks a
// different SQL engine (e.g. mysql2) — nothing outside src/config/db.js
// should know which driver is in use.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
