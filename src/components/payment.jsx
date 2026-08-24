import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const PAYMENT_METHODS = [
  { value: 'UPI',                    label: 'UPI',               icon: '📱' },
  { value: 'CREDIT_CARD/DEBIT_CARD', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'NET_BANKING',            label: 'Net Banking',       icon: '🌐' },
  { value: 'CASH',                   label: 'Cash',              icon: '💵' },
];

const formatTime = (t) => {
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
};

export default function Payment() {
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [booking, setBooking]         = useState(null);
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);
  const bookingId = localStorage.getItem('bookingId') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) { setFetching(false); return; }
    axios.get(`/bookings/get/${bookingId}`)
      .then(r => { setBooking(r.data); setFetching(false); })
      .catch(() => { setError('Could not load booking details.'); setFetching(false); });
  }, [bookingId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      await axios.post(`/payments/pay/${bookingId}`, {
        paymentMode,
        amount: booking.amount,
      });
      if (paymentMode === 'CASH') {
        setMessage('You can pay after the service is done. Redirecting you to booking confirmation...');
      } else {
        setMessage('Payment successful! Redirecting you to booking confirmation...');
      }
      setTimeout(() => navigate('/components/BookingConfirmed'), 1500);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="qc-page">
        <Navbar />
        <div className="qc-container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <span className="qc-spinner" style={{ width: '28px', height: '28px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '560px' }}>

        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>Payment</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Complete your booking payment securely
          </p>
        </div>

        {/* Booking summary card */}
        <div style={{
          background: 'var(--navy)', borderRadius: '12px', padding: '18px 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '6px' }}>
                Your booking
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                {booking?.service?.serviceName || '—'}
              </p>
              {booking?.slotDate && (
                <p style={{ fontSize: '12px', color: 'rgba(250,199,117,0.75)' }}>
                  📅 {new Date(booking.slotDate + 'T00:00').toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short'
                  })}
                  {booking?.slotTime && ` · ${formatTime(booking.slotTime)}`}
                </p>
              )}
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: 'rgba(250,199,117,0.7)', marginBottom: '4px' }}>Total</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--gold)', lineHeight: 1 }}>
                ₹{booking?.amount ?? '—'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment}>

          {/* Payment method */}
          <div style={{ marginBottom: '20px' }}>
            <label className="qc-label">Payment method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {PAYMENT_METHODS.map(m => (
                <div
                  key={m.value}
                  onClick={() => setPaymentMode(m.value)}
                  style={{
                    padding: '12px 16px',
                    border: `2px solid ${paymentMode === m.value ? 'var(--navy)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    background: paymentMode === m.value ? 'var(--navy-bg)' : 'var(--white)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--navy)' }}>{m.label}</span>
                  {paymentMode === m.value && (
                    <span style={{ marginLeft: 'auto', color: 'var(--navy)', fontWeight: '700' }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error   && <div className="qc-error">{error}</div>}
          {message && <div className="qc-success">{message}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !booking}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}
          >
            {loading
              ? <><span className="qc-spinner" /> Processing...</>
              : `Pay ₹${booking?.amount ?? 0} →`}
          </button>
        </form>
      </div>
    </div>
  );
}
