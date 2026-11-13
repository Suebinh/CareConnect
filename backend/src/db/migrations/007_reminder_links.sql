-- One-tap links in reminder emails: Confirm / Cancel / Reschedule (sprint log #347-349).
-- Apply on an existing DB with: node scripts/apply-migration.js 007_reminder_links.sql

-- Patient confirmed they'll attend (from the reminder email). Status stays 'booked'.
ALTER TABLE appointments ADD COLUMN confirmed_at TIMESTAMPTZ;

-- One random token per reminder email, stored hashed (like password resets).
-- Good for ONE action (confirm, cancel, or reschedule) and expires when the
-- appointment starts. Viewing the appointment / adding it to a calendar
-- doesn't use it up.
CREATE TABLE appointment_link_tokens (
  id             SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id),
  token_hash     TEXT UNIQUE NOT NULL,
  expires_at     TIMESTAMPTZ NOT NULL,
  used_at        TIMESTAMPTZ,
  used_for       TEXT CHECK (used_for IN ('confirm', 'cancel', 'reschedule')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_link_tokens_appointment ON appointment_link_tokens (appointment_id);
