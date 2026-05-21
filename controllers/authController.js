const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validations/authValidation');
const MSG = require('../constants/messages');

const register = async (req, res) => {
  const error = validateRegister(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const login = async (req, res) => {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const me = (req, res) => {
  res.json({ tutor: req.tutor });
};

module.exports = { register, login, me };
