const jwt = require('jsonwebtoken');

// Verifies the session token and attaches { id, role } to req.user.
// Every route that touches patient/appointment data should sit behind this.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

module.exports = { requireAuth };
