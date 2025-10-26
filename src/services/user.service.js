const { User } = require('../models');

async function createUser(payload) {
  const user = await User.create(payload);
  return user;
}

async function findAllUsers() {
  return User.findAll({ attributes: ['id', 'nombreCompleto', 'email'] });
}

async function findUserById(id) {
  return User.findByPk(id, { attributes: ['id', 'nombreCompleto', 'email'] });
}

async function updateUser(id, payload) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(payload);
  return findUserById(id);
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

module.exports = {
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  findByEmail
};