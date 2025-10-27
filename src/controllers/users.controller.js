const userService = require('../services/user.service');

async function listUsers(req, res) {
  const users = await userService.findAllUsers();
  return res.json({ status: 'success', data: users });
}

async function getUser(req, res) {
  const id = req.params.id;
  const user = await userService.findUserById(id);
  if (!user) return res.status(404).json({ status: 'fail', data: { message: 'User not found' } });
  return res.json({ status: 'success', data: user });
}

async function createUser(req, res) {
  const { nombreCompleto, email, password } = req.body;
  if (!nombreCompleto || !email || !password) {
    return res.status(400).json({ status: 'fail', data: { message: 'Missing fields' } });
  }
  const exists = await userService.findByEmail(email);
  if (exists) return res.status(409).json({ status: 'fail', data: { message: 'Email already in use' } });
  const user = await userService.createUser({ nombreCompleto, email, password });
  return res.status(201).json({ status: 'success', data: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email } });
}

async function updateUser(req, res) {
  const id = req.params.id;
  const payload = req.body;
  // Prevent updating password exposure or id changes: allow updating nombreCompleto, email, password
  if (payload.email) {
    const existing = await userService.findByEmail(payload.email);
    if (existing && existing.id !== Number(id)) {
      return res.status(409).json({ status: 'fail', data: { message: 'Email already in use' } });
    }
  }
  const updated = await userService.updateUser(id, payload);
  if (!updated) return res.status(404).json({ status: 'fail', data: { message: 'User not found' } });
  return res.json({ status: 'success', data: updated });
}

async function deleteUser(req, res) {
  const id = req.params.id;
  const ok = await userService.deleteUser(id);
  if (!ok) return res.status(404).json({ status: 'fail', data: { message: 'User not found' } });
  return res.json({ status: 'success', data: { message: 'User deleted' } });
}




module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
