const router = require('express').Router();
const enrollmentController = require('../controllers/enrollmentController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',       enrollmentController.getAll);
router.post('/',      enrollmentController.create);
router.put('/:id',    enrollmentController.update);
router.delete('/:id', enrollmentController.remove);

module.exports = router;
