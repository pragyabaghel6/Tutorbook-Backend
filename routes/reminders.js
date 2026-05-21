const router = require('express').Router();
const reminderController = require('../controllers/reminderController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.post('/send', reminderController.send);
router.get('/',      reminderController.getHistory);

module.exports = router;
