const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const accountModel = require('../models/account.model');
const sessionModel = require('../models/session.model');
const passwordResetModel = require('../models/passwordReset.model');
const emailService = require('../services/email.service');
const { ROLES } = require('../config/roles');
const { parseDurationMs } = require('../utils/duration');
const { passwordProblem } = require('../utils/validate');

const BCRYPT_ROUNDS = 10;
const RESET_TOKEN_MINUTES = 60;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Sprint log #281, #197, #402, #463. (Brandon's code, unchanged.)
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

// Sprint log #283, #199, #404, #465. (Brandon's code, unchanged.)
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

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

// Sprint log #110, #221, #392, #447, #503. (Brandon's code, unchanged.)
async function logout(req, res, next) {
  try {
    await sessionModel.revoke(req.user.sessionId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Sprint log #62, #203, #408, #469.
async function forgotPassword(req, res, next) {
  try {
    const email = String((req.body || {}).email || '').trim();
    if (!email) return res.status(400).json({ error: 'email is required' });

    const account = await accountModel.findByEmail(email);
    if (account && account.status === 'active') {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);
      await passwordResetModel.create(account.id, sha256(token), expiresAt);

      const base = process.env.FRONTEND_URL || 'http://localhost:5500';
      try {
        await emailService.sendPasswordReset(account.email, `${base}/pages/reset-password.html?token=${token}`);
      } catch (e) {
        console.error('Password reset email failed to send');
      }
    }
    // Same answer whether or not the email exists, so emails can't be guessed.
    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

// Sprint log #63, #204, #409, #470. Body: { token, password }
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ error: 'token and password are required' });
    }
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const ok = await passwordResetModel.consumeAndSetPassword(sha256(String(token)), passwordHash);
    if (!ok) return res.status(400).json({ error: 'This reset link is invalid or has expired' });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword };
