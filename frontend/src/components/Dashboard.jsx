import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await transactionAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>No data available</div>;

  const { summary, recentTransactions, chartData } = dashboardData;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pemasukan dan Pengeluaran 7 Hari Terakhir',
      },
    },
  };

  const chartDataConfig = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: 'Pemasukan',
        data: chartData.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Pengeluaran',
        data: chartData.map(item => item.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Keuangan</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Pemasukan</h3>
          <p className="text-2xl font-bold">
            Rp {summary.totalIncome.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Pengeluaran</h3>
          <p className="text-2xl font-bold">
            Rp {summary.totalExpense.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Saldo</h3>
          <p className="text-2xl font-bold">
            Rp {summary.balance.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <Bar options={chartOptions} data={chartDataConfig} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Tipe</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      transaction.type === 'masuk' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    Rp {parseFloat(transaction.amount).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-2">{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;