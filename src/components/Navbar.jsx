import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [city, setCity]           = useState(localStorage.getItem('qc_city') || '');
  const [detecting, setDetecting] = useState(false);
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-detect city on first load if none saved
  useEffect(() => {
    if (city) return;
    setDetecting(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state_district ||
            'Your location';
          setCity(detected);
          localStorage.setItem('qc_city', detected);
        } catch {
          setCity('Set location');
        } finally {
          setDetecting(false);
        }
      },
      () => {
        // User denied or error — let them type it
        setCity('Set location');
        setDetecting(false);
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/components/Login');
  };

  const openEdit = () => {
    setDraft(city === 'Set location' ? '' : city);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const saveCity = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      setCity(trimmed);
      localStorage.setItem('qc_city', trimmed);
    }
    setEditing(false);
  };

  return (
    <nav className="qc-navbar">
      <div className="qc-navbar-inner">
        {/* Brand */}
        <Link to="/components/Home" className="qc-brand">
          <div className="qc-brand-icon">
            <img src="/images/logo.jpg" alt="QuickConnect" />
          </div>
        </Link>

        {/* Links */}
        <div className="qc-nav-links">

          {/* Location */}
          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px' }}>📍</span>
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveCity(); if (e.key === 'Escape') setEditing(false); }}
                onBlur={saveCity}
                placeholder="Enter city..."
                style={{
                  border: 'none', borderBottom: '1.5px solid var(--navy)',
                  background: 'transparent', outline: 'none',
                  fontSize: '13px', color: 'var(--navy)', width: '110px',
                  fontFamily: 'Inter, sans-serif', padding: '2px 0',
                }}
              />
            </div>
          ) : (
            <button
              onClick={openEdit}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--muted)',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'Inter, sans-serif', padding: 0,
              }}
              title="Click to change location"
            >
              📍 {detecting ? 'Detecting...' : city || 'Set location'}
              <span style={{ fontSize: '10px', color: 'var(--border)', marginLeft: '2px' }}></span>
            </button>
          )}

          <Link to="/components/Services" style={{ fontWeight: 'bold', color: '#031E3A' }}>Services</Link>
          <Link to="/components/Booking" style={{ fontWeight: 'bold', color: '#031E3A' }}>Bookings</Link>
          <button style={{ fontWeight: 'bolder', color: '#031E3A' }} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
