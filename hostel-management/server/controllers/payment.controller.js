const Razorpay = require('razorpay');
const crypto = require('crypto');
const RentRecord = require('../models/RentRecord');
const Tenant = require('../models/Tenant');

// Initialize Razorpay instance with keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Tenant calls this to get a Razorpay order_id before opening the checkout modal
const createOrder = async (req, res, next) => {
  try {
    const { rentRecordId } = req.body;
    if (!rentRecordId) return res.status(400).json({ message: 'rentRecordId is required' });

    // Verify the rent record belongs to this tenant and is unpaid
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    const record = await RentRecord.findOne({ _id: rentRecordId, tenant: tenant._id });
    if (!record) return res.status(404).json({ message: 'Rent record not found' });
    if (record.status === 'paid') return res.status(400).json({ message: 'This rent record is already paid' });

    // Create Razorpay order (amount must be in paise — multiply ₹ by 100)
    const order = await razorpay.orders.create({
      amount: record.amount * 100,
      currency: 'INR',
      receipt: `rent_${rentRecordId}`,
      notes: {
        rentRecordId: rentRecordId.toString(),
        tenantId: tenant._id.toString(),
      },
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // sent to frontend to open modal
    });
  } catch (err) { next(err); }
};

// POST /api/payment/verify
// Called after tenant completes payment in the Razorpay modal
// Verifies signature to confirm payment is genuine, then marks rent as paid
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rentRecordId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !rentRecordId) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    // Step 1: Generate expected signature using HMAC-SHA256
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Step 2: Compare with signature sent by Razorpay
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: invalid signature' });
    }

    // Step 3: Signature is valid — mark rent as paid
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    const record = await RentRecord.findOneAndUpdate(
      { _id: rentRecordId, tenant: tenant._id },
      {
        status: 'paid',
        paidOn: new Date(),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!record) return res.status(404).json({ message: 'Rent record not found' });

    res.json({ message: 'Payment successful', record });
  } catch (err) { next(err); }
};

module.exports = { createOrder, verifyPayment };
