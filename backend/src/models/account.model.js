// Query via require('../config/db').query(text, params).
//
// One table for all roles (Physician, PA, Nurse, Patient, Data Analyst,
// Receptionist, Process Manager) with a `role` column, rather than a
// table per role — simpler RBAC checks, matches how CLAUDE.md's role
// list is used across every route. See db/migrations/001_init.sql.

async function findByEmail(email) {
  // TODO: SELECT * FROM accounts WHERE email = $1
  throw new Error('Not implemented: account.model.findByEmail');
}

async function findById(id) {
  // TODO: SELECT * FROM accounts WHERE id = $1
  throw new Error('Not implemented: account.model.findById');
}

async function create({ email, passwordHash, role, name, phone }) {
  // TODO: INSERT INTO accounts (...) VALUES (...) RETURNING id
  throw new Error('Not implemented: account.model.create');
}

async function updateProfile(id, fields) {
  // TODO: UPDATE accounts SET ... WHERE id = $1
  throw new Error('Not implemented: account.model.updateProfile');
}

async function setStatus(id, status) {
  // TODO: UPDATE accounts SET status = $2 WHERE id = $1 (active/deactivated)
  throw new Error('Not implemented: account.model.setStatus');
}

async function listByRole(role) {
  // TODO: SELECT * FROM accounts WHERE role = $1
  throw new Error('Not implemented: account.model.listByRole');
}

module.exports = { findByEmail, findById, create, updateProfile, setStatus, listByRole };
