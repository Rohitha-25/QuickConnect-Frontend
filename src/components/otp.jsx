import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function OTP() {
  const [otp, setOtp]             = useState(new Array(OTP_LENGTH).fill(''));
  const [generatedOtp, setGenOtp] = useState('');
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [cooldown, setCooldown]   = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGenOtp(newOtp);
    console.log(`OTP: ${newOtp}`);
    setMessage('OTP sent to your registered contact.');
  };

  useEffect(() => { generateOtp(); }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else { setCanResend(true); }
  }, [cooldown]);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1)
      document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < OTP_LENGTH) { setError('Please enter the complete 6-digit OTP.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    if (entered === generatedOtp) {
      setMessage('OTP verified! Redirecting to payment...');
      setTimeout(() => navigate('/components/Payment'), 1200);
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(new Array(OTP_LENGTH).fill(''));
      document.getElementById('otp-0')?.focus();
    }
    setLoading(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(new Array(OTP_LENGTH).fill(''));
    setError(''); setCooldown(RESEND_COOLDOWN); setCanResend(false);
    generateOtp();
    document.getElementById('otp-0')?.focus();
  };

  return (
    <div className="qc-auth-page">
      <div className="qc-auth-card" style={{ maxWidth: '400px' }}>

        <div className="qc-auth-logo">
          <img src="/images/logo.jpg" alt="QuickConnect" />
          <h1>QuickConnect</h1>
          <p>where needs meet expertise</p>
        </div>

        <form onSubmit={handleVerify}>
          <h2 className="qc-auth-title">Verify Booking</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            Enter the 6-digit OTP sent to your registered contact.
          </p>

          {message && <div className="qc-success">{message}</div>}
          {error   && <div className="qc-error">{error}</div>}

          <div className="otp-boxes">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
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
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '14px' }}
          >
            {loading ? <><span className="qc-spinner" /> Verifying...</> : 'Verify OTP'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
          Didn't receive it?{' '}
          <span
            onClick={handleResend}
            style={{ color: canResend ? 'var(--navy)' : 'var(--border)', cursor: canResend ? 'pointer' : 'not-allowed', fontWeight: '600' }}
          >
            {canResend ? 'Resend OTP' : `Resend in ${cooldown}s`}
          </span>
        </p>
      </div>
    </div>
  );
}
