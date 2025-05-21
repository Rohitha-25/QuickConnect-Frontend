import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import Home from './home';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Custom password validation
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(''); // Reset error message

    // Validate email and password
    if (!email && !password) {
        setErrorMessage('Fill all the required fields.');
        return;
      }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Please enter a vaild password of 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      navigate('/components/home');
      localStorage.setItem('token', response.data.token); // Store the JWT token
      
    } catch (err) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
        <div className="imageContainer">
            <h1  className="title animate">Quick Connect</h1>
            <p className="tagline animate" >where needs meet expertise</p>
        </div>
          <h2>Login</h2>
          
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in..' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;