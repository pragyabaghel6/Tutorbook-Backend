const { isPositiveInt, isDay, isTime } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateCreate({ tutor_student_id, day, time }) {
  if (!tutor_student_id || !day || !time) return MSG.REQUIRED.SCHEDULE_FIELDS;
  if (!isPositiveInt(tutor_student_id))   return MSG.INVALID.TUTOR_STUDENT_ID;
  if (!isDay(day))                        return MSG.INVALID.DAY;
  if (!isTime(time))                      return MSG.INVALID.TIME;
  return null;
}

function validateUpdate({ day, time }) {
  if (!day || !time) return MSG.REQUIRED.DAY_AND_TIME;
  if (!isDay(day))   return MSG.INVALID.DAY;
  if (!isTime(time)) return MSG.INVALID.TIME;
  return null;
}

module.exports = { validateCreate, validateUpdate };
