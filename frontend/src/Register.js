import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://smartspend-backend-wntp.onrender.com/api/register/', { username, password })
      .then(() => onRegister())
      .catch(() => setError('Registration failed. Try a different username.'));
  };

  return (
    <div className="app">
      <h1>💰 Expense Tracker</h1>
      <form className="expense-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;