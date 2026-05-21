const { isPositiveInt, isPositiveNum } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateCreate({ student_id, subject_id, monthly_fee }) {
  if (!student_id || !subject_id || !monthly_fee) return MSG.REQUIRED.ENROLLMENT_FIELDS;
  if (!isPositiveInt(student_id))                 return MSG.INVALID.STUDENT_ID;
  if (!isPositiveInt(subject_id))                 return MSG.INVALID.SUBJECT_ID;
  if (!isPositiveNum(monthly_fee))                return MSG.INVALID.MONTHLY_FEE;
  return null;
}

module.exports = { validateCreate };
