const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/summary', dashboardController.getSummary);

module.exports = router;
