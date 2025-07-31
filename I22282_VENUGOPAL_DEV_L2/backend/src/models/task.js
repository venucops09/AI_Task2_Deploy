const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Customer = require('./customer');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  due_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, allowNull: false },
  assigned_to: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
  customer_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'customers', key: 'id' } },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'tasks',
  timestamps: false
});

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
Task.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = Task; 