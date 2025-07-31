require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/user');
const Customer = require('./models/customer');
const Lead = require('./models/lead');
const Task = require('./models/task');
const Interaction = require('./models/interaction');

async function seed() {
  await sequelize.sync({ force: true });

  // Users
  const users = await User.bulkCreate([
    { username: 'admin', email: 'admin@crm.com', password_hash: 'hashedpass1', full_name: 'Admin User', role: 'admin' },
    { username: 'jane', email: 'jane@crm.com', password_hash: 'hashedpass2', full_name: 'Jane Doe', role: 'sales' },
    { username: 'john', email: 'john@crm.com', password_hash: 'hashedpass3', full_name: 'John Smith', role: 'support' },
  ]);

  // Customers
  const customers = await Customer.bulkCreate([
    { name: 'Acme Corp', email: 'contact@acme.com', phone: '1234567890', address: '123 Main St', company: 'Acme', created_by: users[0].id },
    { name: 'Globex Inc', email: 'info@globex.com', phone: '9876543210', address: '456 Elm St', company: 'Globex', created_by: users[1].id },
  ]);

  // Leads
  await Lead.bulkCreate([
    { customer_id: customers[0].id, status: 'New', source: 'Website', assigned_to: users[1].id },
    { customer_id: customers[1].id, status: 'Contacted', source: 'Referral', assigned_to: users[2].id },
  ]);

  // Tasks
  await Task.bulkCreate([
    { title: 'Follow up with Acme', description: 'Call to discuss proposal', status: 'Open', assigned_to: users[1].id, customer_id: customers[0].id },
    { title: 'Send contract to Globex', description: 'Email contract for signature', status: 'In Progress', assigned_to: users[2].id, customer_id: customers[1].id },
  ]);

  // Interactions
  await Interaction.bulkCreate([
    { customer_id: customers[0].id, user_id: users[1].id, type: 'call', notes: 'Discussed requirements.' },
    { customer_id: customers[1].id, user_id: users[2].id, type: 'email', notes: 'Sent initial proposal.' },
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
}); 