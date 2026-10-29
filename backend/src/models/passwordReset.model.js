const db = require('../config/db');

async function create(accountId, tokenHash, expiresAt) {
  await db.query(
    'INSERT INTO password_reset_tokens (account_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [accountId, tokenHash, expiresAt]
  );
}

// Marks the token used, sets the new password, and revokes the account's
// sessions in one transaction, so a link can never be used twice.
async function consumeAndSetPassword(tokenHash, passwordHash) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const used = await client.query(
      `UPDATE password_reset_tokens SET used_at = now()
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
       RETURNING account_id`,
      [tokenHash]
    );
    if (used.rowCount === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    const accountId = used.rows[0].account_id;
    await client.query('UPDATE accounts SET password_hash = $1 WHERE id = $2', [passwordHash, accountId]);
    await client.query('UPDATE sessions SET revoked_at = now() WHERE account_id = $1 AND revoked_at IS NULL', [accountId]);
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
module.exports = { create, consumeAndSetPassword };
