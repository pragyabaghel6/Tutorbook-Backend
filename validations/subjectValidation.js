const MSG = require('../constants/messages');

function validateCreate({ name }) {
  if (!name) return MSG.REQUIRED.SUBJECT_NAME;
  return null;
}

module.exports = { validateCreate };
