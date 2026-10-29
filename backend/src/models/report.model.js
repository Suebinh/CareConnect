const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

// Reads ONLY the de-identified view (migration 003), never accounts/appointments directly.
const LABEL = {
  physician: 'provider_name',
  day: `to_char(start_at AT TIME ZONE '${CLINIC_TZ}', 'FMDay')`,
  type: 'appointment_type',
};

// Rate = no-shows / (completed + no-shows). Cancelled appointments are excluded.
async function noShowRate({ groupBy, from, to }) {
  const params = [];
  let dateFilter = '';
  if (from && to) {
    params.push(from, to);
    dateFilter = `AND (start_at AT TIME ZONE '${CLINIC_TZ}')::date BETWEEN $1::date AND $2::date`;
  }
  const result = await db.query(
    `SELECT ${LABEL[groupBy]} AS label,
            COUNT(*) FILTER (WHERE status = 'no_show')::int AS no_shows,
            COUNT(*)::int AS total_appointments,
            ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'no_show') / COUNT(*), 1)::float AS no_show_rate_pct
     FROM analyst_appointments
     WHERE status IN ('completed', 'no_show') ${dateFilter}
     GROUP BY 1
     ORDER BY no_show_rate_pct DESC, label`,
    params
  );
  return result.rows;
}
module.exports = { noShowRate };
