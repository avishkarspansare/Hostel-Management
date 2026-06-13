const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
