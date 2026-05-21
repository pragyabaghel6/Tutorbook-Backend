const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const verifyJWT = require('../middleware/auth');

router.use(verifyJWT);

router.post('/create-order', paymentController.createOrder);
router.post('/verify',       paymentController.verify);

module.exports = router;
