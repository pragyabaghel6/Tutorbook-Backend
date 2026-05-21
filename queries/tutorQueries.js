const pool = require('../config/db');

const findByEmail = (email) =>
  pool.query('SELECT * FROM tutors WHERE email = $1', [email]);

const findById = (id) =>
  pool.query(
    'SELECT id, first_name, last_name, email, phone, plan FROM tutors WHERE id = $1 AND is_active = true',
    [id]
  );

const create = ({ first_name, last_name, email, password_hash, phone }) =>
  pool.query(
    `INSERT INTO tutors (first_name, last_name, email, password_hash, phone)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, first_name, last_name, email, phone, plan`,
    [first_name, last_name, email, password_hash, phone]
  );

const updatePlan = (id, plan) =>
  pool.query('UPDATE tutors SET plan=$1 WHERE id=$2', [plan, id]);

module.exports = { findByEmail, findById, create, updatePlan };
