const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');
const User = require('./user');

const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'customers', key: 'id' } },
  status: { type: DataTypes.STRING, allowNull: false },
  source: { type: DataTypes.STRING },
  assigned_to: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'leads',
  timestamps: false
});

Lead.belongsTo(Customer, { foreignKey: 'customer_id' });
Lead.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });

module.exports = Lead; 