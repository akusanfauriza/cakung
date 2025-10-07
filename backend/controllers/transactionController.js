const { Transaction } = require('../models');
const { Sequelize, Op } = require('sequelize');

class TransactionController {
  getAllTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        order: [['date', 'DESC']]
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getDashboardData = async (req, res) => {
    try {
      const transactions = await Transaction.findAll();
      
      const totalIncome = transactions
        .filter(t => t.type === 'masuk')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpense = transactions
        .filter(t => t.type === 'keluar')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const balance = totalIncome - totalExpense;

      // Data untuk chart (last 7 days)
      const last7Days = await this.getLast7DaysData();
      
      res.json({
        summary: {
          totalIncome,
          totalExpense,
          balance
        },
        recentTransactions: transactions.slice(0, 10),
        chartData: last7Days
      });
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({ error: error.message });
    }
  }

  getLast7DaysData = async () => {
    try {
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      const data = await Promise.all(
        dates.map(async (date) => {
          const startDate = new Date(date + 'T00:00:00.000Z');
          const endDate = new Date(date + 'T23:59:59.999Z');

          const dayTransactions = await Transaction.findAll({
            where: {
              date: {
                [Op.between]: [startDate, endDate]
              }
            }
          });

          const income = dayTransactions
            .filter(t => t.type === 'masuk')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
          
          const expense = dayTransactions
            .filter(t => t.type === 'keluar')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

          return {
            date,
            income,
            expense
          };
        })
      );

      return data;
    } catch (error) {
      console.error('Error in getLast7DaysData:', error);
      return [];
    }
  }
}

module.exports = new TransactionController();