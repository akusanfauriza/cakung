const sequelize = require('../config/database');
const Transaction = require('./transaction');

const db = {
  Transaction,
  sequelize
};

module.exports = db;