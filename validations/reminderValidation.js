const { isPositiveInt, isReminderType } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateSend({ tutor_student_id, reminder_type }) {
  if (!tutor_student_id || !reminder_type) return MSG.REQUIRED.REMINDER_FIELDS;
  if (!isPositiveInt(tutor_student_id))    return MSG.INVALID.TUTOR_STUDENT_ID;
  if (!isReminderType(reminder_type))      return MSG.INVALID.REMINDER_TYPE;
  return null;
}

module.exports = { validateSend };
