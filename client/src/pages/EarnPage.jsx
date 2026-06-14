import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import * as api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function EarnPage({ user }) {
  const navigate = useNavigate();
  const [videoAdValue, setVideoAdValue] = useState(0.05);
  const [userBalance, setUserBalance] = useState(user.balance);
  const [watching, setWatching] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  const [adCount, setAdCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAdValue();
  }, []);

  const loadAdValue = async () => {
    try {
      const response = await api.getVideoAdValue();
      setVideoAdValue(parseFloat(response.data.video_ad_value));
    } catch (error) {
      console.error('Failed to load ad value:', error);
    }
  };

  const earnAmount = (videoAdValue * 0.2).toFixed(4);

  const watchAd = async () => {
    setWatching(true);
    setMessage('Ad is playing...');

    // Simulate ad watching (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      await api.logEarning(earnAmount, 'video');
      const newBalance = parseFloat(userBalance) + parseFloat(earnAmount);
      setUserBalance(newBalance);
      setSessionEarnings(parseFloat(sessionEarnings) + parseFloat(earnAmount));
      setAdCount(adCount + 1);
      setMessage('✓ Ad watched! Earnings added.');
    } catch (error) {
      setMessage('Error: Failed to log earning');
    }

    setWatching(false);

    if (continuousMode) {
      // Auto-play next ad after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      watchAd();
    }
  };

  const toggleContinuousMode = () => {
    if (!continuousMode) {
      setContinuousMode(true);
      watchAd();
    } else {
      setContinuousMode(false);
      setMessage('Continuous mode stopped.');
    }
  };

  return (
    <UserLayout user={user} onLogout={() => {
      localStorage.removeItem('token');
      navigate('/');
    }}>
      <div>
        <h1 style={{ marginBottom: '1rem' }}>Watch & Earn</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>Earn ${earnAmount} per ad watched (20% of ${videoAdValue})</p>

        {/* Single Ad Mode */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3>Watch a Video Ad</h3>
          <div style={{
            background: '#e5e7eb',
            height: '200px',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            marginBottom: '1.5rem',
            fontSize: '3rem'
          }}>
            🎬
          </div>
          <button
            onClick={watchAd}
            disabled={watching || continuousMode}
            className="btn btn-success"
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
          >
            {watching ? 'Watching...' : 'Watch Ad Now'}
          </button>
        </div>

        {/* Continuous Mode */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Continuous Mode 🔄</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Ads will play automatically. Leave your phone and earn!</p>
          <button
            onClick={toggleContinuousMode}
            className={`btn ${continuousMode ? 'btn-danger' : 'btn-success'}`}
            style={{ padding: '0.75rem 2rem' }}
          >
            {continuousMode ? '⏹ Stop Continuous Mode' : '▶ Start Continuous Mode'}
          </button>
          {continuousMode && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ animation: 'pulse 2s infinite' }}>
                🔴 Continuous Mode Running
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#666' }}>
                Ads watched this session: <strong>{adCount}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Session Stats */}
        <div className="card-grid">
          <div className="card card-stat">
            <div className="card-stat-label">Current Balance</div>
            <div className="card-stat-value">${parseFloat(userBalance).toFixed(2)}</div>
          </div>
          <div className="card card-stat">
            <div className="card-stat-label">Session Earnings</div>
            <div className="card-stat-value" style={{ color: '#22c55e' }}>${parseFloat(sessionEarnings).toFixed(2)}</div>
          </div>
          <div className="card card-stat">
            <div className="card-stat-label">Ads Watched</div>
            <div className="card-stat-value">{adCount}</div>
          </div>
        </div>

        {message && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e0f2fe',
            color: '#0369a1',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </UserLayout>
  );
}

export default EarnPage;
