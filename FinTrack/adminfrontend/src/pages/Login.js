import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Add your CSS styling here

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Log the payload for debugging
      console.log('Sending payload:', { email, password });

      const response = await axios.post(
        'http://localhost:5000/admin/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response for debugging
      console.log('Login Response:', response.data);

      // On successful login, store the token in localStorage
      localStorage.setItem('authToken', response.data.token);

      // Redirect to the admin dashboard or desired page
      window.location.href = '/admin'; // Or change the route to your admin dashboard

    } catch (error) {
      // Log the full error for debugging
      console.error('Login Error:', error.response?.data || error.message);

      // Display a user-friendly error message
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Admin Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;