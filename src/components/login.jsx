import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userName', res.data.userName);
      navigate('/components/Home');
    } catch {
      setError('Invalid email or password. Please try again.');
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

        <h2 className="qc-auth-title">Login</h2>

        {error && <div className="qc-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="qc-field">
            <label className="qc-label">Email</label>
            <input
              className="qc-input"
              type="email"
              placeholder="jamesbond7@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="qc-field">
            <label className="qc-label">Password</label>
            <input
              className="qc-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
          >
            {loading ? <><span className="qc-spinner" /> Logging in...</> : 'Login →'}
          </button>
        </form>

        <p className="qc-auth-footer">
          Don't have an account? <Link to="/components/Register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
