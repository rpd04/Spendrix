import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Budget from './Budget';
import Charts from './Charts';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (isLoggedIn) fetchExpenses();
  }, [isLoggedIn]);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchExpenses = () => {
    axios.get('http://127.0.0.1:8000/api/expenses/', getAuthHeaders())
      .then(response => setExpenses(response.data))
      .catch(error => console.log(error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://127.0.0.1:8000/api/expenses/${editingId}/`, form, getAuthHeaders())
        .then(() => {
          fetchExpenses();
          setRefresh(prev => prev + 1);
          setEditingId(null);
          setForm({ title: '', amount: '', category: 'food', date: '', description: '' });
        })
        .catch(error => console.log(error.response.data));
    } else {
      axios.post('http://127.0.0.1:8000/api/expenses/', form, getAuthHeaders())
        .then(() => {
          fetchExpenses();
          setRefresh(prev => prev + 1);
          setForm({ title: '', amount: '', category: 'food', date: '', description: '' });
        })
        .catch(error => console.log(error.response.data));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`, getAuthHeaders())
      .then(() => {
        fetchExpenses();
        setRefresh(prev => prev + 1);
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setExpenses([]);
  };

const handleExportCSV = () => {
    axios.get('http://127.0.0.1:8000/api/export-csv/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
    })
    .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'smartspend_expenses.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch(error => console.log(error));
};

  if (!isLoggedIn) {
    return showRegister
      ? <Register onRegister={() => setShowRegister(false)} />
      : <Login
          onLogin={() => setIsLoggedIn(true)}
          onShowRegister={() => setShowRegister(true)}
        />;
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>💰 SmartSpend</h1>
        <button
          onClick={handleExportCSV}
          style={{ background: '#00b894', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Export CSV
        </button>
        <button
          onClick={handleLogout}
          style={{ background: '#ff7675', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="rent">Rent</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">
          {editingId ? 'Update Expense' : '+ Add Expense'}
        </button>
      </form>

      <Budget refresh={refresh} />
      <Charts refresh={refresh} />
      <h2>Your Expenses</h2>
      {expenses.length === 0 ? (
        <div className="empty">No expenses yet. Add one above!</div>
      ) : (
        expenses.map(expense => (
          <div key={expense.id} className="expense-card">
            <div className="expense-info">
              <h3>{expense.title}</h3>
              <span className="category-badge">{expense.category}</span>
              <p>{expense.date} {expense.description && `· ${expense.description}`}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="expense-amount">₹{expense.amount}</div>
              <button
                onClick={() => handleEdit(expense)}
                style={{ background: '#6c5ce7', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginRight: '6px' }}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(expense.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;