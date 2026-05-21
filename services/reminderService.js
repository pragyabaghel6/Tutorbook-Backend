const reminderRepo = require('../queries/reminderQueries');
const { sendWhatsApp } = require('../utils/whatsapp');

const buildMessage = (type, data) => {
  const month = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  switch (type) {
    case 'fee_reminder':
      return `Hi, ${data.student_name}'s ${data.subject_name} fee of ₹${data.monthly_fee} is due for ${month}. Please pay at your earliest. — ${data.tutor_name}`;
    case 'attendance_reminder':
      return `Hi, ${data.student_name} was absent today for ${data.subject_name} class. Please ensure regular attendance. — ${data.tutor_name}`;
    case 'general':
      return `Hi, this is a message from ${data.tutor_name} regarding ${data.student_name}'s ${data.subject_name} tuition.`;
    default:
      throw { status: 400, message: 'Invalid reminder_type' };
  }
};

const send = async (tutor_student_id, reminder_type, tutorId) => {
  const { rows } = await reminderRepo.findConnectionData(tutor_student_id, tutorId);
  if (!rows.length) throw { status: 404, message: 'Enrollment not found' };

  const data = rows[0];
  if (!data.parent_phone) throw { status: 400, message: 'No parent phone number on file' };

  const message = buildMessage(reminder_type, data);
  const result = await sendWhatsApp(data.parent_phone, message);

  await reminderRepo.create({
    tutor_student_id,
    reminder_type,
    message,
    status: result.success ? 'sent' : 'failed',
  });

  return { success: result.success, sent_at: new Date() };
};

const getHistory = async (tutorId) => {
  const { rows } = await reminderRepo.findByTutor(tutorId);
  return rows;
};

module.exports = { send, getHistory };
