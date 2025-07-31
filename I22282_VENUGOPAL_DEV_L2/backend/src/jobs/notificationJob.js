const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/user');
const { Op } = require('sequelize');

// This function simulates sending an email or in-app notification
async function sendNotification(user, task) {
  // Replace with real email or notification logic
  console.log(`Notify ${user.email}: Task '${task.title}' is due soon!`);
}

// Cron job: runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running notification job for upcoming tasks...');
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  try {
    const tasks = await Task.findAll({
      where: {
        due_date: {
          [Op.gte]: now,
          [Op.lte]: soon,
        },
        status: {
          [Op.not]: 'Completed',
        },
      },
    });
    for (const task of tasks) {
      if (task.assigned_to) {
        const user = await User.findByPk(task.assigned_to);
        if (user) {
          await sendNotification(user, task);
        }
      }
    }
  } catch (err) {
    console.error('Notification job error:', err);
  }
}); 