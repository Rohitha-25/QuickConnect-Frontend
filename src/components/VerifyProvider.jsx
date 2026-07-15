import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const OTP_LENGTH = 6;

export default function VerifyProvider() {
  const [otp, setOtp]         = useState(new Array(OTP_LENGTH).fill(''));
  const [verified, setVerified] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const bookingId = localStorage.getItem('bookingId');
  const navigate = useNavigate();

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1)
      document.getElementById(`vp-otp-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`vp-otp-${idx - 1}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < OTP_LENGTH) { setError('Please enter the complete 6-digit OTP.'); return; }

    setLoading(true); setError('');
    try {
      await axios.post(`/bookings/verify-otp/${bookingId}`, { otp: entered });
      setVerified(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed. Please check the OTP and try again.');
      setOtp(new Array(OTP_LENGTH).fill(''));
      document.getElementById('vp-otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="qc-page">
        <Navbar />
        <div className="qc-container" style={{ paddingTop: '60px', paddingBottom: '48px', maxWidth: '480px', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px', margin: '0 auto 20px'
          }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>
            Provider Verified!
          </h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--navy)', color: 'var(--gold)', padding: '8px 18px',
            borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '20px'
          }}>
            ✓ Trusted Partner Confirmed
          </div>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '32px' }}>
            This provider has been successfully verified for your booking. You can now proceed
            with the service, knowing they're genuinely sent by QuickConnect.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/components/Review')}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          >
            Continue to Review →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '480px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--navy)' }}>Verify Your Provider</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Enter the OTP your provider shares on arrival to confirm their identity.
          </p>
        </div>

        <div className="qc-card" style={{ padding: '28px' }}>
          <form onSubmit={handleVerify}>
            {error && <div className="qc-error">{error}</div>}

            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`vp-otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e.target.value, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  className="otp-box"
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '12px' }}
            >
              {loading ? <><span className="qc-spinner" /> Verifying...</> : 'Verify & Confirm Trust →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
