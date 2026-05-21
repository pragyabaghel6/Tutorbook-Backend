const dashboardService = require('../services/dashboardService');

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummary(req.tutor);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getSummary };
