// Appointments are stored as timestamptz; "which day is it" depends on the clinic's timezone.
const tz = process.env.CLINIC_TIMEZONE || 'America/Los_Angeles';
if (!/^[A-Za-z_]+(\/[A-Za-z_+-]+)*$/.test(tz)) {
  throw new Error(`Invalid CLINIC_TIMEZONE "${tz}"`);
}
const CLINIC_TZ = tz;
const todayInClinic = () => new Date().toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
module.exports = { CLINIC_TZ, todayInClinic };
