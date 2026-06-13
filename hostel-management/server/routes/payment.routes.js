const router = require('express').Router();
const { createOrder, verifyPayment } = require('../controllers/payment.controller');
const protect = require('../middleware/auth.middleware');
const { tenantOnly } = require('../middleware/role.middleware');

router.use(protect, tenantOnly);

// Step 1: Tenant requests a Razorpay order before opening checkout modal
router.post('/create-order', createOrder);

// Step 2: After payment, Razorpay returns tokens — verify signature and mark rent paid
router.post('/verify', verifyPayment);

module.exports = router;
