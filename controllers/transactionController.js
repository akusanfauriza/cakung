const { Transaction } = require('../models');

class TransactionController {
  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.findAll({
        order: [['date', 'DESC']]
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDashboardData(req, res) {
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
      res.status(500).json({ error: error.message });
    }
  }

  async getLast7DaysData() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const data = await Promise.all(
      dates.map(async (date) => {
        const dayTransactions = await Transaction.findAll({
          where: {
            date: {
              [Sequelize.Op.between]: [
                new Date(date + 'T00:00:00.000Z'),
                new Date(date + 'T23:59:59.999Z')
              ]
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
  }
}

module.exports = new TransactionController();