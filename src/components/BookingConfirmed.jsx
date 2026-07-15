import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

export default function BookingConfirmed() {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const bookingId = localStorage.getItem('bookingId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) { setError('No booking found.'); setLoading(false); return; }
    axios.get(`/bookings/get/${bookingId}`)
      .then(res => { setBooking(res.data); setLoading(false); })
      .catch(() => { setError('Could not load booking details.'); setLoading(false); });
  }, [bookingId]);

  if (loading) {
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

        {error ? (
          <div className="qc-error">{error}</div>
        ) : (
          <>
            {/* Success header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gold-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', margin: '0 auto 16px'
              }}>
                ✅
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--navy)' }}>Booking Confirmed!</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                {booking?.service?.serviceName} · ₹{booking?.amount}
              </p>
              {booking?.slotDate && (
                <p style={{ fontSize: '13px', color: 'var(--gold-text)', marginTop: '4px', fontWeight: '500' }}>
                  📅 {new Date(booking.slotDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  {booking?.slotTime && ` · ${booking.slotTime}`}
                </p>
              )}
            </div>

            {/* OTP note */}
            <div style={{
              background: 'var(--navy)', borderRadius: '16px', padding: '20px 24px',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <span style={{ fontSize: '28px' }}>🛡️</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--gold)', marginBottom: '4px' }}>
                  Provider Verification
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(250, 199, 117, 0.7)', lineHeight: '1.6' }}>
                  When your provider arrives, they'll confirm their identity using a secure OTP.
                  This ensures only the verified QuickConnect partner handles your booking.
                </p>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => navigate('/components/Review')}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
            >
              Leave a Review →
            </button>

            <button
              className="btn-outline"
              onClick={() => navigate('/components/Home')}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
