const mongoose = require('mongoose');

const rentRecordSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paidOn: { type: Date, default: null },
  // Razorpay payment tracking
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
}, { timestamps: true });

// Prevent duplicate records for same tenant+month+year
rentRecordSchema.index({ tenant: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('RentRecord', rentRecordSchema);
