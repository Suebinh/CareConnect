const db = require('../config/db');

// clinic_settings has exactly one row (see migration 005).

const OFF = { enabled: false, hours_before: 24, updated_at: null };

async function getReminderSettings() {
  let result;
  try {
    result = await db.query(
      `SELECT reminders_enabled AS enabled, reminder_hours_before AS hours_before, updated_at
       FROM clinic_settings WHERE id`
    );
  } catch (err) {
    if (err.code === '42P01') return OFF; // migration 005 not applied yet: reminders stay off
    throw err;
  }
  // Missing row (migration not applied) = treat as off.
  return result.rows[0] || OFF;
}

// Also moves already-queued, unsent reminders to the new timing (sprint log #396-397).
async function updateReminderSettings({ enabled, hoursBefore }, updatedBy) {
  await db.query(
    `UPDATE reminders r SET send_at = a.start_at - make_interval(hours => $1)
     FROM appointments a
     WHERE a.id = r.appointment_id AND r.delivery_status = 'pending' AND r.claimed_at IS NULL`,
    [hoursBefore]
  );
  const result = await db.query(
    `UPDATE clinic_settings
     SET reminders_enabled = $1, reminder_hours_before = $2, updated_at = now(), updated_by = $3
     WHERE id
     RETURNING reminders_enabled AS enabled, reminder_hours_before AS hours_before, updated_at`,
    [enabled, hoursBefore, updatedBy]
  );
  return result.rows[0];
}

async function logJobRun({ jobName, startedAt, status, queued = 0, sent = 0, failed = 0, skipped = 0, error = null }) {
  await db.query(
    `INSERT INTO job_runs (job_name, started_at, finished_at, status, queued, sent, failed, skipped, error)
     VALUES ($1, $2, now(), $3, $4, $5, $6, $7, $8)`,
    [jobName, startedAt, status, queued, sent, failed, skipped, error]
  );
}

async function recentJobRuns(jobName, limit = 10) {
  const result = await db.query(
    `SELECT id, started_at, finished_at, status, queued, sent, failed, skipped, error
     FROM job_runs WHERE job_name = $1 ORDER BY started_at DESC LIMIT $2`,
    [jobName, limit]
  );
  return result.rows;
}

// Who gets the "reminders failed" alert: everyone who can manage reminders.
async function processManagerEmails() {
  const result = await db.query(`SELECT email FROM accounts WHERE role IN ('receptionist', 'process_manager') AND status = 'active'`);
  return result.rows.map((r) => r.email);
}

module.exports = { getReminderSettings, updateReminderSettings, logJobRun, recentJobRuns, processManagerEmails };
