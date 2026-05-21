const feeRepo = require('../queries/feeQueries');
const { validateCreate } = require('../validations/feeValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const { rows } = await feeRepo.findByTutor(req.tutor.id, req.query);
    res.json({ fees: rows });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const create = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { rows } = await feeRepo.create(req.body);
    res.status(201).json({ fee: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: MSG.CONFLICT.FEE_DUPLICATE });
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

const update = async (req, res) => {
  try {
    const { rows } = await feeRepo.update(req.params.id, req.body);
    if (!rows.length) return res.status(404).json({ error: MSG.NOT_FOUND.FEE });
    res.json({ fee: rows[0] });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, create, update };
