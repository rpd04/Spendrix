import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Budget({ refresh }) {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({
    category: 'food',
    amount: ''
  });

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, [refresh]);

  const fetchBudgets = () => {
    axios.get('https://smartspend-backend-wntp.onrender.com/api/budgets/', getAuthHeaders())
      .then(response => setBudgets(response.data))
      .catch(error => console.log(error));
  };

  const fetchSummary = () => {
    axios.get('https://smartspend-backend-wntp.onrender.com/api/budget-summary/', getAuthHeaders())
      .then(response => {
        setSummary(response.data);
      })
      .catch(error => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const data = {
      ...form,
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };
    axios.post('https://smartspend-backend-wntp.onrender.com/api/budgets/', data, getAuthHeaders())
      .then(() => {
        fetchBudgets();
        fetchSummary();
        setForm({ category: 'food', amount: '' });
      })
      .catch(error => console.log(error.response.data));
  };

  return (
    <div>
      <h2>Monthly Budgets</h2>

      <form className="expense-form" onSubmit={handleSubmit}>
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="rent">Rent</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Budget Amount (₹)"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />
        <button type="submit">Set Budget</button>
      </form>

      <h3 style={{ marginTop: '20px' }}>Budget vs Spent</h3>
      {summary.length === 0 ? (
        <p style={{ color: '#b2bec3' }}>No budgets set yet.</p>
      ) : (
        summary.map((item, index) => (
          <div key={index} className="expense-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.category}</span>
              <span style={{ color: item.status === 'danger' ? '#d63031' : '#00d4ff' }}>
                ₹{item.spent} / ₹{item.budget}
              </span>
            </div>
            <div style={{ width: '100%', background: '#f0f2f5', borderRadius: '10px', height: '8px' }}>
              <div style={{
                width: `${Math.min(item.percentage, 100)}%`,
                background: item.status === 'danger' ? '#d63031' : '#00d4ff',
                height: '8px',
                borderRadius: '10px',
                transition: 'width 0.3s'
              }} />
            </div>
            <span style={{ fontSize: '12px', color: '#636e72', marginTop: '4px' }}>
              {item.percentage}% used
              {item.status === 'danger' && ' ⚠️ Near limit!'}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Budget;