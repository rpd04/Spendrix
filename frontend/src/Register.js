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
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">
          <h1>SPENDRIX</h1>
          <p>Personal Finance Analytics</p>
        </div>
        <div className="auth-subtitle" style={{ marginTop: '24px' }}>Create Account</div>
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
          <button type="submit">Create Account</button>
        </form>
        <div className="auth-link">
          Already have an account?{' '}
          <span onClick={onRegister}>Sign in here</span>
        </div>
      </div>
    </div>
  );
}

export default Register;