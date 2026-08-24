import axios from '../api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Profile() {
  const[user, setUser]                      = useState(null);
  const [bookingCount, setBookingCount]     = useState(0);
  const [reviewCount, setReviewCount]       = useState(0);
  const [editing, setEditing]               = useState(false);
  const [form, setForm]                     = useState({ name: '', email: '', phone: '' });
  const [password, setPassword]             = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [showPassword, setShowPassword]     = useState(false);
  const [message, setMessage]               = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [deleteAccount, setDeleteAccount]   = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/users/get/${userId}`)
        .then(r => {
            setUser(r.data);
            setForm({
                name: r.data.name,
                email: r.data.email,
                phone: r.data.phone
            });
        })
        .catch(console.error);

    axios.get(`/bookings/user/${userId}`)
        .then(r => setBookingCount(r.data.length))
        .catch(console.error);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    try {
        const res = await axios.put(`/users/update/${userId}`, form);
        setUser(res.data);
        localStorage.setItem('userName', res.data.name);
        setEditing(false);
        setMessage('Profile updated successfully!');
    } catch {
        setError('Failed to update profile.');
    } finally {
        setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (password.newPassword !== password.confirm) {
        setError('Password does not match!');
        return;
    }
    if (password.newPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
        await axios.put(`/users/change-password/${userId}`, {
            oldPassword: password.oldPassword,
            newPassword: password.newPassword,
        });
        setMessage('Password changed successfully!');
        setPassword({
            oldPassword: '', newPassword: '', confirm: ''
        });
        setShowPassword(false);
    } catch (err) {
        setError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
        await axios.delete(`/users/delete/${userId}`);
        localStorage.clear();
        navigate('/components/Login');
    } catch {
        setError('Failed to delete account. Please contact support.');
    }
  };

  if (!user) return (
    <div className="qc-page">
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <span className="qc-spinner" style={{ width: '28px', height: '28px' }} />
      </div>
    </div>
  );

  return (
    <div className="qc-page">
      <Navbar />
      <div className="qc-container" style={{ paddingTop: '36px', paddingBottom: '48px', maxWidth: '600px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy)' }}>My Profile</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Manage your account details and preferences
          </p>
        </div>

        {message && <div className="qc-success">{message}</div>}
        {error   && <div className="qc-error">{error}</div>}

         {/* Avatar + stats */}
        <div style={{
          background: 'var(--navy)', borderRadius: '16px', padding: '24px',
          display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--gold)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '28px', fontWeight: '700',
            color: 'var(--navy)', flexShrink: 0
          }}>
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{user.name}</p>
            <p style={{ fontSize: '13px', color: 'rgba(250,199,117,0.7)' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--gold)' }}>{bookingCount}</p>
              <p style={{ fontSize: '11px', color: 'rgba(250,199,117,0.6)' }}>Bookings</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="qc-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>User Details</h3>
            {!editing && (
              <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => { setEditing(true); setMessage(''); setError(''); }}>
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate}>
              <div className="qc-field">
                <label className="qc-label">Name</label>
                <input className="qc-input" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="qc-field">
                <label className="qc-label">E-mail</label>
                <input className="qc-input" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="qc-field">
                <label className="qc-label">Phone</label>
                <input className="qc-input" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" disabled={loading}
                  style={{ fontSize: '13px', padding: '8px 18px' }}>
                  {loading ? <><span className="qc-spinner" /> Saving...</> : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" style={{ fontSize: '13px', padding: '8px 18px' }}
                  onClick={() => { setEditing(false); setError(''); }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Name', value: user.name, icon: '😃' },
                { label: 'Email', value: user.email, icon: '📧' },
                { label: 'Phone', value: user.phone, icon: '📱' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', width: '20px' }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                    <p style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: '600' }}>{item.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change password */}
        <div className="qc-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPassword ? '16px' : '0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)' }}>Change Password</h3>
            <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 14px' }}
              onClick={() => { setShowPassword(v => !v); setError(''); setMessage(''); }}>
              {showPassword ? 'Cancel' : 'Change'}
            </button>
          </div>

          {showPassword && (
            <form onSubmit={handlePasswordChange}>
              <div className="qc-field">
                <label className="qc-label">Old Password</label>
                <input className="qc-input" type="password" value={password.oldPassword}
                  onChange={e => setPassword(f => ({ ...f, oldPassword: e.target.value }))} required />
              </div>
              <div className="qc-field">
                <label className="qc-label">New Password</label>
                <input className="qc-input" type="password" value={password.newPassword}
                  onChange={e => setPassword(f => ({ ...f, newPassword: e.target.value }))} required />
              </div>
              <div className="qc-field">
                <label className="qc-label">Confirm New Password</label>
                <input className="qc-input" type="password" value={password.confirm}
                  onChange={e => setPassword(f => ({ ...f, confirm: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}
                style={{ fontSize: '13px', padding: '8px 18px', marginTop: '8px' }}>
                {loading ? <><span className="qc-spinner" /> Updating...</> : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* Delete account */}
        <div className="qc-card" style={{ padding: '20px', border: '1.5px solid #FCA5A5' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#DC2626', marginBottom: '6px' }}>
            Delete Account
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px' }}>
            This will permanently delete your account and all booking history. This action cannot be undone.
          </p>
          {!deleteAccount ? (
            <button style={{
              fontSize: '13px', padding: '8px 18px', border: '1.5px solid #DC2626',
              borderRadius: '8px', background: 'transparent', color: '#DC2626',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }} onClick={() => setDeleteAccount(true)}>
              Delete My Account
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', color: '#DC2626', fontWeight: '500' }}>Are you sure?</p>
              <button style={{
                fontSize: '13px', padding: '8px 18px', border: 'none',
                borderRadius: '8px', background: '#DC2626', color: '#FFFFFF',
                fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }} onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn-outline" style={{ fontSize: '13px', padding: '8px 18px' }}
                onClick={() => setDeleteAccount(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
