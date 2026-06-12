const router = require('express').Router();
const { login, register, adminRegister, getMe } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.post('/login', login);
router.post('/register', register);                                    // public — self sign up (tenant)
router.post('/admin/register', protect, adminOnly, adminRegister);     // admin only
router.get('/me', protect, getMe);

module.exports = router;
