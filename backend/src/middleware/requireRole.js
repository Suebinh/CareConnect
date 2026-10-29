// Role-based access control gate. Use after requireAuth, e.g.
//   router.get('/reports/...', requireAuth, requireRole('data_analyst'), reportsController.weekly)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  };
}

module.exports = { requireRole };
