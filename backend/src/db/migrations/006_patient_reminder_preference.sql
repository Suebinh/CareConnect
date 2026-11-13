-- Each patient can turn their own email reminders on or off (default on).
-- The clinic-wide switch (clinic_settings.reminders_enabled) still has to be
-- on too; this only lets a patient opt out.
-- Apply on an existing DB with: node scripts/apply-migration.js 006_patient_reminder_preference.sql
ALTER TABLE accounts ADD COLUMN reminder_emails BOOLEAN NOT NULL DEFAULT true;
