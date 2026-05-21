const { isEmail, isPhone } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateRegister({ first_name, email, password, phone }) {
  if (!first_name || !email || !password) return MSG.REQUIRED.AUTH_FIELDS;
  if (!isEmail(email))                    return MSG.INVALID.EMAIL;
  if (password.length < 6)               return MSG.INVALID.PASSWORD_LENGTH;
  if (phone && !isPhone(phone))           return MSG.INVALID.PHONE;
  return null;
}

function validateLogin({ email, password }) {
  if (!email || !password) return MSG.REQUIRED.EMAIL_AND_PASSWORD;
  if (!isEmail(email))     return MSG.INVALID.EMAIL;
  return null;
}

module.exports = { validateRegister, validateLogin };
