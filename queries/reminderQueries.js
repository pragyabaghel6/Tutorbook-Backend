const pool = require('../config/db');

const findConnectionData = (tutor_student_id, tutorId) =>
  pool.query(
    `SELECT s.first_name AS student_name, p.contact_no AS parent_phone,
            ts.monthly_fee, sub.name AS subject_name, t.first_name AS tutor_name
     FROM tutor_students ts
     JOIN students s ON s.id = ts.student_id
     JOIN subjects sub ON sub.id = ts.subject_id
     JOIN tutors t ON t.id = ts.tutor_id
     LEFT JOIN parents p ON p.student_id = s.id
     WHERE ts.id = $1 AND ts.tutor_id = $2`,
    [tutor_student_id, tutorId]
  );

const create = ({ tutor_student_id, reminder_type, message, status }) =>
  pool.query(
    `INSERT INTO whatsapp_reminders (tutor_student_id, reminder_type, message, sent_at, status)
     VALUES ($1,$2,$3,NOW(),$4)`,
    [tutor_student_id, reminder_type, message, status]
  );

const findByTutor = (tutorId) =>
  pool.query(
    `SELECT wr.*, s.first_name, s.last_name
     FROM whatsapp_reminders wr
     JOIN tutor_students ts ON ts.id = wr.tutor_student_id
     JOIN students s ON s.id = ts.student_id
     WHERE ts.tutor_id = $1
     ORDER BY wr.sent_at DESC`,
    [tutorId]
  );

module.exports = { findConnectionData, create, findByTutor };
