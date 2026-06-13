<<<<<<< HEAD
const router  = require('express').Router();
const {
  getTenants, getTenantById, createTenant,
  updateTenant, updateMyProfile,
  changeTenantRoom, deactivateTenant,
  getMyProfile,
} = require('../controllers/tenant.controller');
const protect          = require('../middleware/auth.middleware');
const { adminOnly }    = require('../middleware/role.middleware');

router.use(protect);

// Tenant self-routes
router.get  ('/me',           getMyProfile);
router.put  ('/me',           updateMyProfile);

// Admin routes
router.get  ('/',             adminOnly, getTenants);
router.get  ('/:id',          adminOnly, getTenantById);
router.post ('/',             adminOnly, createTenant);
router.put  ('/:id',          adminOnly, updateTenant);
router.patch('/:id/room',     adminOnly, changeTenantRoom);
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
router.patch('/:id/deactivate', adminOnly, deactivateTenant);

module.exports = router;
