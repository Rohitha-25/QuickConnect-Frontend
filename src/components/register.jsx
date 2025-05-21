// src/components/Register.js
import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await axios.post('/auth/register', formData);
      navigate('/components/login'); // 🔁 Redirect to login after successful registration
    } catch (err) {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="register-container">
        <div className='imageContainer'>
            <h1 className="title animate">Quick Connect</h1>
            <p className="tagline animate">where needs meet expertise</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Sign Up</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          <div className="input-group">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;