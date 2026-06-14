import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import * as api from '../utils/api';

function AdminSettingsPage({ user, onLogout }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoAdValue, setVideoAdValue] = useState('0.05');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.getAdminSettings();
      setSettings(response.data);
      setVideoAdValue(response.data.video_ad_value || '0.05');
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.updateAdminSetting('video_ad_value', videoAdValue);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout user={user} onLogout={onLogout}><div className="loading">Loading...</div></AdminLayout>;

  const userEarnsPercent = 20;
  const userEarnsPerAd = (parseFloat(videoAdValue) * (userEarnsPercent / 100)).toFixed(4);
  const youEarnPerAd = (parseFloat(videoAdValue) * ((100 - userEarnsPercent) / 100)).toFixed(4);

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

        {/* Video Ad Value */}
        <div className="card" style={{ maxWidth: '600px' }}>
          <h2>Video Ad Configuration</h2>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-group">
            <label className="form-label">Video Ad Value (USD)</label>
            <input
              type="number"
              value={videoAdValue}
              onChange={(e) => setVideoAdValue(e.target.value)}
              className="form-input"
              step="0.01"
              min="0.01"
              placeholder="0.05"
            />
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              This is the amount advertisers pay per video ad watched.
            </p>
          </div>

          {/* Revenue Breakdown */}
          <div className="card" style={{ background: '#f3f4f6', marginBottom: '1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Revenue Split</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>User Earns (20%)</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                  ${userEarnsPerAd}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>You Earn (80%)</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  ${youEarnPerAd}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div style={{
            background: '#e0f2fe',
            border: '1px solid #0284c7',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>💡 Pricing Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#0369a1', fontSize: '0.9rem' }}>
              <li>$0.01-$0.05: Best for starting out and growing user base</li>
              <li>$0.05-$0.10: Mid-tier pricing for established apps</li>
              <li>$0.10+: Premium pricing for high-value audiences</li>
              <li>Direct advertiser deals can pay 10-100x more than ad networks</li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            className="btn btn-success"
            disabled={saving}
            style={{ width: '100%' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Additional Settings */}
        <div className="card" style={{ marginTop: '2rem', maxWidth: '600px' }}>
          <h2>Platform Information</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>Ad Networks to Implement</label>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>• Google AdSense (banner ads)</p>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>• Google Ad Manager (video ads)</p>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>• Admob (mobile ads)</p>
            </div>
            <div>
              <label style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>Payment Integrations</label>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>✓ PayPal API configured</p>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>✓ Cash App ($Cashtag) ready</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettingsPage;
