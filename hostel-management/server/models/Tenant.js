const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  emergencyContact: { type: String, trim: true },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
