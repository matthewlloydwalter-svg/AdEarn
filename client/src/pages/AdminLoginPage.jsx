import React, { useState } from 'react';
import axios from 'axios';

function AdminLoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', { password });
      onLogin(response.data.token);
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', padding: '1rem' }}>
        <div className="card">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#1f2937' }}>🔐 Admin Panel</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>watchad2earn.com/admin</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter admin password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? '🔒 Authenticating...' : '🔓 Login to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
