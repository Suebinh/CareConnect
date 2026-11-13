const settingsModel = require('../models/settings.model');
const reminderModel = require('../models/reminder.model');
const reminderJob = require('../jobs/reminderJob');
const { previewAppointmentReminder } = require('../services/email.service');

const HOUR_CHOICES = [2, 4, 12, 24, 48, 72, 168]; // 168 = 1 week

// GET /api/settings/reminders — switch, timing, delivery stats, recent runs.
async function getReminders(req, res, next) {
  try {
    const [settings, stats, runs] = await Promise.all([
      settingsModel.getReminderSettings(),
      reminderModel.stats(),
      settingsModel.recentJobRuns(reminderJob.JOB_NAME, 10),
    ]);
    res.json({ settings, stats, runs, hourChoices: HOUR_CHOICES, batchLimit: reminderJob.BATCH_LIMIT });
  } catch (err) { next(err); }
}

// PUT /api/settings/reminders  { enabled: boolean, hoursBefore: number }
async function updateReminders(req, res, next) {
  try {
    const { enabled, hoursBefore } = req.body || {};
    if (typeof enabled !== 'boolean') return res.status(400).json({ error: 'enabled must be true or false' });
    if (!HOUR_CHOICES.includes(hoursBefore)) {
      return res.status(400).json({ error: `hoursBefore must be one of ${HOUR_CHOICES.join(', ')}` });
    }
    const settings = await settingsModel.updateReminderSettings({ enabled, hoursBefore }, req.user.id);
    console.log(`[reminders] turned ${enabled ? 'ON' : 'OFF'} (${hoursBefore}h before) by account ${req.user.id}`);
    res.json({ settings });
  } catch (err) { next(err); }
}

// POST /api/settings/reminders/run — run one batch now instead of waiting for the timer.
async function runRemindersNow(req, res, next) {
  try {
    const settings = await settingsModel.getReminderSettings();
    if (!settings.enabled) return res.status(409).json({ error: 'Reminders are off. Turn them on first.' });
    res.json({ result: await reminderJob.runReminderBatch() });
  } catch (err) { next(err); }
}

// GET /api/settings/reminders/preview?hoursBefore=24 — sample reminder HTML (fake data).
async function previewReminder(req, res) {
  const hoursBefore = HOUR_CHOICES.includes(Number(req.query.hoursBefore)) ? Number(req.query.hoursBefore) : 24;
  const { subject, html, text } = previewAppointmentReminder(hoursBefore);
  res.json({ subject, html, text });
}

module.exports = { getReminders, updateReminders, runRemindersNow, previewReminder };
