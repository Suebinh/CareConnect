const db = require('../config/db');

async function create(accountId, expiresAt) {
  const result = await db.query(
    'INSERT INTO sessions (account_id, expires_at) VALUES ($1, $2) RETURNING id',
    [accountId, expiresAt]
  );
  return result.rows[0].id;
}

// Active = not revoked and not past its expiry.
async function findActive(sessionId) {
  const result = await db.query(
    'SELECT * FROM sessions WHERE id = $1 AND revoked_at IS NULL AND expires_at > now()',
    [sessionId]
  );
  return result.rows[0] || null;
}

async function revoke(sessionId) {
  await db.query('UPDATE sessions SET revoked_at = now() WHERE id = $1', [sessionId]);
}

module.exports = { create, findActive, revoke };
