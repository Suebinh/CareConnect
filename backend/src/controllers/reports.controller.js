const reportModel = require('../models/report.model');
const deidentifyService = require('../services/deidentify.service');
const { isValidDate } = require('../utils/validate');

const GROUP_BY = ['physician', 'day', 'type'];

// All of these must read from the de-identified view, never the raw patient tables
// (sprint log #228-230, CLAUDE.md HIPAA constraint).

// TODO: count appointments booked per week (sprint log #254)
async function appointmentsPerWeek(req, res, next) {
  res.status(501).json({ error: 'Not implemented: appointmentsPerWeek' });
}

// GET /api/reports/no-show-rate?groupBy=physician|day|type&from=YYYY-MM-DD&to=YYYY-MM-DD
// Sprint log #248-249. Cancelled appointments are excluded.
async function noShowRate(req, res, next) {
  try {
    const groupBy = req.query.groupBy || 'physician';
    if (!GROUP_BY.includes(groupBy)) {
      return res.status(400).json({ error: 'groupBy must be physician, day, or type' });
    }
    const { from, to } = req.query;
    if ((from || to) && !(isValidDate(from) && isValidDate(to))) {
      return res.status(400).json({ error: 'from and to must both be valid YYYY-MM-DD dates' });
    }
    const rows = await reportModel.noShowRate({ groupBy, from, to });
    res.json({ groupBy, results: await deidentifyService.stripIdentifiers(rows) });
  } catch (err) { next(err); }
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

module.exports = { appointmentsPerWeek, noShowRate, rawAppointmentData, surveyResults, exportReport };
