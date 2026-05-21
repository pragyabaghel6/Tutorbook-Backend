const scheduleRepo = require('../queries/scheduleQueries');
const feeRepo = require('../queries/feeQueries');
const enrollmentRepo = require('../queries/enrollmentQueries');
const studentRepo = require('../queries/studentQueries');

const getSummary = async (tutor) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);
  const dayName = new Date().toLocaleDateString('en-IN', { weekday: 'short' });

  const [scheduleResult, unpaidResult, studentResult, enrollmentResult] = await Promise.all([
    scheduleRepo.findAllByTutor(tutor.id).then(r =>
      r.rows.filter(s => s.day === dayName)
    ),
    feeRepo.getUnpaidSummary(tutor.id, currentMonth),
    studentRepo.findAllByTutor(tutor.id),
    enrollmentRepo.countActive(tutor.id),
  ]);

  return {
    today_classes:      scheduleResult,
    unpaid_fees: {
      count: parseInt(unpaidResult.rows[0].count),
      total: parseFloat(unpaidResult.rows[0].total),
    },
    total_students:     studentResult.rows.length,
    total_enrollments:  parseInt(enrollmentResult.rows[0].count),
    plan:              tutor.plan,
  };
};

module.exports = { getSummary };
