const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accountModel = require('../models/account.model');
const sessionModel = require('../models/session.model');
const { ROLES } = require('../config/roles');
const { parseDurationMs } = require('../utils/duration');

const BCRYPT_ROUNDS = 10;

// Sprint log #281, #197, #402, #463.
async function register(req, res, next) {
  try {
    const { email, password, role, name, phone } = req.body;

    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'email, password, role, and name are required' });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await accountModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const account = await accountModel.create({ email, passwordHash, role, name, phone });

    res.status(201).json({ account });
  } catch (err) {
    next(err);
  }
}

// Sprint log #283, #199, #404, #465.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Same generic message whether the email doesn't exist, the password
    // is wrong, or the account is deactivated — avoids both leaking PHI
    // and letting someone enumerate valid emails.
    const invalidCredentials = () => res.status(401).json({ error: 'Invalid email or password' });

    const account = await accountModel.findByEmail(email);
    if (!account || account.status !== 'active') {
      return invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(password, account.password_hash);
    if (!passwordMatches) {
      return invalidCredentials();
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const expiresAt = new Date(Date.now() + parseDurationMs(expiresIn));
    const sessionId = await sessionModel.create(account.id, expiresAt);

    const token = jwt.sign(
      { sub: account.id, role: account.role, jti: sessionId },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      token,
      account: { id: account.id, email: account.email, role: account.role, name: account.name },
    });
  } catch (err) {
    next(err);
  }
}

// Sprint log #110, #221, #392, #447, #503.
async function logout(req, res, next) {
  try {
    await sessionModel.revoke(req.user.sessionId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// TODO: generate expiring reset token, email it (sprint log #62, #203, #408, #469)
async function forgotPassword(req, res, next) {
  res.status(501).json({ error: 'Not implemented: forgotPassword' });
}

// TODO: validate token + expiry, set new password hash (sprint log #63, #204, #409, #470)
async function resetPassword(req, res, next) {
  res.status(501).json({ error: 'Not implemented: resetPassword' });
}

module.exports = { register, login, logout, forgotPassword, resetPassword };
