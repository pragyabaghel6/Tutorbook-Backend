const router = require('express').Router();
const studentController = require('../controllers/studentController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',    studentController.getAll);
router.post('/',   studentController.create);
router.get('/:id', studentController.getOne);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.remove);

module.exports = router;
