const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'Grdonj24',
  host: 'localhost',
  port: 5433, // 5432 zauzet
  database: 'lineups_db' 
});

module.exports=pool;