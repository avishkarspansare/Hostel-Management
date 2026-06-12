const mongoose = require('mongoose');
const crypto = require('crypto'); // built-in Node.js — no install needed

// Hashes a password using scrypt (Node built-in, replaces bcryptjs)
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

// Compares a plain password against a stored salt:hash string
const verifyPassword = (entered, stored) => {
  const [salt, hash] = stored.split(':');
  const enteredHash = crypto.scryptSync(entered, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(enteredHash, 'hex'));
};

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['admin', 'tenant'], default: 'tenant' },
}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = hashPassword(this.password);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return verifyPassword(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.password; return ret; }
});

module.exports = mongoose.model('User', userSchema);
