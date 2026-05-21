const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',    attendanceController.getAll);
router.post('/',   attendanceController.mark);
router.put('/:id', attendanceController.update);

module.exports = router;
