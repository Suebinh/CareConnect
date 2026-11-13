// When an appointment is cancelled, email waitlisted patients that the slot
// opened up (first come, first served: they book it through the normal flow).
// Called after the cancel has already succeeded; a failed email must never
// undo or fail the cancellation, so errors are logged, not thrown.

const waitlistModel = require('../models/waitlist.model');
const emailService = require('./email.service');
const { CLINIC_TZ, CLINIC_LOCATION } = require('../config/clinic');

function formatSlot(startAt) {
  const d = new Date(startAt);
  return {
    date: d.toLocaleDateString('en-US', { timeZone: CLINIC_TZ, weekday: 'long', month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { timeZone: CLINIC_TZ, hour: 'numeric', minute: '2-digit' }),
  };
}

async function notifyForFreedSlot(appointment) {
  try {
    const matches = await waitlistModel.claimMatchesForSlot({
      providerId: appointment.provider_id,
      startAt: appointment.start_at,
      endAt: appointment.end_at,
      excludePatientId: appointment.patient_id,
    });
    const { date, time } = formatSlot(appointment.start_at);
    const bookLink = (process.env.FRONTEND_URL || 'http://localhost:4000').replace(/\/$/, '') + '/pages/patient-login.html';

    const results = await Promise.allSettled(
      matches.map((m) => emailService.sendWaitlistOpening(m.email, { date, time, location: CLINIC_LOCATION, bookLink }))
    );
    const failed = results.filter((r) => r.status === 'rejected').length;
    // Log counts only, never emails or names (no PHI in logs).
    console.log(`[waitlist] appointment ${appointment.id} freed: ${matches.length} notified, ${failed} failed`);
    return { notified: matches.length - failed, failed };
  } catch (err) {
    console.error('[waitlist] notify failed for appointment', appointment.id, err.message);
    return { notified: 0, failed: 0 };
  }
}

module.exports = { notifyForFreedSlot };
