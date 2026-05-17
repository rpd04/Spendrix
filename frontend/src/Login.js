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
      .catch(() => setError('Invalid credentials'));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">
          <h1>SPENDRIX</h1>
          <p>Personal Finance Analytics</p>
        </div>
        <div className="auth-subtitle" style={{ marginTop: '24px' }}>Sign In</div>
        {error && <div className="error-msg">{error}</div>}
        <form className="expense-form" onSubmit={handleSubmit}>
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
          <button type="submit">Sign In</button>
        </form>
        <div className="auth-link">
          Don't have an account?{' '}
          <span onClick={onShowRegister}>Register here</span>
        </div>
      </div>
    </div>
  );
}

export default Login;