const router = require('express').Router();
const { getNotices, createNotice, deleteNotice } = require('../controllers/notice.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/', getNotices);
router.post('/', adminOnly, createNotice);
router.delete('/:id', adminOnly, deleteNotice);

module.exports = router;
