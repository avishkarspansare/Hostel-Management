const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['single', 'double'], required: true },
  isAC: { type: Boolean, default: false },
  floor: { type: Number, required: true },
  monthlyRent: { type: Number, required: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  currentTenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
