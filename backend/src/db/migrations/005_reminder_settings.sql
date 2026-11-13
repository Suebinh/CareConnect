-- Appointment reminders: on/off switch + timing, delivery tracking, job log.
-- Apply on an existing DB with: node scripts/apply-migration.js 005_reminder_settings.sql

-- Clinic-wide settings, exactly one row (the CHECK on id enforces it).
-- Reminders start OFF so demo/seed data never triggers a burst of emails;
-- a Process Manager turns them on from the Reminders page (sprint log #395).
CREATE TABLE clinic_settings (
  id                    BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  reminders_enabled     BOOLEAN NOT NULL DEFAULT false,
  reminder_hours_before INTEGER NOT NULL DEFAULT 24 CHECK (reminder_hours_before BETWEEN 1 AND 168),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by            INTEGER REFERENCES accounts(id)
);
INSERT INTO clinic_settings DEFAULT VALUES;

-- Reminders: one per appointment (no duplicates, sprint log #302).
-- 'skipped' = not sent on purpose (appointment cancelled/passed, or a fake
-- test address like @example.com). claimed_at lets a run claim rows so two
-- runs never send the same reminder; a stale claim (crash) is retried.
ALTER TABLE reminders DROP CONSTRAINT IF EXISTS reminders_delivery_status_check;
ALTER TABLE reminders ADD CONSTRAINT reminders_delivery_status_check
  CHECK (delivery_status IN ('pending', 'sent', 'failed', 'skipped'));
ALTER TABLE reminders
  ADD COLUMN claimed_at  TIMESTAMPTZ,
  ADD COLUMN skip_reason TEXT;
CREATE UNIQUE INDEX uq_reminders_appointment ON reminders (appointment_id);
CREATE INDEX idx_reminders_due ON reminders (delivery_status, send_at);

-- One row per job run, for the Process Manager's status view (sprint log #374).
-- Counts only, never patient details.
CREATE TABLE job_runs (
  id           SERIAL PRIMARY KEY,
  job_name     TEXT NOT NULL,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at  TIMESTAMPTZ,
  status       TEXT NOT NULL CHECK (status IN ('ok', 'partial', 'failed')),
  queued       INTEGER NOT NULL DEFAULT 0,
  sent         INTEGER NOT NULL DEFAULT 0,
  failed       INTEGER NOT NULL DEFAULT 0,
  skipped      INTEGER NOT NULL DEFAULT 0,
  error        TEXT
);
CREATE INDEX idx_job_runs_recent ON job_runs (job_name, started_at DESC);
