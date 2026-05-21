const pool = require('../config/db');

const findByTutor = (tutorId, filters = {}) => {
  let query = `
    SELECT a.*, s.first_name, s.last_name, sub.name AS subject_name
    FROM attendance a
    JOIN tutor_students ts ON ts.id = a.tutor_student_id
    JOIN students s ON s.id = ts.student_id
    JOIN subjects sub ON sub.id = ts.subject_id
    WHERE ts.tutor_id = $1`;
  const params = [tutorId];

  if (filters.date) {
    params.push(filters.date);
    query += ` AND a.date = $${params.length}`;
  }
  if (filters.tutor_student_id) {
    params.push(filters.tutor_student_id);
    query += ` AND a.tutor_student_id = $${params.length}`;
  }
  query += ' ORDER BY a.date DESC';
  return pool.query(query, params);
};

const upsert = ({ tutor_student_id, date, status }) =>
  pool.query(
    `INSERT INTO attendance (tutor_student_id, date, status)
     VALUES ($1,$2,$3)
     ON CONFLICT (tutor_student_id, date) DO UPDATE SET status = EXCLUDED.status
     RETURNING *`,
    [tutor_student_id, date, status]
  );

const update = (id, status) =>
  pool.query('UPDATE attendance SET status=$1 WHERE id=$2 RETURNING *', [status, id]);

module.exports = { findByTutor, upsert, update };
