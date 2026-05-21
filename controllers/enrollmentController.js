const enrollmentService = require('../services/enrollmentService');
const { validateCreate } = require('../validations/enrollmentValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getAll(req.tutor.id);
    res.json({ enrollments });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const create = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    await enrollmentService.checkPlanLimit(req.tutor.id, req.tutor.plan);
    const enrollment = await enrollmentService.create(req.tutor.id, req.body);
    res.status(201).json({ enrollment });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: MSG.CONFLICT.ENROLLMENT_DUPLICATE });
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR, upgrade_required: err.upgrade_required });
  }
};

const update = async (req, res) => {
  try {
    const enrollment = await enrollmentService.update(req.params.id, req.tutor.id, req.body);
    res.json({ enrollment });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const remove = async (req, res) => {
  try {
    await enrollmentService.remove(req.params.id, req.tutor.id);
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, create, update, remove };
