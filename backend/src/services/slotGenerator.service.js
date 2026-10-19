// Turns a provider's recurring weekly availability + blocked time +
// appointment-type durations into a concrete list of bookable time
// slots for a given date range (sprint log #74, #419). Re-run whenever
// recurring rules or blocked time change, so the calendar stays correct
// (sprint log #75, #420).

async function generateSlots({ providerId, from, to }) {
  // TODO:
  // 1. load recurring rules for providerId (availability.model.getRecurringRules)
  // 2. load blocked time in [from, to] (availability.model.getBlockedTime)
  // 3. load existing booked appointments in [from, to]
  // 4. expand recurring rules into slots, subtract blocked time and booked slots
  throw new Error('Not implemented: slotGenerator.service.generateSlots');
}

module.exports = { generateSlots };
