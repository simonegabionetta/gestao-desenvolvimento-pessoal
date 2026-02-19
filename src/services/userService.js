const { users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function register({ name, email, password }) {
  if (findUserByEmail(email)) throw new Error('Usuário já existe');
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, name, email, password: hash, avatar: null, history: [] };
  users.push(user);
  return { id: user.id, name: user.name, email: user.email };
}

function login({ email, password }) {
  const user = findUserByEmail(email);
  if (!user) throw new Error('Usuário não encontrado');
  if (!bcrypt.compareSync(password, user.password)) throw new Error('Senha inválida');
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  addHistory(user.id, 'Fez login'); // ✅ adicionado
  return { token };
}

function getProfile(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado');
  const { password, ...profile } = user;
  return profile;
}

function updateProfile(userId, data) {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado');
  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.password) user.password = bcrypt.hashSync(data.password, 8);
  if (data.avatar) user.avatar = data.avatar;
  addHistory(userId, 'Atualizou perfil'); // ✅ adicionado
  return { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
}

function addHistory(userId, action) {
  const user = users.find(u => u.id === userId);
  if (user) user.history.unshift({ action, date: new Date() });
}

function getHistory(userId, limit = 10, offset = 0) {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado');
  return user.history.slice(offset, offset + limit);
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  addHistory,
  getHistory
};