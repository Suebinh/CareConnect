// Parses a JWT_EXPIRES_IN-style string ("1h", "15m", "7d", "30s") into
// milliseconds, so the session row's expiry matches the JWT's expiry.
const UNIT_MS = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

function parseDurationMs(input) {
  const match = /^(\d+)([smhd])$/.exec(String(input).trim());
  if (!match) {
    throw new Error(`Invalid duration "${input}" — expected e.g. "1h", "15m", "7d"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit];
}

module.exports = { parseDurationMs };
