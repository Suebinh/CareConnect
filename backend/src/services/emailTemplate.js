// Branded HTML email layout shared by every patient email, matching the site:
// sky-blue header with the CareConnect pulse wordmark, white card, navy text,
// hot-pink accents, Manrope (falls back to system fonts where web fonts are blocked).
//
// Email clients ignore most modern CSS (no backdrop-filter, flaky gradients,
// Gmail strips <style> in some cases), so this uses tables + inline styles,
// with a solid sky-blue fallback under the gradient.
//
// HIPAA (CLAUDE.md): callers pass date/time/location only, never the visit
// type or reason. Every value is HTML-escaped here.

const BRAND = {
  sky: '#0593C6',
  skyDeep: '#0a86b8',
  pink: '#D83995',
  navy: '#062A3D',
  white: '#FCFFFF',
  muted: '#5b7482',
  line: '#e3eef3',
  font: "Manrope, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function siteUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:4000').replace(/\/$/, '');
}

// { preheader, eyebrow, heading, intro, details: [{label, value}], cta: {label, url},
//   note, footer }  ->  { html, text }
function renderEmail({ preheader = '', eyebrow = '', heading, intro = '', details = [], cta = null, note = '', footer = '' }) {
  const { sky, skyDeep, pink, navy, white, muted, line, font } = BRAND;

  const detailRows = details.map((d, i) => `
            <tr>
              <td style="padding:14px 0;${i ? `border-top:1px solid ${line};` : ''}font-family:${font};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${muted};width:96px;vertical-align:top;">${esc(d.label)}</td>
              <td style="padding:14px 0;${i ? `border-top:1px solid ${line};` : ''}font-family:${font};font-size:16px;font-weight:600;color:${navy};">${esc(d.value)}</td>
            </tr>`).join('');

  const ctaBlock = cta ? `
          <tr><td style="padding:8px 32px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td bgcolor="${navy}" style="border-radius:999px;">
                <a href="${esc(cta.url)}" style="display:inline-block;padding:14px 28px;font-family:${font};font-size:15px;font-weight:700;color:${white};text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
              </td>
            </tr></table>
          </td></tr>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(heading)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${sky};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${sky}" style="background:${sky};background-image:linear-gradient(180deg,${skyDeep} 0%,${sky} 45%,#0b7fb3 100%);">
  <tr><td align="center" style="padding:32px 16px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td style="padding:0 8px 24px;font-family:${font};font-size:20px;font-weight:700;color:${white};letter-spacing:-.01em;">
        <span style="color:${white};">&#x2571;&#x2572;&#x2571;</span>&nbsp; CareConnect
      </td></tr>
      <tr><td bgcolor="#ffffff" style="background:#ffffff;border-radius:24px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="height:6px;line-height:6px;font-size:0;background:${pink};background-image:linear-gradient(90deg,${pink},${sky});">&nbsp;</td></tr>
          <tr><td style="padding:32px 32px 8px;">
            ${eyebrow ? `<p style="margin:0 0 10px;font-family:${font};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${pink};">${esc(eyebrow)}</p>` : ''}
            <h1 style="margin:0;font-family:${font};font-size:28px;line-height:1.15;font-weight:600;letter-spacing:-.02em;color:${navy};">${esc(heading)}</h1>
            ${intro ? `<p style="margin:12px 0 0;font-family:${font};font-size:16px;line-height:1.55;color:${muted};">${esc(intro)}</p>` : ''}
          </td></tr>
          ${details.length ? `<tr><td style="padding:16px 32px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5fafc;border-radius:16px;padding:4px 20px;">
              <tr><td style="padding:4px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows}
              </table></td></tr>
            </table>
          </td></tr>` : ''}
          ${ctaBlock}
          ${note ? `<tr><td style="padding:16px 32px 32px;font-family:${font};font-size:14px;line-height:1.55;color:${muted};">${esc(note)}</td></tr>` : '<tr><td style="height:24px;"></td></tr>'}
        </table>
      </td></tr>
      <tr><td style="padding:24px 8px 0;font-family:${font};font-size:12px;line-height:1.6;color:rgba(252,255,255,.85);">
        ${esc(footer || 'You are receiving this because you have a CareConnect account.')}<br>
        CareConnect Clinic &middot; This message never includes the reason for your visit.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    heading,
    intro,
    details.map((d) => `${d.label}: ${d.value}`).join('\n'),
    cta ? `${cta.label}: ${cta.url}` : '',
    note,
  ].filter(Boolean).join('\n\n');

  return { html, text };
}

// ---------------------------------------------------------------------------
// Appointment reminder ("1b" design): glass card on the site's sky-blue
// gradient, date tile + big time, one-tap Confirm / Reschedule / Cancel, and
// calendar / directions / front-desk shortcuts.
//
// data: { preheader, badge, heading, month, day, weekday, time, location,
//         links: { confirm, reschedule, cancel, calendar }, directionsUrl,
//         phone, phoneHref, stopUrl }
// Only date, time, and location ever appear (HIPAA, CLAUDE.md).
function renderReminderEmail(d) {
  const { sky, skyDeep, navy, white, font } = BRAND;
  const W = (a) => `rgba(252,255,255,${a})`;
  const logo = `${siteUrl()}/images/email-logo.png`;

  const button = (label, href, { bg, fallback, color, border }, last) => `
                <td class="stack stack-gap" width="33%" style="padding:0 ${last ? 0 : 8}px 0 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td align="center" bgcolor="${fallback}" style="background:${bg};border:1px solid ${border};border-radius:999px;">
                      <a href="${esc(href)}" style="display:block;padding:14px 8px;font-family:${font};font-size:15px;font-weight:700;color:${color};text-decoration:none;border-radius:999px;">${esc(label)}</a>
                    </td>
                  </tr></table>
                </td>`;

  const shortcut = (label, text, href, last) => `
                <td class="stack${last ? ' last' : ''}" width="33%" style="padding:14px 16px;${last ? '' : `border-right:1px solid ${W(0.18)};`}">
                  <p style="margin:0;font-family:${font};font-size:12px;color:${W(0.7)};">${esc(label)}</p>
                  <a href="${esc(href)}" style="display:inline-block;margin-top:4px;font-family:${font};font-size:15px;font-weight:600;color:${white};text-decoration:none;">${esc(text)}</a>
                </td>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(d.heading)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  @media (max-width: 520px) {
    .stack { display: block !important; width: 100% !important; box-sizing: border-box; }
    .stack-gap { padding: 0 0 10px 0 !important; }
    .shortcuts .stack { border-right: 0 !important; border-bottom: 1px solid rgba(252,255,255,.18); }
    .shortcuts .last { border-bottom: 0 !important; }
    .card-pad { padding: 22px !important; }
    .time { font-size: 34px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${sky};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(d.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${sky}" style="background:${sky};background-image:linear-gradient(180deg,${skyDeep} 0%,${sky} 40%,#0b7fb3 100%);">
  <tr><td align="center" style="padding:28px 16px 36px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

      <!-- Header: logo + when badge -->
      <tr><td style="padding:0 4px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle"><img src="${esc(logo)}" width="162" height="32" alt="CareConnect" style="display:block;border:0;font-family:${font};font-size:18px;font-weight:600;color:${white};"></td>
          <td valign="middle" align="right">
            <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${W(0.18)};border:1px solid ${W(0.3)};font-family:${font};font-size:12px;font-weight:600;color:${white};white-space:nowrap;">${esc(d.badge)}</span>
          </td>
        </tr></table>
      </td></tr>

      <!-- Glass card -->
      <tr><td bgcolor="#2fa6d2" style="background:${W(0.16)};border:1px solid ${W(0.28)};border-radius:28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="card-pad" style="padding:28px;">

            <!-- Date tile + time + location -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="84" align="center" valign="middle" bgcolor="#4cb4dc" style="width:84px;background:${W(0.22)};border:1px solid ${W(0.3)};border-radius:20px;padding:10px 0;">
                <p style="margin:0;font-family:${font};font-size:13px;font-weight:600;color:${W(0.85)};">${esc(d.month)}</p>
                <p style="margin:2px 0;font-family:${font};font-size:38px;line-height:1;font-weight:300;color:${white};">${esc(d.day)}</p>
                <p style="margin:0;font-family:${font};font-size:13px;font-weight:600;color:${W(0.85)};">${esc(d.weekday)}</p>
              </td>
              <td valign="middle" style="padding-left:18px;">
                <p class="time" style="margin:0;font-family:${font};font-size:44px;line-height:1.05;font-weight:300;letter-spacing:-.02em;color:${white};">${esc(d.time)}</p>
                <p style="margin:6px 0 0;font-family:${font};font-size:15px;font-weight:600;color:${white};">${esc(d.location)}</p>
              </td>
            </tr></table>

            <!-- Ruler ticks (decorative; clients without gradient support just skip it) -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;"><tr>
              <td style="height:12px;line-height:12px;font-size:0;background-image:repeating-linear-gradient(90deg,${W(0.45)} 0 1px,transparent 1px 6px);">&nbsp;</td>
            </tr></table>

            <h1 style="margin:22px 0 0;font-family:${font};font-size:26px;line-height:1.2;font-weight:300;letter-spacing:-.01em;color:${white};">${esc(d.heading)}</h1>
            <p style="margin:8px 0 0;font-family:${font};font-size:15px;line-height:1.5;color:${W(0.8)};">Will you attend? One tap updates the clinic. No login needed.</p>

            <!-- Confirm / Reschedule / Cancel -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;"><tr>${
              button('Confirm', d.links.confirm, { bg: white, fallback: white, color: navy, border: white }) +
              button('Reschedule', d.links.reschedule, { bg: W(0.14), fallback: '#3aaad5', color: white, border: white }) +
              button('Cancel', d.links.cancel, { bg: 'rgba(216,57,149,.32)', fallback: '#a2689f', color: white, border: 'rgba(255,170,215,.7)' }, true)
            }
            </tr></table>

            <!-- Calendar / directions / front desk -->
            <table class="shortcuts" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#46afd7" style="margin-top:20px;background:${W(0.12)};border:1px solid ${W(0.2)};border-radius:18px;"><tr>${
              shortcut('Add to calendar', 'Save the date', d.links.calendar) +
              shortcut('Get directions', 'Open in Maps', d.directionsUrl) +
              shortcut('Front desk', d.phone, d.phoneHref, true)
            }
            </tr></table>

          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:18px 4px 0;font-family:${font};font-size:14px;line-height:1.5;color:${W(0.88)};">
        Please cancel at least 24 hours ahead so the time can go to another patient.
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:22px 4px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="border-top:1px solid ${W(0.25)};padding-top:16px;font-family:${font};font-size:12px;line-height:1.6;color:${W(0.75)};">
            This message never includes the reason for your visit. You get it because you have a CareConnect account.<br>
            <a href="${esc(d.stopUrl)}" style="color:${white};text-decoration:underline;">Stop reminder emails</a>
          </td>
        </tr></table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `${d.heading}`,
    `${d.weekday}, ${d.month} ${d.day} at ${d.time}`,
    `Location: ${d.location}`,
    'Will you attend? One tap updates the clinic. No login needed.',
    `Confirm: ${d.links.confirm}\nReschedule: ${d.links.reschedule}\nCancel: ${d.links.cancel}`,
    `Add to calendar: ${d.links.calendar}\nGet directions: ${d.directionsUrl}\nFront desk: ${d.phone}`,
    'Please cancel at least 24 hours ahead so the time can go to another patient.',
    'This message never includes the reason for your visit. You get it because you have a CareConnect account.',
    `Stop reminder emails: ${d.stopUrl}`,
  ].join('\n\n');

  return { html, text };
}

module.exports = { renderEmail, renderReminderEmail, siteUrl, BRAND };
