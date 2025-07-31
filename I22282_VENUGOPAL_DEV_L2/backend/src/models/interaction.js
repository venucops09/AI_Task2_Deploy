const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');
const User = require('./user');

const Interaction = sequelize.define('Interaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'customers', key: 'id' } },
  user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
  type: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT },
  interaction_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'interactions',
  timestamps: false
});

Interaction.belongsTo(Customer, { foreignKey: 'customer_id' });
Interaction.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

module.exports = Interaction; 