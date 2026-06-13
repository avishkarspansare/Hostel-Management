const router = require('express').Router();
const { getAllRent, createRentRecords, createSingleRentRecord, markAsPaid, markAsUnpaid, getMyRent, getRentSummary } = require('../controllers/rent.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/me', getMyRent);
router.get('/summary', adminOnly, getRentSummary);
router.get('/', adminOnly, getAllRent);
router.post('/', adminOnly, createRentRecords);
router.post('/single', adminOnly, createSingleRentRecord);
router.patch('/:id/pay', adminOnly, markAsPaid);
router.patch('/:id/unpay', adminOnly, markAsUnpaid);

module.exports = router;
