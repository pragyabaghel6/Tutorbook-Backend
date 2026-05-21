const router = require('express').Router();
const feeController = require('../controllers/feeController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.get('/',    feeController.getAll);
router.post('/',   feeController.create);
router.put('/:id', feeController.update);

module.exports = router;
