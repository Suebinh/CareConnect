// TODO: filter open slots by physician/date/specialty, excluding blocked
// and already-booked slots (sprint log #305-307)
async function searchOpenSlots(req, res, next) {
  res.status(501).json({ error: 'Not implemented: searchOpenSlots' });
}

// TODO: scope strictly to req.user.id, never a URL param — see CLAUDE.md
// HIPAA constraint (sprint log #327, #332)
async function getMyAppointments(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getMyAppointments' });
}

// TODO: run services/conflictCheck.service.js before writing, reject
// overlaps (sprint log #311-312, #478-480, #497-498)
async function bookAppointment(req, res, next) {
  res.status(501).json({ error: 'Not implemented: bookAppointment' });
}

// TODO: move appointment, free original slot (sprint log #323, #485)
async function rescheduleAppointment(req, res, next) {
  res.status(501).json({ error: 'Not implemented: rescheduleAppointment' });
}

// TODO: set status=cancelled, free slot, exclude from no-show reporting
// (sprint log #342-344, #507-508)
async function cancelAppointment(req, res, next) {
  res.status(501).json({ error: 'Not implemented: cancelAppointment' });
}

// TODO: set completed/no-show/cancelled (sprint log #96, #438)
async function updateStatus(req, res, next) {
  res.status(501).json({ error: 'Not implemented: updateStatus' });
}

// TODO: mark PA-led visit as signed off by supervising Physician
// (sprint log #276, #443)
async function signOff(req, res, next) {
  res.status(501).json({ error: 'Not implemented: signOff' });
}

// TODO: save note linked to appointment/author/timestamp, RBAC-gated
// (sprint log #216-217)
async function addVisitNote(req, res, next) {
  res.status(501).json({ error: 'Not implemented: addVisitNote' });
}

// TODO: fetch notes for an appointment, never visible to patients
// (sprint log #217-218)
async function getVisitNotes(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getVisitNotes' });
}

module.exports = {
  searchOpenSlots,
  getMyAppointments,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  updateStatus,
  signOff,
  addVisitNote,
  getVisitNotes,
};
