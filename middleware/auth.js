const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function verifyJWT(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, email, phone, plan FROM tutors WHERE id = $1 AND is_active = true',
      [payload.tutor_id]
    );
    if (!rows.length) return res.status(401).json({ error: 'Tutor not found' });
    req.tutor = rows[0];
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = verifyJWT;
