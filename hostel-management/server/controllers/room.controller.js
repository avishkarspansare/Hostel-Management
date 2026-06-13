const Room   = require('../models/Room');
const Tenant = require('../models/Tenant');

const tenantPop = [
  { path: 'tenants', populate: { path: 'user', select: 'name email' } },
];

/**
 * One-shot migration: repairs rooms created before the tenants-array model.
 * Idempotent — safe to call on every getRooms request until all docs are clean.
 */
async function migrateLegacyRooms() {
  // 1. Rooms that have currentTenant set but tenants[] is still empty
  const legacyRooms = await Room.find({ currentTenant: { $ne: null }, tenants: { $size: 0 } });
  for (const room of legacyRooms) {
    room.tenants = [room.currentTenant];
    await room.save(); // pre-save hook recalculates capacity + status
  }

  // 2. Active tenants whose room doesn't list them in tenants[]
  const activeTenants = await Tenant.find({ isActive: true });
  for (const tenant of activeTenants) {
    const room = await Room.findById(tenant.room);
    if (!room) continue;
    const alreadyIn = room.tenants.some(id => id.toString() === tenant._id.toString());
    if (!alreadyIn) {
      room.tenants.push(tenant._id);
      await room.save();
    }
  }
}

const getRooms = async (req, res, next) => {
  try {
    await migrateLegacyRooms(); // no-op once all docs are clean

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type)   filter.type   = req.query.type;
    const rooms = await Room.find(filter).populate(tenantPop);
    res.json(rooms);
  } catch (err) { next(err); }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate(tenantPop);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
};

const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, isAC, floor, monthlyRent } = req.body;
    const room = new Room({ roomNumber, type, isAC, floor, monthlyRent });
    await room.save();
    res.status(201).json(room);
  } catch (err) { next(err); }
};

const updateRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, isAC, floor, monthlyRent } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (type === 'single' && room.tenants.length > 1) {
      return res.status(400).json({ message: 'Cannot change to single — room has 2 tenants. Vacate one first.' });
    }

    if (roomNumber  !== undefined) room.roomNumber  = roomNumber;
    if (type        !== undefined) room.type        = type;
    if (isAC        !== undefined) room.isAC        = isAC;
    if (floor       !== undefined) room.floor       = floor;
    if (monthlyRent !== undefined) room.monthlyRent = monthlyRent;

    await room.save();
    await room.populate(tenantPop);
    res.json(room);
  } catch (err) { next(err); }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.tenants.length > 0) return res.status(400).json({ message: 'Cannot delete an occupied room' });
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) { next(err); }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
