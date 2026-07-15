import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const CATEGORY_ICONS = {
  cleaning: '🧹', electrician: '⚡', 'car repair': '🚗',
  salon: '✂️', 'laptop repair': '💻', yoga: '🧘',
};
const getIcon = (cat = '') => {
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : '🔧';
};

export default function Booking() {
  const [services, setServices]             = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState('');
  const [error, setError]                   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/services').then(r => {
      setServices(r.data);
      // Pre-select if coming from home/AI
      const preId = localStorage.getItem('preselectedServiceId');
      if (preId) {
        const found = r.data.find(s => String(s.id) === String(preId));
        if (found) setSelectedService(found);
        localStorage.removeItem('preselectedServiceId');
      }
    }).catch(console.error);
  }, []);

  const handleBook = async () => {
    if (!selectedService) { setError('Please select a service.'); return; }
    setLoading(true); setError(''); setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.post(`/bookings/book/${userId}/${selectedService.id}`);
      localStorage.setItem('bookingId', res.data.id);
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
        <div style={{ marginBottom: '24px' }}>
          <label className="qc-label">Choose a service</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => { setSelectedService(service); setError(''); }}
                style={{
                  padding: '16px',
                  border: `2px solid ${selectedService?.id === service.id ? 'var(--navy)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  background: selectedService?.id === service.id ? 'var(--navy-bg)' : 'var(--white)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: selectedService?.id === service.id ? 'var(--navy)' : 'var(--navy-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0
                }}>
                  {getIcon(service.category || service.serviceName)}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)' }}>
                    {service.serviceName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>₹{service.price}</p>
                </div>
                {selectedService?.id === service.id && (
                  <span style={{ marginLeft: 'auto', color: 'var(--navy)', fontWeight: '700' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedService && (
          <div style={{
            background: 'var(--gold-bg)', border: '1.5px solid #F5D89A',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '24px'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--gold-text)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Booking Summary
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>{selectedService.serviceName}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{selectedService.description}</p>
              </div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--navy)' }}>₹{selectedService.price}</p>
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
