const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, validate: { len: [0, 20] } },
  address: { type: DataTypes.TEXT },
  company: { type: DataTypes.STRING },
  created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'customers',
  timestamps: false
});

Customer.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

module.exports = Customer; 