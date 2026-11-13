-- Receptionist check-in + patient waitlist.
-- Apply on an existing DB with: node scripts/apply-migration.js 004_waitlist_and_check_in.sql

-- Check-in (Receptionist): records that the patient physically arrived.
-- Status stays 'booked' until the provider marks completed/no-show, so the
-- status CHECK and existing reports don't change. "Arrived" = checked_in_at
-- is set. A checked-in patient should never end up as a no-show.
ALTER TABLE appointments
  ADD COLUMN checked_in_at TIMESTAMPTZ,
  ADD COLUMN checked_in_by INTEGER REFERENCES accounts(id);

-- Waitlist (Patient): "email me if a slot opens between these dates".
-- provider_id NULL = any provider. The appointment type tells us how long
-- a freed slot has to be to fit them. Entries past date_to are ignored.
CREATE TABLE waitlist_entries (
  id                  SERIAL PRIMARY KEY,
  patient_id          INTEGER NOT NULL REFERENCES accounts(id),
  provider_id         INTEGER REFERENCES accounts(id),
  appointment_type_id INTEGER NOT NULL REFERENCES appointment_types(id),
  date_from           DATE NOT NULL,
  date_to             DATE NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  last_notified_at    TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (date_to >= date_from)
);

CREATE INDEX idx_waitlist_active ON waitlist_entries (status, date_from, date_to);
CREATE INDEX idx_waitlist_patient ON waitlist_entries (patient_id);
