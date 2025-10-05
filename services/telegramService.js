const TelegramBot = require('node-telegram-bot-api');
const { Transaction } = require('../models');
require('dotenv').config();

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.setupHandlers();
  }

  setupHandlers() {
    // Handler untuk pesan masuk
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text.toLowerCase().trim();

      try {
        if (text.startsWith('masuk')) {
          await this.handleIncome(msg);
        } else if (text.startsWith('keluar')) {
          await this.handleExpense(msg);
        } else if (text === '/start') {
          this.bot.sendMessage(chatId, 
            'Selamat datang di Bot Pencatatan Keuangan!\n\n' +
            'Format input:\n' +
            '• Pemasukan: "Masuk 50000"\n' +
            '• Pengeluaran: "Keluar 25000 Beli makan"\n\n' +
            'Contoh: "Keluar 15000 Beli pulsa"'
          );
        } else {
          this.bot.sendMessage(chatId, 
            'Format tidak dikenali. Gunakan:\n' +
            '"Masuk [jumlah]" untuk pemasukan\n' +
            '"Keluar [jumlah] [keterangan]" untuk pengeluaran'
          );
        }
      } catch (error) {
        console.error('Error handling message:', error);
        this.bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi.');
      }
    });
  }

  async handleIncome(msg) {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();
    const amount = this.extractAmount(text);

    if (!amount || amount <= 0) {
      return this.bot.sendMessage(chatId, 'Format salah. Gunakan: "Masuk 50000"');
    }

    const transaction = await Transaction.create({
      type: 'masuk',
      amount: amount,
      description: 'Pemasukan dari Telegram',
      telegram_chat_id: chatId.toString()
    });

    this.bot.sendMessage(chatId, 
      `✅ Pemasukan berhasil dicatat!\n` +
      `Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
      `Saldo saat ini: Rp ${await this.getCurrentBalance()}`
    );
  }

  async handleExpense(msg) {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();
    const amount = this.extractAmount(text);
    const description = this.extractDescription(text);

    if (!amount || amount <= 0) {
      return this.bot.sendMessage(chatId, 'Format salah. Gunakan: "Keluar 50000 Beli makan"');
    }

    const transaction = await Transaction.create({
      type: 'keluar',
      amount: amount,
      description: description || 'Pengeluaran',
      telegram_chat_id: chatId.toString()
    });

    this.bot.sendMessage(chatId, 
      `✅ Pengeluaran berhasil dicatat!\n` +
      `Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
      `Keterangan: ${description || '-'}\n` +
      `Saldo saat ini: Rp ${await this.getCurrentBalance()}`
    );
  }

  extractAmount(text) {
    const match = text.match(/(masuk|keluar)\s+(\d+(?:\.\d+)?)/i);
    return match ? parseFloat(match[2]) : null;
  }

  extractDescription(text) {
    const parts = text.split(' ');
    return parts.slice(2).join(' ') || null;
  }

  async getCurrentBalance() {
    const transactions = await Transaction.findAll();
    const balance = transactions.reduce((total, transaction) => {
      return transaction.type === 'masuk' ? 
        total + parseFloat(transaction.amount) : 
        total - parseFloat(transaction.amount);
    }, 0);
    
    return balance.toLocaleString('id-ID');
  }
}

module.exports = TelegramService;