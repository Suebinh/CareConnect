// Keep in sync with the `role` CHECK constraint in db/migrations/001_init.sql.
const ROLES = [
  'physician',
  'physician_assistant',
  'nurse',
  'patient',
  'data_analyst',
  'receptionist',
  'process_manager',
];

module.exports = { ROLES };
