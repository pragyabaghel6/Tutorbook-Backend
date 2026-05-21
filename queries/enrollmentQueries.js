const pool = require('../config/db');

const findAllByTutor = (tutorId) =>
  pool.query(
    `SELECT ts.*, s.first_name, s.last_name, s.contact_no, s.class,
            sub.name AS subject_name
     FROM tutor_students ts
     JOIN students s ON s.id = ts.student_id
     JOIN subjects sub ON sub.id = ts.subject_id
     WHERE ts.tutor_id = $1 AND ts.is_active = true
     ORDER BY s.first_name`,
    [tutorId]
  );

const countActive = (tutorId) =>
  pool.query(
    'SELECT COUNT(*) FROM tutor_students WHERE tutor_id = $1 AND is_active = true',
    [tutorId]
  );

const create = (tutorId, { student_id, subject_id, monthly_fee, start_date }) =>
  pool.query(
    `INSERT INTO tutor_students (tutor_id, student_id, subject_id, monthly_fee, start_date)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [tutorId, student_id, subject_id, monthly_fee, start_date || new Date()]
  );

const update = (id, tutorId, { monthly_fee, subject_id }) =>
  pool.query(
    `UPDATE tutor_students SET monthly_fee=$1, subject_id=$2
     WHERE id=$3 AND tutor_id=$4 RETURNING *`,
    [monthly_fee, subject_id, id, tutorId]
  );

const softDelete = (id, tutorId) =>
  pool.query(
    'UPDATE tutor_students SET is_active=false WHERE id=$1 AND tutor_id=$2',
    [id, tutorId]
  );

module.exports = { findAllByTutor, countActive, create, update, softDelete };
