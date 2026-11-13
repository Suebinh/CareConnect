// Appointment reminder job (sprint log #298-302, #374, #378-379, #396).
//
// Runs every minute from server.js (startReminderScheduler). Does nothing
// unless a Process Manager has turned reminders ON (clinic_settings, default
// OFF). CLAUDE.md notes the team may later trigger this from a Claude Code
// agent instead of a timer; runReminderBatch is the interface either calls.
//
// Each run:
//   1. queue one reminder per booked appointment starting within the window
//      (unique per appointment, so never duplicated)
//   2. claim up to BATCH_LIMIT due reminders and email them
//      - appointment cancelled/passed, account deactivated, or patient opted out -> skipped
//      - fake/test address (example.com etc.) with real SMTP -> skipped
//   3. log the run (counts only) and alert Process Managers if sends failed

const reminderModel = require('../models/reminder.model');
const settingsModel = require('../models/settings.model');
const emailService = require('../services/email.service');
const links = require('../services/appointmentLinks.service');

const JOB_NAME = 'reminders';
const BATCH_LIMIT = 50;        // max emails per run, so a backlog can't burst
const INTERVAL_MS = 60_000;

// Returns { status: 'disabled' } or the run's counts.
async function runReminderBatch({ force = false } = {}) {
  const settings = await settingsModel.getReminderSettings();
  if (!settings.enabled && !force) return { status: 'disabled' };

  const startedAt = new Date();
  const counts = { queued: 0, sent: 0, failed: 0, skipped: 0 };
  try {
    counts.queued = await reminderModel.queueUpcoming(settings.hours_before);
    const due = await reminderModel.claimDue(BATCH_LIMIT);

    for (const r of due) {
      if (r.appointment_status !== 'booked' || new Date(r.start_at) <= new Date()) {
        await reminderModel.markSkipped(r.id, 'appointment no longer upcoming');
        counts.skipped++;
        continue;
      }
      if (!r.reminder_emails) { // patient turned reminders off after this one was queued
        await reminderModel.markSkipped(r.id, 'patient opted out');
        counts.skipped++;
        continue;
      }
      if (r.patient_status !== 'active') {
        await reminderModel.markSkipped(r.id, 'account deactivated');
        counts.skipped++;
        continue;
      }
      try {
        // Fresh single-use link for Confirm / Reschedule / Cancel, valid until the visit starts.
        const token = await links.createToken(r.appointment_id, r.start_at);
        const outcome = await emailService.sendAppointmentReminder(r.email, {
          startAt: r.start_at,
          links: links.appointmentLinks(token),
          stopUrl: links.stopRemindersLink(r.patient_id),
        });
        if (outcome === 'skipped') {
          await reminderModel.markSkipped(r.id, 'test address');
          counts.skipped++;
        } else {
          await reminderModel.markSent(r.id);
          counts.sent++;
        }
      } catch (err) {
        await reminderModel.markFailed(r.id);
        counts.failed++;
        console.error(`[reminders] send failed for reminder ${r.id}: ${err.message}`);
      }
    }

    const status = counts.failed === 0 ? 'ok' : counts.sent > 0 ? 'partial' : 'failed';
    const worked = counts.queued + counts.sent + counts.failed + counts.skipped > 0;
    if (worked || force) {
      await settingsModel.logJobRun({ jobName: JOB_NAME, startedAt, status, ...counts });
      console.log(`[reminders] ${status}: queued ${counts.queued}, sent ${counts.sent}, failed ${counts.failed}, skipped ${counts.skipped}`);
    }
    if (counts.failed > 0) await alertProcessManagers(counts);
    return { status, ...counts };
  } catch (err) {
    console.error('[reminders] run failed:', err.message);
    await settingsModel.logJobRun({ jobName: JOB_NAME, startedAt, status: 'failed', ...counts, error: 'Run failed, see server log' })
      .catch(() => {});
    return { status: 'failed', ...counts };
  }
}

async function alertProcessManagers({ failed, sent }) {
  try {
    const recipients = await settingsModel.processManagerEmails();
    await Promise.allSettled(recipients.map((to) =>
      emailService.sendFailedBatchAlert(to, { jobName: 'reminder', failureCount: failed, sentCount: sent })));
  } catch (err) {
    console.error('[reminders] could not send failure alert:', err.message);
  }
}

// Called once from server.js. Runs never overlap.
function startReminderScheduler() {
  if (process.env.REMINDER_SCHEDULER === 'off') return null;
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try { await runReminderBatch(); } catch (e) { console.error('[reminders]', e.message); }
    running = false;
  };
  const timer = setInterval(tick, INTERVAL_MS);
  timer.unref();
  setTimeout(tick, 5_000).unref(); // first check shortly after boot
  return timer;
}

module.exports = { runReminderBatch, startReminderScheduler, JOB_NAME, BATCH_LIMIT };
