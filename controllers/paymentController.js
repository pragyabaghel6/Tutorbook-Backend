const crypto = require('crypto');
const tutorRepo = require('../queries/tutorQueries');
const { getRazorpay } = require('../utils/razorpay');
const MSG = require('../constants/messages');

const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: 14900,
      currency: 'INR',
      receipt: `tutorbook_${req.tutor.id}_${Date.now()}`,
    });
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: MSG.PAYMENT.ORDER_FAILED });
  }
};

const verify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: MSG.PAYMENT.VERIFY_FAILED });
    }

    await tutorRepo.updatePlan(req.tutor.id, 'pro');
    res.json({ success: true, plan: 'pro' });
  } catch (err) {
    res.status(500).json({ error: MSG.SERVER_ERROR });
  }
};

module.exports = { createOrder, verify };
