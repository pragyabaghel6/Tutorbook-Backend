const pool = require('../config/db');

const findAllByTutor = (tutorId) =>
  pool.query(
    `SELECT sch.*, ts.monthly_fee, s.first_name, s.last_name, sub.name AS subject_name
     FROM schedules sch
     JOIN tutor_students ts ON ts.id = sch.tutor_student_id
     JOIN students s ON s.id = ts.student_id
     JOIN subjects sub ON sub.id = ts.subject_id
     WHERE ts.tutor_id = $1 AND ts.is_active = true
     ORDER BY sch.day, sch.time`,
    [tutorId]
  );

const create = ({ tutor_student_id, day, time }) =>
  pool.query(
    'INSERT INTO schedules (tutor_student_id, day, time) VALUES ($1,$2,$3) RETURNING *',
    [tutor_student_id, day, time]
  );

const update = (id, tutorId, { day, time }) =>
  pool.query(
    `UPDATE schedules SET day=$1, time=$2
     WHERE id=$3
       AND tutor_student_id IN (SELECT id FROM tutor_students WHERE tutor_id=$4)
     RETURNING *`,
    [day, time, id, tutorId]
  );

const remove = (id) =>
  pool.query('DELETE FROM schedules WHERE id=$1', [id]);

module.exports = { findAllByTutor, create, update, remove };
