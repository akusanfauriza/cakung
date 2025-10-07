const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const transactionRoutes = require('./routes/transactions');
const TelegramService = require('./services/telegramService');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize Telegram Bot
try {
  new TelegramService();
} catch (error) {
  console.log('❌ Telegram Bot gagal diinisialisasi:', error.message);
}

// Sync database dan start server
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/transactions/dashboard`);
    });
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error);
  });

module.exports = app;