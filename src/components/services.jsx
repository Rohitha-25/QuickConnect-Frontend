import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const CATEGORY_ICONS = {
  cleaning:       '🧹',
  electrician:    '⚡',
  'car repair':   '🚗',
  salon:          '✂️',
  'laptop repair':'💻',
  yoga:           '🧘',
  plumbing:       '🛠️',
  painting:       '🖌️',
};

const getIcon = (category = '') => {
  const key = Object.keys(CATEGORY_ICONS).find(k => category.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : '🔧';
};

export default function Services() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [searchParams]            = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);

    axios.get('/services')
      .then(r => { setServices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = services.filter(s =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (service) => {
    localStorage.setItem('preselectedServiceId', service.id);
    navigate('/components/Booking');
  };

  return (
    <div className="qc-page">
      <Navbar />

      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>All Services</h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              {filtered.length} service{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <input
            className="qc-input"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '240px' }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
            <span className="qc-spinner" style={{ width: '28px', height: '28px' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(service => (
              <div key={service.id} className="qc-card" style={{ padding: '20px' }}>
                {/* Icon + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'var(--navy-bg)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0
                  }}>
                    {getIcon(service.category || service.serviceName)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>
                      {service.serviceName}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {service.category}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {service.description || 'Professional service by verified experts.'}
                </p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)' }}>
                    ₹{service.price}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => navigate(`/components/Reviews/${service.id}`)}
                    >
                      View Reviews
                    </button>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                      onClick={() => handleBook(service)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px' }}>No services found</p>
            <p style={{ fontSize: '13px' }}>Try a different search term</p>
            <button className="btn-outline" style={{ marginTop: '20px' }} onClick={() => setSearch('')}>
              Show all services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
