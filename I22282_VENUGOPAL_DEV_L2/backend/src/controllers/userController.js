const userService = require('../services/userService');

async function listUsers(req, res) {
  const users = await userService.getAllUsers();
  res.json(users);
}

async function getUser(req, res) {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

module.exports = { listUsers, getUser }; 