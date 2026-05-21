const pool = require('../config/db');

const findByTutor = (tutorId, filters = {}) => {
  let query = `
    SELECT f.*, s.first_name, s.last_name, sub.name AS subject_name
    FROM fees f
    JOIN tutor_students ts ON ts.id = f.tutor_student_id
    JOIN students s ON s.id = ts.student_id
    JOIN subjects sub ON sub.id = ts.subject_id
    WHERE ts.tutor_id = $1`;
  const params = [tutorId];

  if (filters.month) {
    params.push(filters.month);
    query += ` AND f.month = $${params.length}`;
  }
  if (filters.status) {
    params.push(filters.status);
    query += ` AND f.status = $${params.length}`;
  }
  query += ' ORDER BY f.month DESC, s.first_name';
  return pool.query(query, params);
};

const create = ({ tutor_student_id, amount, month, due_date }) =>
  pool.query(
    `INSERT INTO fees (tutor_student_id, amount, month, due_date)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [tutor_student_id, amount, month, due_date]
  );

const update = (id, { status, paid_date, payment_method, note, amount }) =>
  pool.query(
    `UPDATE fees SET status=$1, paid_date=$2, payment_method=$3, note=$4,
     amount=COALESCE($5, amount) WHERE id=$6 RETURNING *`,
    [status, paid_date, payment_method, note, amount, id]
  );

const getUnpaidSummary = (tutorId, month) =>
  pool.query(
    `SELECT COUNT(*) AS count, COALESCE(SUM(f.amount), 0) AS total
     FROM fees f
     JOIN tutor_students ts ON ts.id = f.tutor_student_id
     WHERE ts.tutor_id = $1 AND f.month = $2 AND f.status != 'paid'`,
    [tutorId, month]
  );

module.exports = { findByTutor, create, update, getUnpaidSummary };
