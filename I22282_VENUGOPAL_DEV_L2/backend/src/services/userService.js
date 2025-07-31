const User = require('../models/user');

async function getAllUsers() {
  return await User.findAll();
}

async function getUserById(id) {
  return await User.findByPk(id);
}

module.exports = { getAllUsers, getUserById }; 