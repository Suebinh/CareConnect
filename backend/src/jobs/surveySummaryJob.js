// Weekly job: compile survey results, email summary to Process Manager
// (sprint log #388-390).

async function runWeeklySurveySummary() {
  // TODO:
  // 1. surveyResult.model.getAggregates({ from: lastWeekStart, to: lastWeekEnd })
  // 2. email the summary to accounts with role = 'process_manager'
  throw new Error('Not implemented: surveySummaryJob.runWeeklySurveySummary');
}

module.exports = { runWeeklySurveySummary };
