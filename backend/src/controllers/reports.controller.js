// All of these must read from the de-identified view — see
// services/deidentify.service.js — never the raw patient tables
// (sprint log #228-230, CLAUDE.md HIPAA constraint).

// TODO: count appointments booked per week (sprint log #254)
async function appointmentsPerWeek(req, res, next) {
  res.status(501).json({ error: 'Not implemented: appointmentsPerWeek' });
}

// TODO: no-show rate by physician/day-of-week/appointment type, excluding
// patient-cancelled appointments (sprint log #248-249)
async function noShowRate(req, res, next) {
  res.status(501).json({ error: 'Not implemented: noShowRate' });
}

// TODO: paginated raw appointment data with date/field filters (sprint log #244)
async function rawAppointmentData(req, res, next) {
  res.status(501).json({ error: 'Not implemented: rawAppointmentData' });
}

// TODO: aggregated patient/staff survey averages and trends (sprint log #239)
async function surveyResults(req, res, next) {
  res.status(501).json({ error: 'Not implemented: surveyResults' });
}

// TODO: generate PDF/CSV export, confirm no PHI in the file (sprint log #233-235)
async function exportReport(req, res, next) {
  res.status(501).json({ error: 'Not implemented: exportReport' });
}

module.exports = {
  appointmentsPerWeek,
  noShowRate,
  rawAppointmentData,
  surveyResults,
  exportReport,
};
