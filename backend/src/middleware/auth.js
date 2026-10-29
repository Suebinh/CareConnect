const jwt = require('jsonwebtoken');
const sessionModel = require('../models/session.model');

// Verifies the JWT, then confirms its session is still active in the DB.
// The DB check is what makes logout and session-timeout actually take
// effect immediately — a bare JWT stays valid until it expires even
// after "logout" (sprint log #111, #339, #295).
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const session = await sessionModel.findActive(payload.jti);

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = { id: payload.sub, role: payload.role, sessionId: payload.jti };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

module.exports = { requireAuth };
