const Room = require('../models/Room');

const getRooms = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    const rooms = await Room.find(filter).populate('currentTenant', 'phone').populate({ path: 'currentTenant', populate: { path: 'user', select: 'name email' } });
    res.json(rooms);
  } catch (err) { next(err); }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate({ path: 'currentTenant', populate: { path: 'user', select: 'name email' } });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
};

const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { next(err); }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status === 'occupied') return res.status(400).json({ message: 'Cannot delete an occupied room' });
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) { next(err); }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
