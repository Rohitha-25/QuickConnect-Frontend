import React, { useEffect, useState } from 'react';
import axios from '../api';
import '../css/booking.css';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all services
    const fetchServices = async () => {
      try {
        const res = await axios.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedServiceId) return;

    // Fetch providers for the selected service
    const fetchProviders = async () => {
      try {
        const res = await axios.get(`/providers/service/${selectedServiceId}`);
        setProviders(res.data);
      } catch (err) {
        console.error('Failed to fetch providers', err);
      }
    };

    fetchProviders();
  }, [selectedServiceId]);

  const handleBooking = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.post(`/bookings/add/${userId}/${selectedProviderId}/${selectedServiceId}`);
      setMessage('Booking successful!');
    } catch (err) {
      console.error('Booking failed', err);
      setMessage('Booking failed. Please try again.');
    }
  };

  return (
    <div className="booking-container">
      <h2>Book a Service</h2>

      <div className="form-group">
        <label>Select a Service:</label>
        <select value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}>
          <option value="">-- Choose Service --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select a Provider:</label>
        <select value={selectedProviderId} onChange={(e) => setSelectedProviderId(e.target.value)} disabled={!selectedServiceId}>
          <option value="">-- Choose Provider --</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleBooking} disabled={!selectedServiceId || !selectedProviderId}>Book Now</button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default Booking;