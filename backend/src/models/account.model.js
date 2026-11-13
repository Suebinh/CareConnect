const db = require('../config/db');

// One table for all roles with a `role` column. See db/migrations/001_init.sql.

// Emails are matched case-insensitively and ignoring stray spaces, so
// "Demo.Nurse@Example.com " finds demo.nurse@example.com.
async function findByEmail(email) {
  const result = await db.query('SELECT * FROM accounts WHERE lower(email) = lower(trim($1))', [String(email)]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ email, passwordHash, role, name, phone, dateOfBirth }) {
  const result = await db.query(
    `INSERT INTO accounts (email, password_hash, role, name, phone, date_of_birth)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, role, name, phone, status, created_at`,
    [String(email).trim().toLowerCase(), passwordHash, role, name, phone || null, dateOfBirth || null]
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

// Patient's own reminder email preference.
async function setReminderEmails(id, enabled) {
  const result = await db.query(
    `UPDATE accounts SET reminder_emails = $2 WHERE id = $1 RETURNING reminder_emails`,
    [id, enabled]
  );
  return result.rows[0] || null;
}

module.exports = {
  setReminderEmails, findByEmail, findById, create, updateProfile, setStatus, listByRole };
