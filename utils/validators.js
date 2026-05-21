const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;           // Indian 10-digit mobile
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM
const TIME_RE  = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM

const VALID_DAYS           = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const VALID_REMINDER_TYPES = ['fee_reminder', 'attendance_reminder', 'general'];

const isEmail         = (v) => EMAIL_RE.test(String(v).trim());
const isPhone         = (v) => PHONE_RE.test(String(v).trim());
const isMonth         = (v) => MONTH_RE.test(String(v).trim());
const isTime          = (v) => TIME_RE.test(String(v).trim());
const isDay           = (v) => VALID_DAYS.includes(v);
const isReminderType  = (v) => VALID_REMINDER_TYPES.includes(v);
const isPositiveInt   = (v) => Number.isInteger(Number(v)) && Number(v) > 0;
const isPositiveNum   = (v) => !isNaN(Number(v)) && Number(v) > 0;

module.exports = {
  isEmail, isPhone, isMonth, isTime, isDay, isReminderType,
  isPositiveInt, isPositiveNum,
  VALID_DAYS, VALID_REMINDER_TYPES,
};
