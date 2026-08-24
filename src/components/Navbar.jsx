import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const INDIAN_CITIES = [
  'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal',
  'Visakhapatnam', 'Coimbatore', 'Kochi', 'Chandigarh', 'Guwahati',
];

export default function Navbar() {
  const [city, setCity]                 = useState(localStorage.getItem('qc_city') || '');
  const [detecting, setDetecting]       = useState(false);
  const [showPicker, setShowPicker]     = useState(false);
  const [search, setSearch]             = useState('');

  const pickerRef = useRef(null);
  const navigate = useNavigate();

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
          setShowPicker(true);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        setShowPicker(true);
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/components/Login');
  };

  const selectCity = (c) => {
    setCity(c);
    localStorage.setItem('qc_city', c);
    setShowPicker(false);
    setSearch('');
  };

  const filteredCities = INDIAN_CITIES.filter(c => 
    c.toLowerCase().includes(search.toLowerCase())
  );

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

          {/* Location picker */}
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPicker(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--muted)', padding: 0,
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              📍 {detecting ? 'Detecting...' : city || 'Set location'}
              <span style={{ fontSize: '9px', color: 'var(--border)' }}>▼</span>
            </button>

            {/* Dropdown */}
            {showPicker && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--white)', border: '1.5px solid var(--border)',
                borderRadius: '12px', padding: '12px',
                width: '220px', zIndex: 300,
                boxShadow: '0 8px 24px rgba(4,44,83,0.12)',
              }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Select your city
                </p>

                {/* Search within cities */}
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search city..."
                  style={{
                    width: '100%', padding: '7px 10px', marginBottom: '8px',
                    border: '1.5px solid var(--border)', borderRadius: '8px',
                    fontSize: '12px', outline: 'none', fontFamily: 'Inter, sans-serif',
                    color: 'var(--text)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--navy)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />

                {/* Detect automatically option */}
                <button
                  onClick={() => {
                    setShowPicker(false);
                    setCity('');
                    localStorage.removeItem('qc_city');
                    setDetecting(true);
                    navigator.geolocation?.getCurrentPosition(
                      async (pos) => {
                        try {
                          const { latitude, longitude } = pos.coords;
                          const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                          );
                          const data = await res.json();
                          const detected = data.address?.city || data.address?.town || data.address?.state_district || '';
                          if (detected) { setCity(detected); localStorage.setItem('qc_city', detected); }
                        } catch {}
                        finally { setDetecting(false); }
                      },
                      () => setDetecting(false)
                    );
                  }}
                  style={{
                    width: '100%', padding: '7px 10px', marginBottom: '6px',
                    background: 'var(--navy-bg)', border: '1.5px solid var(--navy-bg)',
                    borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    color: 'var(--navy)', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  📡 Detect my location
                </button>

                {/* City list */}
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {filteredCities.map(c => (
                    <button
                      key={c}
                      onClick={() => selectCity(c)}
                      style={{
                        padding: '7px 10px', background: city === c ? 'var(--navy-bg)' : 'transparent',
                        border: 'none', borderRadius: '6px', fontSize: '13px',
                        color: city === c ? 'var(--navy)' : 'var(--text)',
                        fontWeight: city === c ? '600' : '400',
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (city !== c) e.target.style.background = 'var(--bg)'; }}
                      onMouseLeave={e => { if (city !== c) e.target.style.background = 'transparent'; }}
                    >
                      {c}
                    </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <p style={{ fontSize: '12px', color: 'var(--muted)', padding: '6px 10px' }}>No cities found!</p>
                    )}
                </div>
              </div>
            )}
          </div>

          <Link to="/components/Profile" style={{ fontWeight: 'bold', color: '#031E3A' }}>Profile</Link>
          <Link to="/components/Services" style={{ fontWeight: 'bold', color: '#031E3A' }}>Services</Link>
          <Link to="/components/BookingHistory" style={{ fontWeight: 'bold', color: '#031E3A' }}>Bookings</Link>
          <button style={{ fontWeight: 'bolder', color: '#031E3A' }} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
