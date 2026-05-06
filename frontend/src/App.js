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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>💰 Expense Tracker</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="rent">Rent</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <h2>Your Expenses</h2>
      {expenses.map(expense => (
        <div key={expense.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{expense.title}</h3>
          <p>₹{expense.amount} — {expense.category}</p>
          <p>{expense.date}</p>
          <p>{expense.description}</p>
          <button 
          onClick={() => handleDelete(expense.id)}
          style={{ color: 'white', background: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
>
           Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;