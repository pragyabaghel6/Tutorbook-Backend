const { isEmail, isPhone } = require('../utils/validators');
const MSG = require('../constants/messages');

function validateCreate({ first_name, email, contact_no, parent_contact }) {
  if (!first_name)                          return MSG.REQUIRED.STUDENT_NAME;
  if (email && !isEmail(email))             return MSG.INVALID.EMAIL;
  if (contact_no && !isPhone(contact_no))   return MSG.INVALID.CONTACT_NO;
  if (parent_contact && !isPhone(parent_contact)) return MSG.INVALID.PARENT_CONTACT;
  return null;
}

module.exports = { validateCreate };
