import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://smartspend-backend-wntp.onrender.com/api/token/', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.access);
        onLogin();
      })
      .catch(() => setError('Invalid username or password'));
  };

  return (
    <div className="app">
      <h1>💰 Expense Tracker</h1>
      <form className="expense-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
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
        <button type="submit">Login</button>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Don't have an account?{' '}
          <span
            onClick={onShowRegister}
            style={{ color: '#6c5ce7', cursor: 'pointer', fontWeight: '500' }}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;