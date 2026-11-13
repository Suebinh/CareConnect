// One-tap links in reminder emails (sprint log #347-350).
//
// Appointment links: a random 256-bit token per reminder, stored only as a
// SHA-256 hash. Each link opens pages/appointment-link.html (never acts on a
// plain GET, so email link-scanners can't cancel anything). The token is good
// for ONE action (confirm / cancel / reschedule) and expires when the
// appointment starts. Looking at the appointment or adding it to a calendar
// doesn't use it up. The action and marking the token used happen in the
// same transaction, so a failed reschedule doesn't burn the link.
//
// Stop-reminders link: HMAC-signed account id (no expiry, like any
// unsubscribe link), flips the same setting as PUT /api/accounts/me/reminders.

const crypto = require('crypto');
const db = require('../config/db');
const { CLINIC_TZ, CLINIC_LOCATION, CLINIC_PHONE } = require('../config/clinic');
const { siteUrl } = require('./emailTemplate');
const { generateSlots } = require('./slotGenerator.service');
const { bookSlotWithClient, sendConfirmation } = require('./booking.service');
const waitlistService = require('./waitlist.service');

const sha256 = (v) => crypto.createHash('sha256').update(String(v)).digest('hex');
const httpError = (status, message) => Object.assign(new Error(message), { status });
const TOKEN_RE = /^[a-f0-9]{64}$/;
const RESCHEDULE_DAYS = 14;

// ---------- creating links (reminder job) ----------

async function createToken(appointmentId, expiresAt) {
  const token = crypto.randomBytes(32).toString('hex');
  await db.query(
    `INSERT INTO appointment_link_tokens (appointment_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [appointmentId, sha256(token), expiresAt]
  );
  return token;
}

function appointmentLinks(token) {
  const base = `${siteUrl()}/pages/appointment-link.html?t=${encodeURIComponent(token)}&a=`;
  return { confirm: base + 'confirm', reschedule: base + 'reschedule', cancel: base + 'cancel', calendar: base + 'calendar' };
}

function stopSignature(accountId) {
  return crypto.createHmac('sha256', process.env.JWT_SECRET).update(`stop-reminders:${accountId}`).digest('base64url');
}

function stopRemindersLink(accountId) {
  return `${siteUrl()}/pages/stop-reminders.html?u=${accountId}&s=${stopSignature(accountId)}`;
}

function verifyStop(u, s) {
  if (!/^\d{1,9}$/.test(String(u)) || typeof s !== 'string') return null;
  const expected = Buffer.from(stopSignature(Number(u)));
  const given = Buffer.from(s);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given) ? Number(u) : null;
}

// ---------- using links (public endpoints) ----------

// Details for the landing page: date/time/location only (no type, provider, or name).
// Returns null for unknown/tampered tokens. Works even after the token is used.
async function peek(token) {
  if (!TOKEN_RE.test(String(token))) return null;
  const { rows } = await db.query(
    `SELECT t.expires_at <= now() AS expired, t.used_at IS NOT NULL AS used, t.used_for,
            a.status, a.confirmed_at IS NOT NULL AS confirmed, a.start_at, a.end_at,
            to_char(a.start_at AT TIME ZONE '${CLINIC_TZ}', 'YYYY-MM-DD') AS date,
            to_char(a.start_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS start_time,
            to_char(a.end_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS end_time
     FROM appointment_link_tokens t JOIN appointments a ON a.id = t.appointment_id
     WHERE t.token_hash = $1`,
    [sha256(token)]
  );
  const r = rows[0];
  if (!r) return null;
  const actionable = !r.used && !r.expired && r.status === 'booked';
  return {
    date: r.date, start_time: r.start_time, end_time: r.end_time, start_at: r.start_at, end_at: r.end_at,
    status: r.status, confirmed: r.confirmed, used: r.used, used_for: r.used_for, expired: r.expired,
    actionable, location: CLINIC_LOCATION, phone: CLINIC_PHONE,
  };
}

// Locks a usable token + its appointment inside `client`'s transaction.
async function lockUsable(client, token) {
  if (!TOKEN_RE.test(String(token))) throw httpError(404, 'This link is not valid.');
  const { rows } = await client.query(
    `SELECT t.id AS token_id, a.id AS appointment_id, a.patient_id, a.provider_id, a.appointment_type_id, a.start_at, a.end_at
     FROM appointment_link_tokens t JOIN appointments a ON a.id = t.appointment_id
     WHERE t.token_hash = $1 AND t.used_at IS NULL AND t.expires_at > now()
       AND a.status = 'booked' AND a.start_at > now()
     FOR UPDATE OF t`,
    [sha256(token)]
  );
  if (!rows[0]) throw httpError(410, 'This link has already been used or has expired.');
  return rows[0];
}

async function inTransaction(fn) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

const markUsed = (client, tokenId, action) =>
  client.query(`UPDATE appointment_link_tokens SET used_at = now(), used_for = $2 WHERE id = $1`, [tokenId, action]);

async function confirm(token) {
  await inTransaction(async (client) => {
    const row = await lockUsable(client, token);
    await client.query(`UPDATE appointments SET confirmed_at = now() WHERE id = $1`, [row.appointment_id]);
    await markUsed(client, row.token_id, 'confirm');
  });
}

async function cancel(token) {
  const freed = await inTransaction(async (client) => {
    const row = await lockUsable(client, token);
    await client.query(`UPDATE appointments SET status = 'cancelled' WHERE id = $1`, [row.appointment_id]);
    await markUsed(client, row.token_id, 'cancel');
    return { id: row.appointment_id, patient_id: row.patient_id, provider_id: row.provider_id, start_at: row.start_at, end_at: row.end_at };
  });
  waitlistService.notifyForFreedSlot(freed);
}

// Open times with the same provider and visit type, next RESCHEDULE_DAYS days.
async function slotsFor(token) {
  if (!TOKEN_RE.test(String(token))) throw httpError(404, 'This link is not valid.');
  const { rows } = await db.query(
    `SELECT a.provider_id, a.appointment_type_id
     FROM appointment_link_tokens t JOIN appointments a ON a.id = t.appointment_id
     WHERE t.token_hash = $1 AND t.used_at IS NULL AND t.expires_at > now() AND a.status = 'booked'`,
    [sha256(token)]
  );
  if (!rows[0]) throw httpError(410, 'This link has already been used or has expired.');
  const from = new Date().toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
  const toDate = new Date(Date.now() + (RESCHEDULE_DAYS - 1) * 864e5).toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
  const slots = await generateSlots({ appointmentTypeId: rows[0].appointment_type_id, from, to: toDate, providerId: rows[0].provider_id });
  return slots.map((s) => ({ start_at: s.start_at, date: s.date, start_time: s.start_time, end_time: s.end_time }));
}

async function reschedule(token, startAt) {
  const { booked, replaced, patientId } = await inTransaction(async (client) => {
    const row = await lockUsable(client, token);
    const out = await bookSlotWithClient(client, {
      patientId: row.patient_id, providerId: row.provider_id, appointmentTypeId: row.appointment_type_id,
      startAt, bookedBy: 'patient', replaceAppointmentId: row.appointment_id,
    });
    await markUsed(client, row.token_id, 'reschedule');
    return { ...out, patientId: row.patient_id };
  });
  sendConfirmation(patientId, booked);
  waitlistService.notifyForFreedSlot(replaced);
  return { date: booked.date, start_time: booked.start_time, end_time: booked.end_time };
}

async function setRemindersFromLink(u, s, enabled) {
  const accountId = verifyStop(u, s);
  if (!accountId) throw httpError(404, 'This link is not valid.');
  const { rowCount } = await db.query(
    `UPDATE accounts SET reminder_emails = $2 WHERE id = $1 AND role = 'patient'`, [accountId, enabled]
  );
  if (!rowCount) throw httpError(404, 'This link is not valid.');
}

module.exports = {
  createToken, appointmentLinks, stopRemindersLink, verifyStop,
  peek, confirm, cancel, slotsFor, reschedule, setRemindersFromLink,
};
