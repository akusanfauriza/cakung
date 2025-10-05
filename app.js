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

// Initialize Telegram Bot
new TelegramService();

// Sync database dan start server
sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });