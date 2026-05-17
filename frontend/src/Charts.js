import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Charts({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    axios.get('https://smartspend-backend-wntp.onrender.com/api/expenses/', getAuthHeaders())
      .then(response => setExpenses(response.data))
      .catch(error => console.log(error));
  }, [refresh]);

  // Category wise spending for Pie chart
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
  '#00d4ff', '#0099bb', '#005f75', '#00eeff', '#0077aa', '#003d55', '#00ffcc'
],
      borderWidth: 0
    }]
  };

  // Daily spending for Bar chart
  const dailyTotals = expenses.reduce((acc, expense) => {
    acc[expense.date] = (acc[expense.date] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const sortedDates = Object.keys(dailyTotals).sort();

  const barData = {
    labels: sortedDates,
    datasets: [{
      label: 'Daily Spending (₹)',
      data: sortedDates.map(date => dailyTotals[date]),
      backgroundColor: '#00d4ff',
      borderRadius: 6
    }]
  };

  // Monthly trend for Line chart
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyTotals).sort();

  const lineData = {
    labels: sortedMonths,
    datasets: [{
      label: 'Monthly Spending (₹)',
      data: sortedMonths.map(month => monthlyTotals[month]),
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  if (expenses.length === 0) {
    return (
      <div>
        <h2>Analytics</h2>
        <p style={{ color: '#b2bec3' }}>Add expenses to see analytics.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        
        <div style={{ background: '#0f1628', padding: '16px', borderRadius: '8px', border: '1px solid #1e2d45' }}>
          <h3>By Category</h3>
          <div style={{ height: '200px' }}>
            <Pie data={pieData} options={{ ...options, maintainAspectRatio: false }} />
          </div>
        </div>

        <div style={{ background: '#0f1628', padding: '16px', borderRadius: '8px', border: '1px solid #1e2d45' }}>
          <h3>Daily Spending</h3>
          <div style={{ height: '200px' }}>
            <Bar data={barData} options={{ ...options, maintainAspectRatio: false }} />
          </div>
        </div>

        <div style={{ background: '#0f1628', padding: '16px', borderRadius: '8px', border: '1px solid #1e2d45' }}>
          <h3>Monthly Trend</h3>
          <div style={{ height: '200px' }}>
            <Line data={lineData} options={{ ...options, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Charts;