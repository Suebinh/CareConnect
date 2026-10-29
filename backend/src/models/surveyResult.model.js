// Query via require('../config/db').query(text, params).
// Stores aggregated scores only — never raw per-respondent identifiable
// answers (sprint log #238: "aggregated scores only").

async function getAggregates({ from, to }) {
  // TODO: SELECT * FROM survey_results WHERE period BETWEEN $1 AND $2
  throw new Error('Not implemented: surveyResult.model.getAggregates');
}

module.exports = { getAggregates };
