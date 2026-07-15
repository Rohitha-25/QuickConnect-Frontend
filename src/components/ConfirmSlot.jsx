import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '14:00', '15:00', '16:00', '17:00',
];

const formatTime = (t) => {
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
};

// Min date: tomorrow. Max date: 30 days from now.
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};
const maxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

export default function ConfirmSlot() {
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const bookingId = localStorage.getItem('bookingId');
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!slotDate) { setError('Please select a date.'); return; }
    if (!slotTime) { setError('Please select a time slot.'); return; }
    setLoading(true); setError(''); setMessage('');

    try {
      await axios.post(`/bookings/confirm-slot/${bookingId}`, {
        slotDate,
        slotTime,
      });
      setMessage('Slot confirmed! Redirecting to payment...');
      // Store slot for summary display on payment/confirmed pages
      localStorage.setItem('slotDate', slotDate);
      localStorage.setItem('slotTime', slotTime);
      setTimeout(() => navigate('/components/Payment'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not confirm slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '600px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>Confirm Slot</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Pick a date and time that works for you — our provider will arrive within the hour.
          </p>
        </div>

        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          {['Booked', 'Confirm Slot', 'Payment', 'Done'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: i < 3 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', fontSize: '11px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? 'var(--gold)' : i === 1 ? 'var(--navy)' : 'var(--border)',
                  color: i <= 1 ? (i === 0 ? '#412402' : 'var(--gold)') : 'var(--muted)',
                }}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '12px', fontWeight: i === 1 ? '600' : '400', color: i === 1 ? 'var(--navy)' : 'var(--muted)' }}>
                  {step}
                </span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {/* Date picker */}
        <div className="qc-field" style={{ marginBottom: '24px' }}>
          <label className="qc-label">Select date</label>
          <input
            className="qc-input"
            type="date"
            value={slotDate}
            min={tomorrow()}
            max={maxDate()}
            onChange={e => { setSlotDate(e.target.value); setError(''); }}
            style={{ fontSize: '15px' }}
          />
          {slotDate && (
            <p style={{ fontSize: '12px', color: 'var(--gold-text)', marginTop: '6px', fontWeight: '500' }}>
              📅 {new Date(slotDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Time slot grid */}
        <div style={{ marginBottom: '24px' }}>
          <label className="qc-label" style={{ marginBottom: '12px', display: 'block' }}>Select time slot</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {TIME_SLOTS.map(t => (
              <div
                key={t}
                onClick={() => { setSlotTime(t); setError(''); }}
                style={{
                  padding: '12px',
                  border: `2px solid ${slotTime === t ? 'var(--navy)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  background: slotTime === t ? 'var(--navy)' : 'var(--white)',
                  color: slotTime === t ? 'var(--gold)' : 'var(--text)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                {formatTime(t)}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {slotDate && slotTime && (
          <div style={{
            background: 'var(--gold-bg)', border: '1.5px solid #F5D89A',
            borderRadius: '12px', padding: '14px 18px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)' }}>
                {new Date(slotDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {formatTime(slotTime)}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--gold-text)' }}>
                Our provider will arrive within this hour window
              </p>
            </div>
          </div>
        )}

        {error   && <div className="qc-error">{error}</div>}
        {message && <div className="qc-success">{message}</div>}

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!slotDate || !slotTime || loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
        >
          {loading ? <><span className="qc-spinner" /> Confirming...</> : 'Confirm Slot & Proceed to Payment →'}
        </button>
      </div>
    </div>
  );
}
