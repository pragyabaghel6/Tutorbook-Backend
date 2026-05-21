const studentService = require('../services/studentService');
const { validateCreate } = require('../validations/studentValidation');
const MSG = require('../constants/messages');

const getAll = async (req, res) => {
  try {
    const students = await studentService.getAll(req.tutor.id);
    res.json({ students });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const getOne = async (req, res) => {
  try {
    const student = await studentService.getById(req.params.id);
    res.json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const create = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const student = await studentService.create(req.body);
    res.status(201).json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const update = async (req, res) => {
  try {
    const student = await studentService.update(req.params.id, req.body);
    res.json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const remove = async (req, res) => {
  try {
    await studentService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

module.exports = { getAll, getOne, create, update, remove };
