import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import * as api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function HistoryPage({ user }) {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('earnings');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [earningsRes, payoutsRes] = await Promise.all([
        api.getEarningsHistory(),
        api.getPayoutRequests(),
      ]);
      setEarnings(earningsRes.data);
      setPayouts(payoutsRes.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <UserLayout user={user}><div className="loading">Loading...</div></UserLayout>;

  return (
    <UserLayout user={user} onLogout={() => {
      localStorage.removeItem('token');
      navigate('/');
    }}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>History</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('earnings')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'earnings' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'earnings' ? '#3b82f6' : '#666',
              marginBottom: '-1rem',
              paddingBottom: '1.5rem',
            }}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'payouts' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'payouts' ? '#3b82f6' : '#666',
              marginBottom: '-1rem',
              paddingBottom: '1.5rem',
            }}
          >
            Payout Requests
          </button>
        </div>

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="card">
            <h2>Earnings History</h2>
            {earnings.length === 0 ? (
              <p style={{ color: '#999' }}>No earnings yet. Start watching ads!</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning) => (
                    <tr key={earning.id}>
                      <td>{new Date(earning.created_at).toLocaleString()}</td>
                      <td>{earning.ad_type}</td>
                      <td className="text-success" style={{ fontWeight: '600' }}>
                        +${parseFloat(earning.amount).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="card">
            <h2>Payout Requests</h2>
            {payouts.length === 0 ? (
              <p style={{ color: '#999' }}>No payout requests yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td>{new Date(payout.created_at).toLocaleDateString()}</td>
                      <td>${parseFloat(payout.amount).toFixed(2)}</td>
                      <td>{payout.payment_method}</td>
                      <td>
                        <span
                          className={`badge badge-${payout.status === 'approved' ? 'success' : payout.status === 'denied' ? 'danger' : 'warning'}`}
                        >
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default HistoryPage;
