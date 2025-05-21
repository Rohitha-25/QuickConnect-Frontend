// Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token and any user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/components/login');
  }, [navigate]);

  return <p>Logging out..</p>;
};

export default Logout;
