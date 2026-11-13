// Appointments are stored as timestamptz; "which day is it" depends on the clinic's timezone.
const tz = process.env.CLINIC_TIMEZONE || 'America/Los_Angeles';
if (!/^[A-Za-z_]+(\/[A-Za-z_+-]+)*$/.test(tz)) {
  throw new Error(`Invalid CLINIC_TIMEZONE "${tz}"`);
}
const CLINIC_TZ = tz;
const todayInClinic = () => new Date().toLocaleDateString('en-CA', { timeZone: CLINIC_TZ });
// Shown in patient emails (date/time/location only, never the visit reason).
const CLINIC_LOCATION = process.env.CLINIC_LOCATION || 'CareConnect Clinic, Suite 200';
// Front desk number shown in reminder emails and on the appointment link page.
const CLINIC_PHONE = process.env.CLINIC_PHONE || '(555) 201-0100';
module.exports = { CLINIC_TZ, todayInClinic, CLINIC_LOCATION, CLINIC_PHONE };
