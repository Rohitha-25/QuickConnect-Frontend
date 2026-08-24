import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const STATUS_STYLES = {
  PENDING:          { bg: '#FEF9EC', color: '#B45309', label: 'Pending' },
  SLOT_CONFIRMED:   { bg: '#EFF6FF', color: '#1D4ED8', label: 'Slot Confirmed' },
  PENDING_PAYMENT:  { bg: '#FEF3C7', color: '#D97706', label: 'Pending Payment' },
  PAID:             { bg: '#EDFAF4', color: '#1A7C4E', label: 'Paid' },
  VERIFIED:         { bg: '#F0FDF4', color: '#15803D', label: 'Verified' },
  COMPLETED:        { bg: '#F9FAFB', color: '#6B7280', label: 'Completed' },
};

const getStatus = (status) =>
  STATUS_STYLES[status] || { bg: '#F9FAFB', color: '#6B7280', label: status };

const CATEGORY_ICONS = {
  cleaning: '🧹', electrician: '⚡', 'car repair': '🚗',
  salon: '✂️', 'laptop repair': '💻', yoga: '🧘',
  plumbing: '🛠️', painting: '🖌️',
};

const getIcon = (cat = '') => {
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : '🔧';
};

const PAYMENT_LABELS = {
  'UPI':                   { icon: '📱', label: 'Paid via UPI' },
  'CREDIT_CARD/DEBIT_CARD':{ icon: '💳', label: 'Paid via Card' },
  'NET_BANKING':           { icon: '🌐', label: 'Paid via Net Banking' },
  'CASH':                  { icon: '💵', label: 'Cash Payment' },
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [paymentModes, setPaymentModes] = useState({});
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');
  const [reviewedServices, setReviewedServices] = useState(new Set());
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/bookings/user/${userId}`)
      .then(r => { 
        setBookings(r.data); 
        setLoading(false); 

        const paidBookings = r.data.filter(b => ['PAID', 'PENDING_PAYMENT'].includes(b.status));
        
        Promise.all(
          paidBookings.map(b => 
            axios.get(`/payments/booking/${b.id}`)
            .then(res => ({ bookingId: b.id, mode: res.data?.paymentMode }))
            .catch(() => ({ bookingId: b.id, mode: null }))
          )
        ).then(results => {
          const modes = {};
          results.forEach(r => { if(r.mode) modes[r.bookingId] = r.mode; });
          setPaymentModes(modes);
        });

        Promise.all(
          paidBookings.map(b => 
            axios.get(`/reviews/exists/${userId}/${b.service?.id}`)
            .then(res => res.data ? b.service?.id : null)
            .catch(() => null)
          )
        ).then(results => {
          setReviewedServices(new Set(results.filter(Boolean)));
        });

      })
      .catch(() => setLoading(false));
  }, []);

  const isActive = b => ['PENDING', 'SLOT_CONFIRMED', 'PAID', 'PENDING_PAYMENT'].includes(b.status);

  const filtered = bookings.filter(b => {
    if (filter === 'ACTIVE')    return isActive(b);
    if (filter === 'COMPLETED') return !isActive(b);
    return true;
  });

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '700px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>My Bookings</h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '4px' }}>
            {['ALL', 'ACTIVE', 'COMPLETED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '600', fontFamily: 'Inter, sans-serif',
                  background: filter === f ? 'var(--navy)' : 'transparent',
                  color: filter === f ? 'var(--gold)' : 'var(--muted)',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <span className="qc-spinner" style={{ width: '28px', height: '28px' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px' }}>No bookings found</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>
              {filter === 'ACTIVE' ? 'No active bookings.' : filter === 'COMPLETED' ? 'No completed bookings yet.' : "You haven't made any bookings yet."}
            </p>
            <button className="btn-primary" onClick={() => navigate('/components/Booking')}>
              Book a Service
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered
              .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
              .map(booking => {
                const s = getStatus(booking.status);
                return (
                  <div key={booking.id} className="qc-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

                      {/* Icon */}
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--navy-bg)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', flexShrink: 0
                      }}>
                        {getIcon(booking.service?.category || booking.service?.serviceName || '')}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>
                            {booking.service?.serviceName || 'Service'}
                          </h3>
                          {/* Status badge */}
                          <span style={{
                            fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                            borderRadius: '999px', background: s.bg, color: s.color
                          }}>
                            {s.label}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            🔗 {booking.service?.category}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            📅 Booked on {new Date(booking.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          {booking.slotDate && (
                            <p style={{ fontSize: '12px', color: 'var(--gold-text)', fontWeight: '500' }}>
                              🕐 Slot: {new Date(booking.slotDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              {booking.slotTime && ` at ${booking.slotTime}`}
                            </p>
                          )}
                        </div>

                        {booking.address && (
                          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                            📍 {booking.address}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)' }}>
                          ₹{booking.amount}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons for active bookings */}
                    {isActive(booking) && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                        {booking.status === 'PENDING' && (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '12px', padding: '7px 14px' }}
                            onClick={() => {
                              localStorage.setItem('bookingId', booking.id);
                              navigate('/components/ConfirmSlot');
                            }}
                          >
                            Confirm Slot →
                          </button>
                        )}

                        {booking.status === 'SLOT_CONFIRMED' && (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '12px', padding: '7px 14px' }}
                            onClick={() => {
                              localStorage.setItem('bookingId', booking.id);
                              navigate('/components/Payment');
                            }}
                          >
                            Complete Payment →
                          </button>
                        )}

                        {(booking.status === 'PAID' || booking.status === 'PENDING_PAYMENT') && (
                          <>
                            { !reviewedServices.has(booking.service?.id) && (
                              <button
                                className="btn-primary"
                                style={{ fontSize: '12px', padding: '7px 14px' }}
                                onClick={() => {
                                  localStorage.setItem('bookingId', booking.id);
                                  navigate('/components/Review');
                                } }
                              >
                                Leave a Review →
                              </button>
                            )}
                            { reviewedServices.has(booking.service?.id) && (
                              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '500' }}>
                                ⭐ Reviewed
                              </span>
                            )}

                            {/* Payment mode badge */}
                            {paymentModes[booking.id] && (() => {
                              const mode = PAYMENT_LABELS[paymentModes[booking.id]] || { icon: '💳', label: paymentModes[booking.id] };
                              return (
                                <span style={{
                                  fontSize: '12px', padding: '5px 12px', borderRadius: '999px',
                                  background: 'var(--navy-bg)', color: 'var(--navy)', fontWeight: '500',
                                  display: 'flex', alignItems: 'center', gap: '4px'
                                  }}
                                >
                                  {mode.icon} {mode.label}
                                </span>
                              );
                            })()}
                          </>
                        )}
                      </div>
                      )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
