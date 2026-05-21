const router = require('express').Router();
const scheduleController = require('../controllers/scheduleController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',       scheduleController.getAll);
router.post('/',      scheduleController.create);
router.put('/:id',    scheduleController.update);
router.delete('/:id', scheduleController.remove);

module.exports = router;
