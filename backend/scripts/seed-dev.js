// Fake demo data. Every email ends in @test.careconnect.dev so it's easy to find and delete.
require('../src/config/loadEnv');
const bcrypt = require('bcrypt');
const db = require('../src/config/db');
const { CLINIC_TZ } = require('../src/config/clinic');

const PASSWORD = 'Test@1234';
const DOMAIN = '@test.careconnect.dev';
const PEOPLE = [
  ['physician', 'physician', 'Dr. Pat Physician'],
  ['pa', 'physician_assistant', 'Sam Assistant'],
  ['nurse', 'nurse', 'Nia Nurse'],
  ['nurse2', 'nurse', 'Noor Other-Nurse'],
  ['analyst', 'data_analyst', 'Avery Analyst'],
  ['patient1', 'patient', 'Alex Rivera'],
  ['patient2', 'patient', 'Jordan Lee'],
  ['patient3', 'patient', 'Taylor Kim'],
];

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  const ids = {};
  for (const [key, role, name] of PEOPLE) {
    const email = key + DOMAIN;
    await db.query(
      `INSERT INTO accounts (email, password_hash, role, name, phone)
       VALUES ($1, $2, $3, $4, '5551234567') ON CONFLICT (email) DO NOTHING`,
      [email, hash, role, name]
    );
    ids[key] = (await db.query('SELECT id FROM accounts WHERE email = $1', [email])).rows[0].id;
  }

  // Nia supports the physician and the PA. Noor (nurse2) supports nobody, to prove the access rule.
  const link = 'INSERT INTO staff_relationships (physician_id, staff_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
  await db.query(link, [ids.physician, ids.nurse]);
  await db.query(link, [ids.pa, ids.nurse]);
  await db.query(link, [ids.physician, ids.pa]);

  await db.query(`INSERT INTO appointment_types (name) VALUES ('Checkup'), ('Follow-up'), ('Consult')
                  ON CONFLICT (name) DO NOTHING`);
  const types = (await db.query(
    `SELECT id FROM appointment_types WHERE name IN ('Checkup','Follow-up','Consult') ORDER BY name`
  )).rows.map((r) => r.id);

  const patients = [ids.patient1, ids.patient2, ids.patient3];
  const existing = (await db.query(
    'SELECT COUNT(*)::int AS n FROM appointments WHERE patient_id = ANY($1)', [patients]
  )).rows[0].n;

  if (existing === 0) {
    const past = ['completed', 'completed', 'no_show', 'completed', 'cancelled'];
    let n = 0;
    for (let daysAgo = -3; daysAgo <= 28; daysAgo++) {
      const day = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
      for (const [provider, isPa] of [[ids.physician, false], [ids.pa, true]]) {
        for (const [start, end] of [['09:00', '09:30'], ['10:30', '11:00']]) {
          await db.query(
            `INSERT INTO appointments
               (patient_id, provider_id, appointment_type_id, start_at, end_at, status, booked_by, requires_sign_off)
             VALUES ($1, $2, $3,
                     (($4::date + $5::time) AT TIME ZONE '${CLINIC_TZ}'),
                     (($4::date + $6::time) AT TIME ZONE '${CLINIC_TZ}'),
                     $7, $8, $9)`,
            [patients[n % 3], provider, types[n % 3], day, start, end,
             daysAgo <= 0 ? 'booked' : past[n % past.length],
             n % 2 ? 'patient' : 'receptionist', isPa]
          );
          n++;
        }
      }
    }
  }
  console.log(`Seeded. Demo logins: nurse${DOMAIN}, analyst${DOMAIN}, nurse2${DOMAIN}  password: ${PASSWORD}`);
  await db.pool.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
