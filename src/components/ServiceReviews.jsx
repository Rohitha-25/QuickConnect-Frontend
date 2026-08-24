import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

export default function ServiceReviews() {
  const { serviceId } = useParams();
  const [reviews, setReviews]         = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/reviews/service/${serviceId}`)
      .then(r => { setReviews(r.data); setLoading(false); })
      .catch(() => setLoading(false));

    axios.get(`/services`)
      .then(r => {
        const found = r.data.find(s => String(s.id) === String(serviceId));
        if (found) setServiceName(found.serviceName);
      })
      .catch(console.error);
  }, [serviceId]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '640px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '13px', fontWeight: 'bolder', padding: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>
            Customer Reviews
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {serviceName}
          </p>
        </div>

        {/* Rating summary */}
        {avgRating && (
            <div style={{
                background: 'var(--navy)', borderRadius: '12px', padding: '20px 24px',
                marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px'
                }}>
                {/* Average score */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontSize: '52px', fontWeight: '700', color: 'var(--gold)', lineHeight: 1 }}>
                    {avgRating}
                    </p>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '6px 0' }}>
                    {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ fontSize: '16px', color: star <= Math.round(avgRating) ? 'var(--gold)' : 'rgba(221, 152, 50, 0.48)' }}>
                        ⚡
                        </span>
                    ))}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--gold)' }}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Rating breakdown bars */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                    return (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--gold)', width: '8px', textAlign: 'right' }}>{star}</span>
                        <span style={{ fontSize: '11px', color: 'var(--gold)' }}>⚡</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(250,199,117,0.15)', borderRadius: '3px' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gold)', borderRadius: '3px', transition: 'width 0.5s' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'rgba(250,199,117,0.6)', width: '16px' }}>{count}</span>
                        </div>
                    );
                    })}
                </div>
            </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <span className="qc-spinner" style={{ width: '28px', height: '28px' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</p>
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px' }}>No reviews yet</p>
            <p style={{ fontSize: '13px' }}>Be the first to review this service!</p>
            <button className="btn-primary" style={{ marginTop: '16px' }}
              onClick={() => navigate('/components/Booking')}>
              Book Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((r, i) => (
                <div key={i} className="qc-card" style={{ padding: '18px 20px' }}>

                    {/* Top row — username + date */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'var(--navy)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '14px', fontWeight: '700',
                        color: 'var(--gold)', flexShrink: 0
                        }}>
                        {r.userName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)' }}>
                            @{r.userName || 'Anonymous'}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{r.date}</p>
                        </div>
                    </div>

                    {/* Star count badge */}
                    <div style={{
                        background: 'var(--gold-bg)', borderRadius: '999px',
                        padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        <span style={{ fontSize: '12px', color: 'var(--gold-text)', fontWeight: '700' }}>{r.rating}</span>
                        <span style={{ fontSize: '12px', color: 'var(--gold)' }}>⚡</span>
                    </div>
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                    {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ fontSize: '16px', color: star <= r.rating ? 'var(--gold)' : '#c77e1e5b' }}>
                        ⚡
                        </span>
                    ))}
                    </div>

                    {/* Comment */}
                    <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.6' }}>
                    {r.comment}
                    </p>
                </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}