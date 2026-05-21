require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const pool = new Pool({
    user:     process.env.DB_USER,
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port:     process.env.DB_PORT,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  try {
    console.log('Connecting to Neon.tech...');
    await pool.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Schema error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
