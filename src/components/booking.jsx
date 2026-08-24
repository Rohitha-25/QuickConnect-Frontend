import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const CATEGORY_ICONS = {
  cleaning: '🧹', electrician: '⚡', 'car repair': '🚗',
  salon: '✂️', 'laptop repair': '💻', yoga: '🧘',
  plumbing: '🛠️', painting: '🖌️',
};

const getIcon = (cat = '') => {
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : '🔧';
};

export default function Booking() {
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState('');
  const [error, setError]                   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const preId = localStorage.getItem('preselectedServiceId');
    if (!preId) return;

    axios.get(`/services`)
      .then(r => {
        const found = r.data.find(s => String(s.id) === String(preId));
        if (found) setSelectedService(found);
        localStorage.removeItem('preselectedServiceId');
      })
      .catch(console.error);
  }, []);

  const handleBook = async () => {
    if (!selectedService) { setError('Please select a service.'); return; }
    setLoading(true); setError(''); setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.post(`/bookings/book/${userId}/${selectedService.id}`);
      localStorage.setItem('bookingId', res.data.id);
      localStorage.setItem('bookedServiceName', selectedService.serviceName);
      localStorage.setItem('bookedServicePrice', selectedService.price);
      localStorage.setItem('bookedServiceCategory', selectedService.category || '');
      setMessage('Booking created! Please confirm your slot...');
      setTimeout(() => navigate('/components/ConfirmSlot'), 1500);
    } catch {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '680px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>Book a Service</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            You select services, we QuickConnect you with an expert.
          </p>
        </div>

        {/* Service selection */}
        {!selectedService && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🛠️</p>
            <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '6px' }}>No service selected!</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>Please go back and choose a service first.</p>
            <button className="btn-outline" onClick={() => navigate('/components/Services')}>
              Browse Services
            </button>
          </div>
        )}

        {/* Summary */}
        {selectedService && (
          <div style={{
            background: 'var(--gold-bg)', border: '1.5px solid #F5D89A',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '24px'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--gold-text)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Booking Summary
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(252, 159, 8, 0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
              }}>
                {getIcon(selectedService.category || selectedService.serviceName)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>{selectedService.serviceName}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{selectedService.description}</p>
              </div>
              <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--navy)' }}>₹{selectedService.price}</p>
            </div>
          </div>
        )}

        {error   && <div className="qc-error">{error}</div>}
        {message && <div className="qc-success">{message}</div>}

        <button
          className="btn-primary"
          onClick={handleBook}
          disabled={!selectedService || loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
        >
          {loading ? <><span className="qc-spinner" /> Booking...</> : 'Confirm Booking →'}
        </button>
      </div>
    </div>
  );
}
