import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Services from './components/services';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img style={{ width: '350px', height: '350px' }} src="images/Media.jpg" alt="QuickConnect Logo" className="logo animate" />

      <div className="button-group animate">
        <button className="btn login" onClick={() => navigate('/components/login')}>Login</button>
        <button className="btn signup" onClick={() => navigate('/components/register')}>Sign Up</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/components/login" element={<Login />} />
      <Route path="/components/register" element={<Register />} />
      <Route path="/components/home" element={<Home />} />
      <Route path="/components/services" element={<Services />} />
      <Route path="/components/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;