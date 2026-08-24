import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm_password: '', phone: '', role: 'USER' });
  const [error, setError]     = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    if (form.confirm_password != form.password) {
      setError('Password doesn\'t match!'); return;
    }
    setLoading(true);
    try {
      const endpoint = form.role === 'PROVIDER'
        ? '/auth/register/provider'
        : '/auth/register';
      await axios.post(endpoint, form);
      setMessage('Account created! Redirecting to login...');
      setTimeout(() => navigate('/components/Login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qc-auth-page">
      <div className="qc-auth-card">

        <div className="qc-auth-logo">
          <img src="/images/logo.jpg" alt="QuickConnect" />
        </div>

        <h2 className="qc-auth-title">Create an account</h2>

        {error   && <div className="qc-error">{error}</div>}
        {message && <div className="qc-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="qc-field">
            <label className="qc-label">Name</label>
            <input className="qc-input" name="name" placeholder="James Bond"
              value={form.name} onChange={handleChange} required />
          </div>

          <div className="qc-field">
            <label className="qc-label">Email</label>
            <input className="qc-input" name="email" type="email" placeholder="jamesbond7@mail.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="qc-field">
            <label className="qc-label">Phone</label>
            <input className="qc-input" name="phone" placeholder="+91 98765 43210"
              value={form.phone} onChange={handleChange} required />
          </div>

          <div className="qc-field">
            <label className="qc-label">Password</label>
            <input className="qc-input" name="password" type="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} required />
          </div>

          <div className="qc-field">
            <label className="qc-label">Confirm Password</label>
            <input className="qc-input" name="confirm_password" type="password" placeholder="Confirm your password"
              value={form.confirm_password} onChange={handleChange} required />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
          >
            {loading ? <><span className="qc-spinner" /> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p className="qc-auth-footer">
          Already have an account? <Link to="/components/Login">Login</Link>
        </p>
      </div>
    </div>
  );
}
