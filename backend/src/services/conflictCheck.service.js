// Rejects overlapping bookings at write-time. Used by
// appointments.controller.bookAppointment and rescheduleAppointment
// (sprint log #77-78, #312, #480, #497-498). Must run inside the same
// DB transaction as the insert/update to close the race between two
// patients booking the same slot (sprint log #80, #314, #500).

async function hasConflict({ providerId, start, end, excludeAppointmentId }) {
  // TODO: query appointments for this provider where the time ranges
  // overlap and status != 'cancelled', excluding excludeAppointmentId
  // when rescheduling.
  throw new Error('Not implemented: conflictCheck.service.hasConflict');
}

module.exports = { hasConflict };
