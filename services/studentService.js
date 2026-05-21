const pool = require('../config/db');
const studentRepo = require('../queries/studentQueries');

const getAll = async (tutorId) => {
  const { rows } = await studentRepo.findAllByTutor(tutorId);
  return rows;
};

const getById = async (id) => {
  const { rows } = await studentRepo.findById(id);
  if (!rows.length) throw { status: 404, message: 'Student not found' };
  return rows[0];
};

const create = async (body) => {
  const { first_name, last_name, email, contact_no, age, class: studentClass,
          father_full_name, mother_name, parent_contact, parent_alt_contact, parent_email } = body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await studentRepo.create(client, { first_name, last_name, email, contact_no, age, studentClass });
    const student = rows[0];
    if (father_full_name || mother_name || parent_contact) {
      await studentRepo.createParent(client, student.id, { father_full_name, mother_name, parent_contact, parent_alt_contact, parent_email });
    }

    await client.query('COMMIT');
    return student;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const update = async (id, body) => {
  const { first_name, last_name, email, contact_no, age, class: studentClass } = body;
  const { rows } = await studentRepo.update(id, { first_name, last_name, email, contact_no, age, studentClass });
  if (!rows.length) throw { status: 404, message: 'Student not found' };
  return rows[0];
};

const remove = async (id) => {
  await studentRepo.softDelete(id);
};

module.exports = { getAll, getById, create, update, remove };
