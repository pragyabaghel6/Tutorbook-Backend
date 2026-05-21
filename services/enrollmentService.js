const enrollmentRepo = require('../queries/enrollmentQueries');

const FREE_PLAN_LIMIT = 15;

const getAll = async (tutorId) => {
  const { rows } = await enrollmentRepo.findAllByTutor(tutorId);
  return rows;
};

const checkPlanLimit = async (tutorId, plan) => {
  if (plan === 'pro') return;
  const { rows } = await enrollmentRepo.countActive(tutorId);
  if (parseInt(rows[0].count) >= FREE_PLAN_LIMIT) {
    throw { status: 403, message: 'Free plan limit reached. Upgrade to Pro for unlimited enrollments.', upgrade_required: true };
  }
};

const create = async (tutorId, body) => {
  const { rows } = await enrollmentRepo.create(tutorId, body);
  return rows[0];
};

const update = async (id, tutorId, body) => {
  const { rows } = await enrollmentRepo.update(id, tutorId, body);
  if (!rows.length) throw { status: 404, message: 'Enrollment not found' };
  return rows[0];
};

const remove = async (id, tutorId) => {
  await enrollmentRepo.softDelete(id, tutorId);
};

module.exports = { getAll, checkPlanLimit, create, update, remove };
