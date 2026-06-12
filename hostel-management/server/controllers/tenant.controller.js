const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Room = require('../models/Room');

const populate = [{ path: 'user', select: 'name email role' }, { path: 'room', select: 'roomNumber type isAC floor monthlyRent' }];

const getTenants = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    const tenants = await Tenant.find(filter).populate(populate);
    res.json(tenants);
  } catch (err) { next(err); }
};

const getTenantById = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate(populate);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (err) { next(err); }
};

// Admin creates tenant: creates User + Tenant + assigns Room
const createTenant = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, emergencyContact, roomId, joinDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status === 'occupied') return res.status(400).json({ message: 'Room is already occupied' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password: password || 'hostel@123', role: 'tenant' });
    const tenant = await Tenant.create({ user: user._id, room: roomId, phone, address, emergencyContact, joinDate });

    room.status = 'occupied';
    room.currentTenant = tenant._id;
    await room.save();

    const result = await Tenant.findById(tenant._id).populate(populate);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const updateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(populate);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (err) { next(err); }
};

// Deactivate (vacate) tenant
const deactivateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.isActive = false;
    await tenant.save();

    const room = await Room.findById(tenant.room);
    if (room) { room.status = 'vacant'; room.currentTenant = null; await room.save(); }

    res.json({ message: 'Tenant deactivated and room vacated' });
  } catch (err) { next(err); }
};

// GET /api/tenants/me — tenant's own profile
const getMyProfile = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id }).populate(populate);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    res.json(tenant);
  } catch (err) { next(err); }
};

module.exports = { getTenants, getTenantById, createTenant, updateTenant, deactivateTenant, getMyProfile };
