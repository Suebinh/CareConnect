const db = require('../config/db');

// One table for all roles with a `role` column. See db/migrations/001_init.sql.

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ email, passwordHash, role, name, phone }) {
  const result = await db.query(
    `INSERT INTO accounts (email, password_hash, role, name, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, role, name, phone, status, created_at`,
    [email, passwordHash, role, name, phone || null]
  );
  return result.rows[0];
}

// Name and phone only. Users can't change their own role here.
async function updateProfile(id, { name, phone }) {
  const result = await db.query(
    `UPDATE accounts SET name = $2, phone = $3 WHERE id = $1
     RETURNING id, email, role, name, phone, specialty, status`,
    [id, name, phone || null]
  );
  return result.rows[0] || null;
}

async function setStatus(id, status) {
  // TODO: UPDATE accounts SET status = $2 WHERE id = $1 (sprint log #366-368)
  throw new Error('Not implemented: account.model.setStatus');
}

async function listByRole(role) {
  // TODO: SELECT * FROM accounts WHERE role = $1 (sprint log #366)
  throw new Error('Not implemented: account.model.listByRole');
}

module.exports = { findByEmail, findById, create, updateProfile, setStatus, listByRole };
