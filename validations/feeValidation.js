const { isPositiveInt, isPositiveNum, isMonth } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateCreate({ tutor_student_id, amount, month }) {
  if (!tutor_student_id || !amount || !month) return MSG.REQUIRED.FEE_FIELDS;
  if (!isPositiveInt(tutor_student_id))        return MSG.INVALID.TUTOR_STUDENT_ID;
  if (!isPositiveNum(amount))                  return MSG.INVALID.AMOUNT;
  if (!isMonth(month))                         return MSG.INVALID.MONTH;
  return null;
}

module.exports = { validateCreate };
