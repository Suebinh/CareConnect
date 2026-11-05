// Fills the database with made-up demo data so every dashboard has something to show.
// All people are fictional; all emails are @example.com. Every seeded login uses
// the password CareDemo2026!
//
//   npm run seed:demo            # add demo data (refuses if it's already there)
//   npm run seed:demo -- --reset # delete the previous demo data first, then re-seed
//
// Appointments span ~6 weeks back to ~2 weeks ahead of the day you run it, so
// "today" on the nurse schedule always has visits.
require('../src/config/loadEnv');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { CLINIC_TZ } = require('../src/config/clinic');

const PASSWORD = 'CareDemo2026!';
const DEMO_LOGINS = ['demo.nurse@example.com', 'demo.data@example.com', 'demo.patient@example.com'];

// Deterministic random so every run produces the same-looking clinic.
let seed = 495;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const PROVIDERS = [
  { key: 'patel', email: 'dr.patel@example.com', name: 'Dr. Maya Patel', role: 'physician', specialty: 'Family Medicine', noShow: 0.08 },
  { key: 'okafor', email: 'dr.okafor@example.com', name: 'Dr. James Okafor', role: 'physician', specialty: 'Pediatrics', noShow: 0.17 },
  { key: 'reyes', email: 'jordan.reyes@example.com', name: 'Jordan Reyes, PA-C', role: 'physician_assistant', specialty: 'Family Medicine', noShow: 0.12 },
];
const TYPES = [
  { name: 'New Patient', minutes: 60, noShow: 0.06, weight: 2 },
  { name: 'Follow-up', minutes: 30, noShow: 0.0, weight: 5 },
  { name: 'Annual Physical', minutes: 60, noShow: -0.04, weight: 2 },
  { name: 'Sick Visit', minutes: 30, noShow: 0.03, weight: 3 },
];
const DAY_NO_SHOW = { 1: 0.07, 2: 0.0, 3: -0.02, 4: 0.01, 5: 0.05 }; // Mon..Fri
const PATIENT_NAMES = [
  'Olivia Bennett', 'Marcus Hall', 'Priya Shah', 'Ethan Brooks', 'Sofia Romero', 'Liam Chen',
  'Hannah Kim', 'Diego Alvarez', 'Grace Thompson', 'Noah Williams', 'Aisha Mohammed',
  'Lucas Martin', 'Emma Rodriguez', 'Ben Foster', 'Chloe Nguyen',
];

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
const todayInClinic = () => new Date().toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });

async function main() {
  const reset = process.argv.includes('--reset');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = await pool.connect();
  try {
    await db.query('BEGIN');

    const existing = await db.query("SELECT count(*)::int AS n FROM accounts WHERE email = 'dr.patel@example.com'");
    if (existing.rows[0].n && !reset) {
      throw new Error('Demo data is already loaded. Re-run with --reset to replace it.');
    }
    if (reset) await clearDemo(db);

    const hash = await bcrypt.hash(PASSWORD, 10);
    const upsertAccount = async ({ email, role, name, phone, specialty = null, dob = null }) => {
      const r = await db.query(
        `INSERT INTO accounts (email, password_hash, role, name, phone, specialty, date_of_birth, email_verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now())
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone,
           specialty = EXCLUDED.specialty, date_of_birth = EXCLUDED.date_of_birth
         RETURNING id`,
        [email, hash, role, name, phone, specialty, dob]
      );
      return r.rows[0].id;
    };

    // Demo logins: keep existing passwords, just give them realistic profile details.
    const nurseId = await upsertAccount({ email: 'demo.nurse@example.com', role: 'nurse', name: 'Taylor Brooks, RN', phone: '(555) 201-3344', specialty: 'Family Medicine' });
    await upsertAccount({ email: 'demo.data@example.com', role: 'data_analyst', name: 'Morgan Lee', phone: '(555) 201-8810' });
    const demoPatientId = await upsertAccount({ email: 'demo.patient@example.com', role: 'patient', name: 'Jamie Carter', phone: '(555) 340-1029', dob: '1994-06-12' });

    const prov = {};
    for (const p of PROVIDERS) {
      p.id = await upsertAccount({ ...p, phone: `(555) 100-${pad(PROVIDERS.indexOf(p) + 1)}00` });
      prov[p.key] = p;
    }
    const patientIds = [demoPatientId];
    for (const [i, name] of PATIENT_NAMES.entries()) {
      const email = 'patient.' + name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com';
      const dob = `${1950 + Math.floor(rand() * 60)}-${pad(1 + Math.floor(rand() * 12))}-${pad(1 + Math.floor(rand() * 28))}`;
      patientIds.push(await upsertAccount({ email, role: 'patient', name, phone: `(555) 4${pad(i)}-${1000 + i * 37}`, dob }));
    }

    // Nurse supports Dr. Patel and the PA; Dr. Patel supervises the PA.
    for (const [physician, staff] of [[prov.patel.id, nurseId], [prov.reyes.id, nurseId], [prov.patel.id, prov.reyes.id]]) {
      await db.query('INSERT INTO staff_relationships VALUES ($1, $2) ON CONFLICT DO NOTHING', [physician, staff]);
    }

    const typeIds = {};
    for (const t of TYPES) {
      const r = await db.query(
        'INSERT INTO appointment_types (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id', [t.name]);
      typeIds[t.name] = r.rows[0].id;
    }
    for (const p of PROVIDERS) {
      for (const t of TYPES) {
        await db.query('INSERT INTO provider_appointment_durations VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [p.id, typeIds[t.name], t.minutes]);
      }
      for (let dow = 1; dow <= 5; dow++) {
        await db.query("INSERT INTO availability_rules (provider_id, day_of_week, start_time, end_time) VALUES ($1, $2, '09:00', '17:00')", [p.id, dow]);
      }
    }

    // Appointments: weekdays from 6 weeks ago to 2 weeks ahead.
    const today = todayInClinic();
    const weightedTypes = TYPES.flatMap((t) => Array(t.weight).fill(t));
    const start = new Date(today + 'T12:00:00');
    start.setDate(start.getDate() - 42);
    let count = 0;
    for (let d = new Date(start); count < 10000; d.setDate(d.getDate() + 1)) {
      const date = ymd(d);
      if (date > ymd(new Date(new Date(today + 'T12:00:00').getTime() + 14 * 864e5))) break;
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue;

      for (const p of PROVIDERS) {
        const taken = new Set(); // 30-minute slot indexes, 9:00..16:30
        const visits = 6 + Math.floor(rand() * 4);
        for (let v = 0; v < visits; v++) {
          const type = pick(weightedTypes);
          const slots = type.minutes / 30;
          const slot = Math.floor(rand() * (16 - slots + 1));
          if ([...Array(slots).keys()].some((k) => taken.has(slot + k))) continue;
          for (let k = 0; k < slots; k++) taken.add(slot + k);

          const startMin = 9 * 60 + slot * 30;
          const isPast = date < today || (date === today && startMin < 12 * 60);
          let status = 'booked';
          if (isPast) {
            const roll = rand();
            const noShow = Math.max(0.02, p.noShow + type.noShow + DAY_NO_SHOW[dow]);
            status = roll < 0.07 ? 'cancelled' : roll < 0.07 + noShow ? 'no_show' : 'completed';
          } else if (rand() < 0.05) {
            status = 'cancelled';
          }
          const needsSignOff = p.role === 'physician_assistant';
          const signed = needsSignOff && status === 'completed';
          await db.query(
            `INSERT INTO appointments (patient_id, provider_id, appointment_type_id, start_at, end_at, status,
                                       booked_by, requires_sign_off, signed_off_by, signed_off_at)
             VALUES ($1, $2, $3, ($4::timestamp AT TIME ZONE '${CLINIC_TZ}'), ($5::timestamp AT TIME ZONE '${CLINIC_TZ}'),
                     $6, $7, $8, $9, CASE WHEN $10 THEN ($5::timestamp AT TIME ZONE '${CLINIC_TZ}') + interval '2 hours' END)`,
            [pick(patientIds.slice(1)), p.id, typeIds[type.name], `${date} ${hm(startMin)}`, `${date} ${hm(startMin + type.minutes)}`,
             status, rand() < 0.6 ? 'patient' : 'receptionist', needsSignOff, signed ? prov.patel.id : null, signed]
          );
          count++;
        }
      }
    }

    // A few visits for Jamie Carter (the demo patient), at times outside the 9-5 slots so they never overlap.
    const demoVisits = [[-35, '07:30', 'Annual Physical', 'completed', 'patel'], [-14, '08:00', 'Follow-up', 'completed', 'patel'],
                        [-3, '08:30', 'Sick Visit', 'no_show', 'reyes'], [2, '08:00', 'Follow-up', 'booked', 'patel'],
                        [16, '07:30', 'Annual Physical', 'booked', 'reyes']];
    for (const [offset, time, typeName, status, providerKey] of demoVisits) {
      const d = new Date(today + 'T12:00:00');
      d.setDate(d.getDate() + offset);
      while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + (offset < 0 ? -1 : 1)); // clinic is closed weekends
      const mins = TYPES.find((t) => t.name === typeName).minutes;
      const [h, m] = time.split(':').map(Number);
      await db.query(
        `INSERT INTO appointments (patient_id, provider_id, appointment_type_id, start_at, end_at, status, booked_by)
         VALUES ($1, $2, $3, ($4::timestamp AT TIME ZONE '${CLINIC_TZ}'), ($5::timestamp AT TIME ZONE '${CLINIC_TZ}'), $6, 'patient')`,
        [demoPatientId, prov[providerKey].id, typeIds[typeName], `${ymd(d)} ${time}`, `${ymd(d)} ${hm(h * 60 + m + mins)}`, status]
      );
      count++;
    }

    // Aggregated survey scores (no per-respondent rows, per the HIPAA notes).
    for (let w = 6; w >= 1; w--) {
      const end = new Date(today + 'T12:00:00'); end.setDate(end.getDate() - (w - 1) * 7 - 1);
      const begin = new Date(end); begin.setDate(begin.getDate() - 6);
      await db.query('INSERT INTO survey_results (respondent_role, period_start, period_end, avg_score, response_count) VALUES ($1,$2,$3,$4,$5),($6,$2,$3,$7,$8)',
        ['patient', ymd(begin), ymd(end), (4 + rand() * 0.8).toFixed(2), 20 + Math.floor(rand() * 25),
         'staff', (3.6 + rand() * 1).toFixed(2), 6 + Math.floor(rand() * 6)]);
    }

    await db.query('COMMIT');
    console.log(`Seeded ${PROVIDERS.length} providers, ${PATIENT_NAMES.length} patients, ${count} appointments. Password for every demo login: ${PASSWORD}`);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    db.release();
    await pool.end();
  }
}

// Removes everything this script created. The three demo logins stay (with their profile details).
async function clearDemo(db) {
  const seeded = `SELECT id FROM accounts WHERE email LIKE '%@example.com' AND email <> ALL($1)`;
  const demo = `SELECT id FROM accounts WHERE email LIKE '%@example.com'`;
  await db.query(`DELETE FROM visit_notes WHERE appointment_id IN (SELECT id FROM appointments WHERE provider_id IN (${demo}) OR patient_id IN (${demo}))`);
  await db.query(`DELETE FROM reminders WHERE appointment_id IN (SELECT id FROM appointments WHERE provider_id IN (${demo}) OR patient_id IN (${demo}))`);
  await db.query(`DELETE FROM appointments WHERE provider_id IN (${demo}) OR patient_id IN (${demo})`);
  await db.query(`DELETE FROM staff_relationships WHERE physician_id IN (${demo}) OR staff_id IN (${demo})`);
  await db.query(`DELETE FROM provider_appointment_durations WHERE provider_id IN (${demo})`);
  await db.query(`DELETE FROM availability_rules WHERE provider_id IN (${demo})`);
  await db.query(`DELETE FROM sessions WHERE account_id IN (${seeded})`, [DEMO_LOGINS]);
  await db.query(`DELETE FROM password_reset_tokens WHERE account_id IN (${seeded})`, [DEMO_LOGINS]);
  await db.query(`DELETE FROM accounts WHERE id IN (${seeded})`, [DEMO_LOGINS]);
  await db.query('DELETE FROM survey_results');
}

main();
