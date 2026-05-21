const router = require('express').Router();
const subjectController = require('../controllers/subjectController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',    subjectController.getAll);
router.post('/',   subjectController.create);
router.put('/:id', subjectController.update);
router.delete('/:id', subjectController.remove);

module.exports = router;
