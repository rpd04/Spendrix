import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: '',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    axios.get('http://127.0.0.1:8000/api/expenses/')
      .then(response => setExpenses(response.data))
      .catch(error => console.log(error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/expenses/', form)
      .then(() => {
        fetchExpenses();
        setForm({ title: '', amount: '', category: 'food', date: '', description: '' });
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`)
      .then(() => fetchExpenses())
      .catch(error => console.log(error));
  };

return (
    <div className="app">
      <h1>💰 Expense Tracker</h1>

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
        <button type="submit">+ Add Expense</button>
      </form>

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