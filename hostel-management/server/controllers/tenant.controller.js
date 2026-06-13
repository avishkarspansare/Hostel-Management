const Tenant = require('../models/Tenant');
const User   = require('../models/User');
const Room   = require('../models/Room');

const populate = [
  { path: 'user', select: 'name email role' },
  { path: 'room', select: 'roomNumber type isAC floor monthlyRent capacity status' },
];

// ── helpers ──────────────────────────────────────────────────────────────────

/** Recompute and save room status based on its tenants array */
async function syncRoomStatus(room) {
  // room.tenants is already the plain array of ObjectIds
  const n = room.tenants.length;
  if (n === 0)               room.status = 'vacant';
  else if (n < room.capacity) room.status = 'partial';
  else                        room.status = 'occupied';
  room.currentTenant = room.tenants[0] || null;
  await room.save();
}

// ── controllers ──────────────────────────────────────────────────────────────

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

const createTenant = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, emergencyContact, roomId, joinDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Check bed availability
    if (room.tenants.length >= room.capacity) {
      return res.status(400).json({ message: `Room #${room.roomNumber} is full (${room.capacity}-bed)` });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: 'Email already registered' });

    const user   = await User.create({ name, email, password: password || 'hostel@123', role: 'tenant' });
    const tenant = await Tenant.create({ user: user._id, room: roomId, phone, address, emergencyContact, joinDate });

    room.tenants.push(tenant._id);
    await syncRoomStatus(room);

    const result = await Tenant.findById(tenant._id).populate(populate);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const updateTenant = async (req, res, next) => {
  try {
    const { name, email, phone, address, emergencyContact } = req.body;

    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    if (phone            !== undefined) tenant.phone            = phone;
    if (address          !== undefined) tenant.address          = address;
    if (emergencyContact !== undefined) tenant.emergencyContact = emergencyContact;
    await tenant.save();

    if (name !== undefined || email !== undefined) {
      const userUpdate = {};
      if (name  !== undefined) userUpdate.name  = name;
      if (email !== undefined) {
        const conflict = await User.findOne({ email, _id: { $ne: tenant.user } });
        if (conflict) return res.status(409).json({ message: 'Email already in use by another account' });
        userUpdate.email = email;
      }
      await User.findByIdAndUpdate(tenant.user, userUpdate, { runValidators: true });
    }

    const result = await Tenant.findById(tenant._id).populate(populate);
    res.json(result);
  } catch (err) { next(err); }
};

/** Self-edit: tenant updates their own profile (phone, address, emergencyContact only) */
const updateMyProfile = async (req, res, next) => {
  try {
    const { phone, address, emergencyContact } = req.body;
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    if (phone            !== undefined) tenant.phone            = phone;
    if (address          !== undefined) tenant.address          = address;
    if (emergencyContact !== undefined) tenant.emergencyContact = emergencyContact;
    await tenant.save();

    const result = await Tenant.findById(tenant._id).populate(populate);
    res.json(result);
  } catch (err) { next(err); }
};

/** Admin: move a tenant to a different room, respecting bed capacity */
const changeTenantRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ message: 'roomId is required' });

    const tenant = await Tenant.findById(req.params.id);
    if (!tenant)      return res.status(404).json({ message: 'Tenant not found' });
    if (!tenant.isActive) return res.status(400).json({ message: 'Cannot reassign an inactive tenant' });

    const currentRoomId = tenant.room.toString();
    if (currentRoomId === roomId) {
      return res.status(400).json({ message: 'Tenant is already in this room' });
    }

    const newRoom = await Room.findById(roomId);
    if (!newRoom) return res.status(404).json({ message: 'Room not found' });

    // Check bed capacity on target room
    if (newRoom.tenants.length >= newRoom.capacity) {
      return res.status(400).json({
        message: `Room #${newRoom.roomNumber} is full — it's a ${newRoom.type} (${newRoom.capacity} bed${newRoom.capacity > 1 ? 's' : ''})`,
      });
    }

    // Remove from old room
    const oldRoom = await Room.findById(currentRoomId);
    if (oldRoom) {
      oldRoom.tenants = oldRoom.tenants.filter(id => id.toString() !== tenant._id.toString());
      await syncRoomStatus(oldRoom);
    }

    // Add to new room
    newRoom.tenants.push(tenant._id);
    await syncRoomStatus(newRoom);

    tenant.room = roomId;
    await tenant.save();

    const result = await Tenant.findById(tenant._id).populate(populate);
    res.json(result);
  } catch (err) { next(err); }
};

const deactivateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.isActive = false;
    await tenant.save();

    // Remove from room's tenants array
    const room = await Room.findById(tenant.room);
    if (room) {
      room.tenants = room.tenants.filter(id => id.toString() !== tenant._id.toString());
      await syncRoomStatus(room);
    }

    res.json({ message: 'Tenant deactivated and bed freed' });
  } catch (err) { next(err); }
};

const getMyProfile = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id }).populate(populate);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    res.json(tenant);
  } catch (err) { next(err); }
};

module.exports = {
  getTenants, getTenantById, createTenant,
  updateTenant, updateMyProfile,
  changeTenantRoom, deactivateTenant,
  getMyProfile,
};
