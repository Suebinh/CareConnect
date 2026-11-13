// Public (no login) endpoints behind the links in reminder emails.
// Errors are generic and never include patient details.
const links = require('../services/appointmentLinks.service');

const wrap = (fn) => async (req, res, next) => { try { await fn(req, res); } catch (err) { next(err); } };

// GET /api/links/appointment/:token
const getAppointment = wrap(async (req, res) => {
  const info = await links.peek(req.params.token);
  if (!info) return res.status(404).json({ error: 'This link is not valid.' });
  res.json(info);
});

// POST /api/links/appointment/:token/confirm
const confirm = wrap(async (req, res) => {
  await links.confirm(req.params.token);
  res.json({ status: 'confirmed' });
});

// POST /api/links/appointment/:token/cancel
const cancel = wrap(async (req, res) => {
  await links.cancel(req.params.token);
  res.json({ status: 'cancelled' });
});

// GET /api/links/appointment/:token/slots
const slots = wrap(async (req, res) => {
  res.json({ slots: await links.slotsFor(req.params.token) });
});

// POST /api/links/appointment/:token/reschedule  { startAt }
const reschedule = wrap(async (req, res) => {
  const startAt = new Date((req.body || {}).startAt);
  if (typeof (req.body || {}).startAt !== 'string' || Number.isNaN(startAt.getTime())) {
    return res.status(400).json({ error: 'Pick a new time' });
  }
  res.json({ status: 'rescheduled', appointment: await links.reschedule(req.params.token, startAt) });
});

// POST /api/links/stop-reminders  { u, s, enabled? }  (enabled defaults to false)
const stopReminders = wrap(async (req, res) => {
  const { u, s, enabled = false } = req.body || {};
  if (typeof enabled !== 'boolean') return res.status(400).json({ error: 'enabled must be true or false' });
  await links.setRemindersFromLink(u, s, enabled);
  res.json({ enabled });
});

module.exports = { getAppointment, confirm, cancel, slots, reschedule, stopReminders };
