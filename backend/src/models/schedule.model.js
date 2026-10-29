const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

// staff_relationships(physician_id, staff_id):
//  - A Nurse supports the providers in physician_id (a Physician or PA).
//  - A Physician supervises the PAs/Nurses in staff_id.
const DIRECTIONS = {
  nurse: { self: 'staff_id', provider: 'physician_id' },
  physician: { self: 'physician_id', provider: 'staff_id' },
};
const SUPPORTED_ROLES = Object.keys(DIRECTIONS);

async function findRelatedSchedule(role, userId, date) {
  const { self, provider } = DIRECTIONS[role]; // fixed constants, never user input

  const providers = await db.query(
    `SELECT prov.id, prov.name, prov.role
     FROM staff_relationships sr JOIN accounts prov ON prov.id = sr.${provider}
     WHERE sr.${self} = $1 ORDER BY prov.name`,
    [userId]
  );

  const appointments = await db.query(
    `SELECT a.id,
            to_char(a.start_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS start_time,
            to_char(a.end_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS end_time,
            a.status, a.requires_sign_off,
            t.name AS appointment_type,
            pt.name AS patient_name,
            prov.id AS provider_id, prov.name AS provider_name, prov.role AS provider_role
     FROM staff_relationships sr
     JOIN accounts prov ON prov.id = sr.${provider}
     JOIN appointments a ON a.provider_id = prov.id
     JOIN accounts pt ON pt.id = a.patient_id
     JOIN appointment_types t ON t.id = a.appointment_type_id
     WHERE sr.${self} = $1
       AND a.status <> 'cancelled'
       AND a.start_at >= (($2::date)::timestamp AT TIME ZONE '${CLINIC_TZ}')
       AND a.start_at <  (($2::date + 1)::timestamp AT TIME ZONE '${CLINIC_TZ}')
     ORDER BY a.start_at, prov.name`,
    [userId, date]
  );
  return { providers: providers.rows, appointments: appointments.rows };
}
module.exports = { SUPPORTED_ROLES, findRelatedSchedule };
