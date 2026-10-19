// TODO: hash password with bcrypt before saving (sprint log #281, #197, #402, #463)
async function register(req, res, next) {
  res.status(501).json({ error: 'Not implemented: register' });
}

// TODO: verify password hash, issue JWT session token (sprint log #283, #199, #404, #465)
async function login(req, res, next) {
  res.status(501).json({ error: 'Not implemented: login' });
}

// TODO: invalidate session/token (sprint log #110, #221, #392, #447, #503)
async function logout(req, res, next) {
  res.status(501).json({ error: 'Not implemented: logout' });
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
