const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tutorRepo = require('../queries/tutorQueries');

const SALT_ROUNDS = 10;

const signToken = (tutor_id, email) =>
  jwt.sign({ tutor_id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async ({ first_name, last_name, email, password, phone }) => {
  const exists = await tutorRepo.findByEmail(email);
  if (exists.rows.length) throw { status: 409, message: 'Email already registered' };

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await tutorRepo.create({ first_name, last_name, email, password_hash, phone });
  const tutor = rows[0];
  return { token: signToken(tutor.id, tutor.email), tutor };
};

const login = async ({ email, password }) => {
  const { rows } = await tutorRepo.findByEmail(email);
  if (!rows.length) throw { status: 401, message: 'Invalid credentials' };

  const tutor = rows[0];
  const valid = await bcrypt.compare(password, tutor.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const { password_hash, ...safe } = tutor;
  return { token: signToken(tutor.id, tutor.email), tutor: safe };
};

module.exports = { register, login };
