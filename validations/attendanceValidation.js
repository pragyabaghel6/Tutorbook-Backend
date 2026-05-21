const MSG = require('../constants/messages');

function validateMark({ tutor_student_id, date, status }) {
  if (!tutor_student_id || !date || !status) return MSG.REQUIRED.ATTENDANCE_FIELDS;
  return null;
}

module.exports = { validateMark };
