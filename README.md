# 📊 Aplikasi Pencatatan Keuangan

Aplikasi fullstack untuk pencatatan keuangan pribadi dengan integrasi Telegram Bot dan dashboard real-time.

## 🚀 Fitur

- ✅ Input transaksi via Telegram Bot
- ✅ Dashboard dengan grafik real-time
- ✅ Pencatatan pemasukan dan pengeluaran
- ✅ Analisis data 7 hari terakhir
- ✅ Auto-refresh data

## 🛠️ Teknologi

**Backend:**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- Telegram Bot API

**Frontend:**
- React.js + Vite
- Chart.js untuk visualisasi
- Tailwind CSS untuk styling

## 📦 Instalasi

### Prerequisites
- Node.js 16+
- PostgreSQL
- Telegram Bot Token

### Backend Setup
Masuk ke folder root projek
cd backend
cp .env.example .env
# Edit .env dengan konfigurasi database dan Telegram Bot
npm install
npm run dev

### Frontend Setup
cd frontend
npm install
npm run dev