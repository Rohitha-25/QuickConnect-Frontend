import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Navbar from './Navbar';

const bookingId = localStorage.getItem('bookingId');

export default function Review() {
  const [serviceId, setServiceId]     = useState('');
  const [serviceName, setServiceName] = useState('');
  const [rating, setRating]           = useState(0);
  const [hovered, setHovered]         = useState(0);
  const [comment, setComment]         = useState('');
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    if (!bookingId) return;
    axios.get(`/bookings/get/${bookingId}`)
      .then(r => {
        setServiceId(String(r.data.service?.id || ''));
        setServiceName(r.data.service?.serviceName || '');
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    setLoading(true); setError(''); setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`/reviews/add/${userId}/${serviceId}`, {
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
      });
      setMessage('Thank you for your review! Redirecting...');
      setTimeout(() => navigate('/components/Home'), 1500);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '560px' }}>

        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>⭐Leave a Review</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Your feedback helps us improve.
          </p>
        </div>

        <div className="qc-card" style={{ padding: '28px' }}>
          <form onSubmit={handleSubmit}>

            {/* Star rating */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', fontWeight: '500' }}>
                Satisfied? Rate our service.
              </p>
              <div className="star-rating" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= (hovered || rating) ? 'active' : ''}`}
                    onClick={() => { setRating(star); setError(''); }}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                  >
                    ⚡
                  </span>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--gold-text)' }}>
                  {RATING_LABELS[hovered || rating]}
                </p>
              )}
            </div>

            {/* Service Name */}
            <div className="qc-field">
              <label className="qc-label">Service</label>
              <input
                className="qc-input"
                value={serviceName}
                readOnly
                style={{ background: 'var(--bg)', cursor: 'not-allowed' }}
              />
            </div>

            {/* Comment */}
            <div className="qc-field">
              <label className="qc-label">Your Feedback</label>
              <textarea
                className="qc-input"
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                style={{ resize: 'none' }}
                required
              />
            </div>

            {error   && <div className="qc-error">{error}</div>}
            {message && <div className="qc-success">{message}</div>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate('/components/Home')}
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              >
                Skip
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2, justifyContent: 'center', padding: '12px' }}
              >
                {loading ? <><span className="qc-spinner" /> Submitting...</> : 'Submit Review →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
