const scheduleRepo = require('../queries/scheduleQueries');
const { validateCreate, validateUpdate } = require('../validations/scheduleValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const { rows } = await scheduleRepo.findAllByTutor(req.tutor.id);
    res.json({ schedules: rows });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const create = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { rows } = await scheduleRepo.create(req.body);
    res.status(201).json({ schedule: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const update = async (req, res) => {
  const error = validateUpdate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { rows } = await scheduleRepo.update(req.params.id, req.tutor.id, req.body);
    if (!rows.length) return res.status(404).json({ error: MSG.NOT_FOUND.SCHEDULE });
    res.json({ schedule: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const remove = async (req, res) => {
  try {
    await scheduleRepo.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, create, update, remove };
