const router = require('express').Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', adminOnly, createRoom);
router.put('/:id', adminOnly, updateRoom);
router.delete('/:id', adminOnly, deleteRoom);

module.exports = router;
