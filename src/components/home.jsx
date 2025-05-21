import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/home.css';
import axios from '../api';

const services = [
  { name: 'Cleaning', image: '/images/cleaning-person.jpeg' },
  { name: 'Car Repair', image: '/images/car repair.webp' },
  { name: 'Electrician', image: '/images/Electrician.jpg' },
  { name: 'Haircut', image: '/images/salon.jpg' },
  { name: 'Laptop Repair', image: '/images/laptop repair.jpg' },
  { name: 'Yoga Trainer', image: '/images/yoga.jpg' },
];

const predefinedLocations = [
  'Ahmedabad',
  'Bangalore',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kochi',
  'Mumbai',
  'Pune',
  'Trivandrum'
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [location, setLocation] = useState('Select location');
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/components/home');
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const city = res.data?.address?.city || res.data?.address?.town || res.data?.address?.state;
            setLocation(city || 'Detected');
          } catch {
            setLocation('Unable to detect');
          }
        },
        () => setLocation('Permission denied')
      );
    } else {
      setLocation('Not supported');
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      setFilteredServices(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-section">
          <img
            style={{ width: '250px', height: '100px', cursor: 'pointer' }}
            src="/images/logo.jpg"
            alt="QuickConnect Logo"
            onClick={handleLogoClick}
          />
        </div>
        <nav className="navbar-links">
          <div className="location-selector">
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option disabled>Select location</option>
                {predefinedLocations.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </select>
              <button onClick={handleDetectLocation}>📍</button>
          </div>
          <Link to="/components/home">Home</Link>
          <Link to="/components/services">Services</Link>
          <Link to="/components/booking">Bookings</Link>
          <Link to="/components/logout">Logout</Link>
        </nav>
      </header>

      <main className="main-content">
        <h2>Home Services, On Demand, At QuickConnect.</h2>
        <p className="sub-text">Let expertise meet your needs</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="service-cards">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, idx) => (
              <div key={idx} className="card">
                <img src={service.image} alt={service.name} />
                <p>{service.name}</p>
              </div>
            ))
          ) : (
            <p style={{ marginTop: '20px' }}>No services found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;