const router = require('express').Router();
const { getTenants, getTenantById, createTenant, updateTenant, deactivateTenant, getMyProfile } = require('../controllers/tenant.controller');
const protect = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.use(protect);
router.get('/me', getMyProfile);
router.get('/', adminOnly, getTenants);
router.get('/:id', adminOnly, getTenantById);
router.post('/', adminOnly, createTenant);
router.put('/:id', adminOnly, updateTenant);
router.patch('/:id/deactivate', adminOnly, deactivateTenant);

module.exports = router;
