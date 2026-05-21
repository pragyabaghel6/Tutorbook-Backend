const pool = require('../config/db');

const findAllByTutor = (tutorId) =>
  pool.query(
    `SELECT s.*, p.father_full_name, p.mother_name, p.contact_no AS parent_contact
     FROM students s
     JOIN tutor_students ts ON ts.student_id = s.id
     LEFT JOIN parents p ON p.student_id = s.id
     WHERE ts.tutor_id = $1 AND ts.is_active = true AND s.is_active = true
     ORDER BY s.first_name`,
    [tutorId]
  );

const findById = (id) =>
  pool.query(
    `SELECT s.*, p.father_full_name, p.mother_name, p.contact_no AS parent_contact,
            p.alternate_contact_no, p.email AS parent_email
     FROM students s
     LEFT JOIN parents p ON p.student_id = s.id
     WHERE s.id = $1`,
    [id]
  );

const create = (client, { first_name, last_name, email, contact_no, age, studentClass }) =>
  client.query(
    `INSERT INTO students (first_name, last_name, email, contact_no, age, class)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [first_name, last_name, email, contact_no, age, studentClass]
  );

const createParent = (client, studentId, { father_full_name, mother_name, parent_contact, parent_alt_contact, parent_email }) =>
  client.query(
    `INSERT INTO parents (student_id, father_full_name, mother_name, contact_no, alternate_contact_no, email)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [studentId, father_full_name, mother_name, parent_contact, parent_alt_contact, parent_email]
  );

const update = (id, { first_name, last_name, email, contact_no, age, studentClass }) =>
  pool.query(
    `UPDATE students SET first_name=$1, last_name=$2, email=$3, contact_no=$4, age=$5, class=$6
     WHERE id=$7 RETURNING *`,
    [first_name, last_name, email, contact_no, age, studentClass, id]
  );

const softDelete = (id) =>
  pool.query('UPDATE students SET is_active=false WHERE id=$1', [id]);

module.exports = { findAllByTutor, findById, create, createParent, update, softDelete };
