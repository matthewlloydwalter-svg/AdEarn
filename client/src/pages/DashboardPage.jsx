import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import * as api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <UserLayout user={user}><div className="loading">Loading...</div></UserLayout>;

  const userData = dashboard?.user || user;

  return (
    <UserLayout user={user} onLogout={() => {
      localStorage.removeItem('token');
      navigate('/');
    }}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Welcome, {userData.username}!</h1>

        {/* Stats Cards */}
        <div className="card-grid">
          <div className="card card-stat">
            <div className="card-stat-label">Current Balance</div>
            <div className="card-stat-value">${parseFloat(userData.balance).toFixed(2)}</div>
            <button onClick={() => navigate('/cashout')} className="btn btn-success btn-small" style={{ marginTop: '1rem' }}>
              Cash Out
            </button>
          </div>

          <div className="card card-stat">
            <div className="card-stat-label">Total Earned</div>
            <div className="card-stat-value">${parseFloat(userData.total_earned).toFixed(2)}</div>
          </div>

          <div className="card card-stat">
            <div className="card-stat-label">Total Withdrawn</div>
            <div className="card-stat-value">${parseFloat(userData.total_withdrawn).toFixed(2)}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', padding: '2rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Start Earning Now!</h2>
          <button onClick={() => navigate('/earn')} className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff', padding: '0.75rem 2rem' }}>
            Watch & Earn
          </button>
        </div>

        {/* Recent Activity */}
        {dashboard?.recent_earnings && dashboard.recent_earnings.length > 0 && (
          <div className="card">
            <h2>Recent Activity</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recent_earnings.map((earning) => (
                  <tr key={earning.id}>
                    <td>{new Date(earning.created_at).toLocaleDateString()}</td>
                    <td>{earning.ad_type}</td>
                    <td className="text-success" style={{ fontWeight: '600' }}>
                      +${parseFloat(earning.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default DashboardPage;
