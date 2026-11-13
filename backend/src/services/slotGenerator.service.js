// Turns providers' recurring weekly availability + blocked time + appointment-
// type durations into concrete bookable time slots (sprint log #74, #305, #307,
// #419). Computed on demand from the rules, so changing availability or
// blocking time off is reflected immediately (#75, #420) with nothing to re-run.
//
// All the work happens in one SQL query:
//   1. each day in [from, to] x each matching weekly rule = an availability window
//      (rule times are clinic-local; AT TIME ZONE turns them into real instants,
//      so daylight-saving changes are handled)
//   2. each window is cut into slots of the type's length, starting every SLOT_STEP
//   3. slots in the past, overlapping blocked time, or overlapping a
//      non-cancelled appointment are dropped

const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

const SLOT_STEP_MINUTES = 30;       // a new slot can start every 30 minutes
const DEFAULT_DURATION_MINUTES = 30; // if a provider hasn't set a length for this type

const BOOKABLE_ROLES = ['physician', 'physician_assistant'];

// filters: { appointmentTypeId (required), from, to (YYYY-MM-DD, clinic dates),
//            providerId?, specialty? }
// Returns [{ provider_id, provider_name, provider_role, provider_specialty,
//            start_at (ISO), date, start_time, end_time, duration_minutes }]
async function generateSlots({ appointmentTypeId, from, to, providerId = null, specialty = null }, client = db) {
  const result = await client.query(
    `WITH providers AS (
       SELECT p.id, p.name, p.role, p.specialty,
              COALESCE(d.duration_minutes, ${DEFAULT_DURATION_MINUTES}) AS mins
       FROM accounts p
       LEFT JOIN provider_appointment_durations d
              ON d.provider_id = p.id AND d.appointment_type_id = $1
       WHERE p.role = ANY($4) AND p.status = 'active'
         AND ($5::int IS NULL OR p.id = $5)
         AND ($6::text IS NULL OR lower(p.specialty) = lower($6))
     ),
     windows AS (
       SELECT pr.*,
              ((day::date + r.start_time) AT TIME ZONE '${CLINIC_TZ}') AS w_start,
              ((day::date + r.end_time) AT TIME ZONE '${CLINIC_TZ}') AS w_end
       FROM generate_series($2::date, $3::date, interval '1 day') AS day
       JOIN availability_rules r ON r.day_of_week = EXTRACT(DOW FROM day)
                                AND (r.effective_until IS NULL OR day::date <= r.effective_until)
       JOIN providers pr ON pr.id = r.provider_id
     ),
     slots AS (
       SELECT w.id, w.name, w.role, w.specialty, w.mins,
              s AS start_at, s + make_interval(mins => w.mins) AS end_at
       FROM windows w,
            generate_series(w.w_start, w.w_end - make_interval(mins => w.mins),
                            interval '${SLOT_STEP_MINUTES} minutes') AS s
     )
     SELECT DISTINCT ON (s.id, s.start_at)
            s.id AS provider_id, s.name AS provider_name, s.role AS provider_role,
            s.specialty AS provider_specialty, s.mins AS duration_minutes,
            s.start_at,
            to_char(s.start_at AT TIME ZONE '${CLINIC_TZ}', 'YYYY-MM-DD') AS date,
            to_char(s.start_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS start_time,
            to_char(s.end_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS end_time
     FROM slots s
     WHERE s.start_at > now()
       AND NOT EXISTS (
         SELECT 1 FROM appointments a
         WHERE a.provider_id = s.id AND a.status <> 'cancelled'
           AND a.start_at < s.end_at AND a.end_at > s.start_at)
       AND NOT EXISTS (
         SELECT 1 FROM blocked_time b
         WHERE b.provider_id = s.id
           AND b.start_at < s.end_at AND b.end_at > s.start_at)
     ORDER BY s.start_at, s.id`,
    [appointmentTypeId, from, to, BOOKABLE_ROLES, providerId, specialty]
  );
  return result.rows;
}

module.exports = { generateSlots, BOOKABLE_ROLES, SLOT_STEP_MINUTES };
