// TODO: fetch account by req.user.id (sprint log #266-267)
async function getProfile(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getProfile' });
}

// TODO: validate + update name/role/phone (sprint log #266-268)
async function updateProfile(req, res, next) {
  res.status(501).json({ error: 'Not implemented: updateProfile' });
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
