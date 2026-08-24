import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';
import AIAssistant from './AIAssistant';

const userName = localStorage.getItem('userName') || 'there';

const CATEGORY_ICONS = {
  cleaning:       { icon: '🧹', bg: 'var(--navy-bg)', color: 'var(--navy)' },
  electrician:    { icon: '⚡', bg: 'var(--gold-bg)', color: 'var(--gold-text)' },
  'car repair':   { icon: '🚗', bg: 'var(--navy-bg)', color: 'var(--navy)' },
  salon:          { icon: '✂️', bg: 'var(--gold-bg)', color: 'var(--gold-text)' },
  'laptop repair':{ icon: '💻', bg: 'var(--navy-bg)', color: 'var(--navy)' },
  yoga:           { icon: '🧘', bg: 'var(--gold-bg)', color: 'var(--gold-text)' },
  plumbing:       { icon: '🛠️', bg: 'var(--navy-bg)', color: 'var(--navy)' },
  painting:       { icon: '🖌️', bg: 'var(--gold-bg)', color: 'var(--gold-text)' },
};

const getIconData = (category = '') => {
  const key = Object.keys(CATEGORY_ICONS).find(k => category.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : { icon: '🔧', bg: 'var(--navy-bg)', color: 'var(--navy)' };
};

export default function Home() {
  const [services, setServices]       = useState([]);
  const [search, setSearch]           = useState('');
  const [showAI, setShowAI]           = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/services').then(r => setServices(r.data)).catch(console.error);
  }, []);

  const filtered = services.filter(s =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    if (search.trim()) navigate(`/components/Services?q=${encodeURIComponent(search)}`);
  };

  const handleServiceClick = (service) => {
    localStorage.setItem('preselectedServiceId', service.id);
    navigate('/components/Booking');
  };

  return (
    <div className="qc-page">
      <Navbar />

      <div className="qc-container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '24px', color: 'var(--gold-text)', marginBottom: '4px' }}>
            👋 Hi, <strong style={{ color: 'var(--navy)' }}>{userName}!</strong>
          </h1>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>
            Home Services. On Demand.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--gold-text)', marginBottom: '24px' }}>
            where needs meet expertise..
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto' }}>
            <input
              className="qc-input"
              placeholder="Search for a service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={handleSearch} style={{ padding: '10px 24px', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </div>
        </div>

        {/* AI Banner */}
        <div className="qc-ai-banner" style={{ marginBottom: '36px' }}>
          <div className="qc-ai-icon">✦</div>
          <div className="qc-ai-text" style={{ flex: 1 }}>
            <h4>Not sure what you need?</h4>
            <p>Tell our assistant what's wrong — it'll find the right service for you</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAI(true)}>
            Ask now
          </button>
        </div>

        {/* Categories grid */}
        <p className="qc-section-label">Popular categories</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px'
        }}>
          {(search ? filtered : services.slice(0, 6)).map(service => {
            const { icon, bg, color } = getIconData(service.category || service.serviceName);
            return (
              <div
                key={service.id}
                className="qc-card"
                onClick={() => handleServiceClick(service)}
                style={{ padding: '24px 16px', textAlign: 'center', cursor: 'pointer' }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px'
                }}>
                  {icon}
                </div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)', marginBottom: '4px' }}>
                  {service.serviceName}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  ₹{service.price}
                </p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && search && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</p>
            <p>No services found for "{search}"</p>
            <button className="btn-outline" style={{ marginTop: '16px' }} onClick={() => setSearch('')}>
              Clear search
            </button>
          </div>
        )}
      </div>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} services={services} />}
    </div>
  );
}
