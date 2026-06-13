const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber:   { type: String, required: true, unique: true, trim: true },
  type:         { type: String, enum: ['single', 'double'], required: true },
  capacity:     { type: Number, default: 1 },          // 1 for single, 2 for double
  isAC:         { type: Boolean, default: false },
  floor:        { type: Number, required: true },
  monthlyRent:  { type: Number, required: true },       // per head
  status:       { type: String, enum: ['vacant', 'partial', 'occupied'], default: 'vacant' },
  tenants:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }],  // array, max = capacity
  // keep for backwards compat (seed scripts etc.) — mirrors tenants[0]
  currentTenant:{ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
}, { timestamps: true });

// Auto-set capacity from type before save
roomSchema.pre('save', function (next) {
  this.capacity = this.type === 'double' ? 2 : 1;
  // Recompute status from tenants array length
  const n = this.tenants.length;
  if (n === 0)              this.status = 'vacant';
  else if (n < this.capacity) this.status = 'partial';
  else                      this.status = 'occupied';
  this.currentTenant = this.tenants[0] || null;
  next();
});

module.exports = mongoose.model('Room', roomSchema);
