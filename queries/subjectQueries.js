const pool = require('../config/db');

const findAllByTutor = (tutorId) =>
  pool.query('SELECT * FROM subjects WHERE tutor_id = $1 ORDER BY name', [tutorId]);

const create = (tutorId, name) =>
  pool.query('INSERT INTO subjects (tutor_id, name) VALUES ($1,$2) RETURNING *', [tutorId, name]);

const update = (id, tutorId, name) =>
  pool.query('UPDATE subjects SET name=$1 WHERE id=$2 AND tutor_id=$3 RETURNING *', [name, id, tutorId]);

const remove = (id, tutorId) =>
  pool.query('DELETE FROM subjects WHERE id=$1 AND tutor_id=$2', [id, tutorId]);

module.exports = { findAllByTutor, create, update, remove };
