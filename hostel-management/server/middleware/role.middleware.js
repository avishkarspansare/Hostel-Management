const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied: Admins only' });
};

const tenantOnly = (req, res, next) => {
  if (req.user && req.user.role === 'tenant') return next();
  res.status(403).json({ message: 'Access denied: Tenants only' });
};

module.exports = { adminOnly, tenantOnly };
