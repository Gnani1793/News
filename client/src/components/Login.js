// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/authService';
import './index.css'; // Import CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      const response = await login(userData);
      console.log('Login successful:', response);
      // Handle success scenario, e.g., redirect to dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error scenario, e.g., show error message
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
