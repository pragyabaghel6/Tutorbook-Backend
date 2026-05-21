const attendanceRepo = require('../queries/attendanceQueries');
const { validateMark } = require('../validations/attendanceValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const { rows } = await attendanceRepo.findByTutor(req.tutor.id, req.query);
    res.json({ attendance: rows });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const mark = async (req, res) => {
  const error = validateMark(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { rows } = await attendanceRepo.upsert(req.body);
    res.status(201).json({ attendance: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const update = async (req, res) => {
  try {
    const { rows } = await attendanceRepo.update(req.params.id, req.body.status);
    if (!rows.length) return res.status(404).json({ error: MSG.NOT_FOUND.RECORD });
    res.json({ attendance: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, mark, update };
