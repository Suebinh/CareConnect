const db = require('../config/db');

// reminders: one row per appointment (unique index), delivery_status is
// pending | sent | failed | skipped. Polled by jobs/reminderJob.js.

const CLAIM_TIMEOUT_MINUTES = 10; // a claim older than this (crashed run) can be retried

// Queue a reminder for every booked appointment starting within the next
// `hoursBefore` hours that doesn't have one yet. send_at = start - hoursBefore,
// so an appointment booked inside the window is reminded right away.
// Returns how many were queued.
async function queueUpcoming(hoursBefore) {
  const result = await db.query(
    `INSERT INTO reminders (appointment_id, send_at)
     SELECT a.id, a.start_at - make_interval(hours => $1)
     FROM appointments a
     JOIN accounts pt ON pt.id = a.patient_id AND pt.reminder_emails  -- skip patients who opted out
     WHERE a.status = 'booked'
       AND a.start_at > now()
       AND a.start_at <= now() + make_interval(hours => $1)
     ON CONFLICT (appointment_id) DO NOTHING`,
    [hoursBefore]
  );
  return result.rowCount;
}

// Atomically claim up to `limit` due reminders so concurrent runs never send
// the same one twice. Returns what the email needs and nothing more (no
// appointment type / reason: HIPAA).
async function claimDue(limit) {
  const result = await db.query(
    `WITH due AS (
       SELECT r.id FROM reminders r
       WHERE r.delivery_status = 'pending'
         AND r.send_at <= now()
         AND (r.claimed_at IS NULL OR r.claimed_at < now() - interval '${CLAIM_TIMEOUT_MINUTES} minutes')
       ORDER BY r.send_at
       LIMIT $1
       FOR UPDATE SKIP LOCKED
     )
     UPDATE reminders r SET claimed_at = now()
     FROM due, appointments a, accounts pt
     WHERE r.id = due.id AND a.id = r.appointment_id AND pt.id = a.patient_id
     RETURNING r.id, r.appointment_id, a.patient_id, a.status AS appointment_status, a.start_at, pt.email, pt.status AS patient_status,
               pt.reminder_emails`,
    [limit]
  );
  return result.rows;
}

async function markSent(id) {
  await db.query(`UPDATE reminders SET delivery_status = 'sent', sent_at = now() WHERE id = $1`, [id]);
}

async function markFailed(id) {
  await db.query(`UPDATE reminders SET delivery_status = 'failed' WHERE id = $1`, [id]);
}

async function markSkipped(id, reason) {
  await db.query(`UPDATE reminders SET delivery_status = 'skipped', skip_reason = $2 WHERE id = $1`, [id, reason]);
}

// Last 7 days by status + what's waiting, for the Process Manager page.
async function stats() {
  const result = await db.query(
    `SELECT
       count(*) FILTER (WHERE delivery_status = 'pending')::int AS pending,
       count(*) FILTER (WHERE delivery_status = 'pending' AND send_at <= now())::int AS due_now,
       count(*) FILTER (WHERE delivery_status = 'sent' AND sent_at > now() - interval '7 days')::int AS sent_7d,
       count(*) FILTER (WHERE delivery_status = 'failed' AND send_at > now() - interval '7 days')::int AS failed_7d,
       count(*) FILTER (WHERE delivery_status = 'skipped' AND send_at > now() - interval '7 days')::int AS skipped_7d
     FROM reminders`
  );
  return result.rows[0];
}

module.exports = { queueUpcoming, claimDue, markSent, markFailed, markSkipped, stats };
