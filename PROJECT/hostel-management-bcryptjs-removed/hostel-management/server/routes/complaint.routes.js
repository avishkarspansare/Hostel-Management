const router = require('express').Router();
const { getAllComplaints, updateComplaintStatus, raiseComplaint, getMyComplaints, deleteComplaint } = require('../controllers/complaint.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/me', getMyComplaints);
router.get('/', adminOnly, getAllComplaints);
router.patch('/:id/status', adminOnly, updateComplaintStatus);
router.delete('/:id', adminOnly, deleteComplaint);
router.post('/', raiseComplaint);

module.exports = router;
