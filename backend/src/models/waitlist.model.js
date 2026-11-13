const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

// waitlist_entries: a patient asks to be emailed if a slot opens between
// date_from and date_to, optionally with one specific provider.
// patientId always comes from the session, never the request (HIPAA).

const MAX_PER_OPENING = 5; // how many waitlisted patients one freed slot emails

async function findActiveByPatient(patientId) {
  const result = await db.query(
    `SELECT w.id,
            to_char(w.date_from, 'YYYY-MM-DD') AS date_from,
            to_char(w.date_to, 'YYYY-MM-DD') AS date_to,
            w.provider_id, prov.name AS provider_name,
            t.name AS appointment_type,
            w.last_notified_at, w.created_at
     FROM waitlist_entries w
     JOIN appointment_types t ON t.id = w.appointment_type_id
     LEFT JOIN accounts prov ON prov.id = w.provider_id
     WHERE w.patient_id = $1
       AND w.status = 'active'
       AND w.date_to >= (now() AT TIME ZONE '${CLINIC_TZ}')::date
     ORDER BY w.date_from, w.id`,
    [patientId]
  );
  return result.rows;
}

async function create({ patientId, providerId, appointmentTypeId, dateFrom, dateTo }) {
  const result = await db.query(
    `INSERT INTO waitlist_entries (patient_id, provider_id, appointment_type_id, date_from, date_to)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [patientId, providerId, appointmentTypeId, dateFrom, dateTo]
  );
  return result.rows[0];
}

// Soft delete, scoped to the owner. Returns false if it isn't theirs / doesn't exist.
async function remove(id, patientId) {
  const result = await db.query(
    `UPDATE waitlist_entries SET status = 'removed'
     WHERE id = $1 AND patient_id = $2 AND status = 'active' RETURNING id`,
    [id, patientId]
  );
  return result.rowCount > 0;
}

async function providerIsBookable(providerId) {
  const result = await db.query(
    `SELECT 1 FROM accounts WHERE id = $1 AND role IN ('physician', 'physician_assistant') AND status = 'active'`,
    [providerId]
  );
  return result.rowCount > 0;
}

async function appointmentTypeExists(typeId) {
  const result = await db.query('SELECT 1 FROM appointment_types WHERE id = $1', [typeId]);
  return result.rowCount > 0;
}

// Waitlisted patients who fit a freed slot, oldest request first, one row per
// patient. A slot fits when it's with their provider (or they said "any"),
// falls inside their date window, and is long enough for their appointment
// type with that provider. The patient who cancelled is skipped.
// Marks the chosen entries notified in the same statement.
async function claimMatchesForSlot({ providerId, startAt, endAt, excludePatientId }) {
  const result = await db.query(
    `WITH matches AS (
       SELECT DISTINCT ON (w.patient_id) w.id, w.patient_id, w.created_at
       FROM waitlist_entries w
       JOIN accounts pt ON pt.id = w.patient_id AND pt.status = 'active'
       LEFT JOIN provider_appointment_durations d
              ON d.provider_id = $1 AND d.appointment_type_id = w.appointment_type_id
       WHERE w.status = 'active'
         AND (w.provider_id IS NULL OR w.provider_id = $1)
         AND w.patient_id <> $4
         AND ($2::timestamptz AT TIME ZONE '${CLINIC_TZ}')::date BETWEEN w.date_from AND w.date_to
         AND COALESCE(d.duration_minutes, 0) <= EXTRACT(EPOCH FROM ($3::timestamptz - $2::timestamptz)) / 60
       ORDER BY w.patient_id, w.created_at
     ),
     chosen AS (
       SELECT id FROM matches ORDER BY created_at LIMIT ${MAX_PER_OPENING}
     )
     UPDATE waitlist_entries w SET last_notified_at = now()
     FROM chosen, accounts pt
     WHERE w.id = chosen.id AND pt.id = w.patient_id
     RETURNING w.id, pt.email`,
    [providerId, startAt, endAt, excludePatientId]
  );
  return result.rows;
}

module.exports = {
  MAX_PER_OPENING,
  findActiveByPatient,
  create,
  remove,
  providerIsBookable,
  appointmentTypeExists,
  claimMatchesForSlot,
};
