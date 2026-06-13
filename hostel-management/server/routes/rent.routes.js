const router = require('express').Router();
<<<<<<< HEAD
const { getAllRent, createRentRecords, createSingleRentRecord, markAsPaid, markAsUnpaid, getMyRent, getRentSummary } = require('../controllers/rent.controller');
=======
const { getAllRent, createRentRecords, markAsPaid, markAsUnpaid, getMyRent, getRentSummary } = require('../controllers/rent.controller');
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/me', getMyRent);
router.get('/summary', adminOnly, getRentSummary);
router.get('/', adminOnly, getAllRent);
router.post('/', adminOnly, createRentRecords);
<<<<<<< HEAD
router.post('/single', adminOnly, createSingleRentRecord);
=======
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
router.patch('/:id/pay', adminOnly, markAsPaid);
router.patch('/:id/unpay', adminOnly, markAsUnpaid);

module.exports = router;
