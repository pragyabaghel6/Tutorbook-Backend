const subjectRepo = require('../queries/subjectQueries');
const { validateCreate } = require('../validations/subjectValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const { rows } = await subjectRepo.findAllByTutor(req.tutor.id);
    res.json({ subjects: rows });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const create = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { rows } = await subjectRepo.create(req.tutor.id, req.body.name);
    res.status(201).json({ subject: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const update = async (req, res) => {
  try {
    const { rows } = await subjectRepo.update(req.params.id, req.tutor.id, req.body.name);
    if (!rows.length) return res.status(404).json({ error: MSG.NOT_FOUND.SUBJECT });
    res.json({ subject: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const remove = async (req, res) => {
  try {
    await subjectRepo.remove(req.params.id, req.tutor.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, create, update, remove };
