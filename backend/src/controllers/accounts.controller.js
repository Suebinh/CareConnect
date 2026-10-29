const accountModel = require('../models/account.model');
const { phoneProblem } = require('../utils/validate');

// Never send password_hash back to the browser.
const toProfile = (a) => ({
  id: a.id, email: a.email, role: a.role, name: a.name,
  phone: a.phone, specialty: a.specialty, status: a.status,
});

// Sprint log #266-267.
async function getProfile(req, res, next) {
  try {
    const account = await accountModel.findById(req.user.id);
    if (!account) return res.status(404).json({ error: 'Not found' });
    res.json({ account: toProfile(account) });
  } catch (err) { next(err); }
}

// Sprint log #266-268. Name and phone only.
async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
    if (phone && phoneProblem(String(phone))) return res.status(400).json({ error: phoneProblem(String(phone)) });

    const account = await accountModel.updateProfile(req.user.id, {
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
    });
    if (!account) return res.status(404).json({ error: 'Not found' });
    res.json({ account: toProfile(account) });
  } catch (err) { next(err); }
}

// TODO: list staff accounts, Process Manager only (sprint log #366)
async function listStaff(req, res, next) {
  res.status(501).json({ error: 'Not implemented: listStaff' });
}

// TODO: create/deactivate/reassign staff account (sprint log #366-368)
async function updateStaffStatus(req, res, next) {
  res.status(501).json({ error: 'Not implemented: updateStaffStatus' });
}

module.exports = { getProfile, updateProfile, listStaff, updateStaffStatus };
