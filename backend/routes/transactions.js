const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions - Get all transactions
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/dashboard - Get dashboard data
router.get('/dashboard', transactionController.getDashboardData);

module.exports = router;