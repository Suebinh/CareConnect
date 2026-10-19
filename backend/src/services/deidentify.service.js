// Every Data Analyst-facing query must go through here rather than the
// raw appointments/accounts tables — sprint log #228-230, CLAUDE.md
// HIPAA constraint ("de-identified data for the Data Analyst role").

async function stripIdentifiers(rows) {
  // TODO: remove patient name/email/phone/contact fields from each row
  // before it reaches a reports.controller response. Prefer doing this
  // at the SQL layer with a dedicated de-identified view/materialized
  // view, and treat this function as the last-line guard.
  throw new Error('Not implemented: deidentify.service.stripIdentifiers');
}

module.exports = { stripIdentifiers };
