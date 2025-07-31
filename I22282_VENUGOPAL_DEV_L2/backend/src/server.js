require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

// Start background jobs
require('./jobs/notificationJob');

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})(); 