import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/services.css';
import axios from '../api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/services')
      .then((response) => {
        setServices(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      });
  }, []);

  const handleLogoClick = () => {
    navigate('/components/home');
  };

  return (
    <div className="home-containers">
      <header className="home-header">
        <div className="logo-section" onClick={handleLogoClick}>
          <img
            style={{ width: '250px', height: '100px' }}
            src="/images/logo.jpg"
            alt="QuickConnect Logo"
          />
        </div>
        <nav>
          <Link to="/components/home">Home</Link>
          <Link to="/components/services">Services</Link>
          <Link to="/components/booking">Bookings</Link>
          <Link to="/components/logout">Logout</Link>
        </nav>
      </header>

      <main className="service-wrapper">
        <h2>Our Services..</h2>
        <p className="sub-text">what we offer to make your life easier</p>

        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.id}>
                <img src={service.imageUrl} alt={service.serviceName} />
                <h3>{service.serviceName}</h3>
                <p>{service.description}</p>
                <p><strong>₹{service.price}</strong></p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Services;