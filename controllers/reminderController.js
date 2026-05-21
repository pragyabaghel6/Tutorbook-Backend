const reminderService = require('../services/reminderService');
const { validateSend } = require('../validations/reminderValidation');
const MSG = require('../constants/messages');

const send = async (req, res) => {
  const error = validateSend(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const result = await reminderService.send(req.body.tutor_student_id, req.body.reminder_type, req.tutor.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || MSG.SERVER_ERROR });
  }
};

const getHistory = async (req, res) => {
  try {
    const reminders = await reminderService.getHistory(req.tutor.id);
    res.json({ reminders });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { send, getHistory };
