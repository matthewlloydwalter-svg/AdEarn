import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import * as api from '../utils/api';

function AdminOverviewPage({ user, onLogout }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI assistant. I can help you understand your platform metrics or answer questions about AdEarn. What would you like to know?' }
  ]);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const response = await api.getAdminOverview();
      setOverview(response.data);
    } catch (error) {
      console.error('Failed to load overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISubmit = (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    // Add user message
    const newChat = [...aiChat, { role: 'user', content: aiMessage }];
    setAiChat(newChat);
    setAiMessage('');

    // Simulate AI response (in production, call actual AI API)
    setTimeout(() => {
      let response = '';
      const msg = aiMessage.toLowerCase();

      if (msg.includes('revenue') || msg.includes('earnings')) {
        response = `Your total earnings so far: $${parseFloat(overview.total_earnings).toFixed(2)}. You've paid out $${parseFloat(overview.total_paid_out).toFixed(2)} with $${parseFloat(overview.total_pending).toFixed(2)} pending.`;
      } else if (msg.includes('users')) {
        response = `You currently have ${overview.total_users} active users on your platform.`;
      } else if (msg.includes('grow') || msg.includes('increase')) {
        response = 'To grow your user base: 1) Increase ad rates gradually 2) Promote your app on social media 3) Consider referral bonuses 4) Optimize user experience';
      } else if (msg.includes('payout')) {
        response = `You have $${parseFloat(overview.total_pending).toFixed(2)} in pending payouts. Visit the Payouts section to approve or deny requests.`;
      } else {
        response = 'I can help with: revenue stats, user count, growth strategies, payout status, or platform management. What would you like to know?';
      }

      setAiChat((prev) => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  if (loading) return <AdminLayout user={user} onLogout={onLogout}><div className="loading">Loading...</div></AdminLayout>;

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Admin Overview</h1>

        {/* Stats Cards */}
        <div className="card-grid">
          <div className="card card-stat">
            <div className="card-stat-label">Total Users</div>
            <div className="card-stat-value">{overview?.total_users}</div>
          </div>
          <div className="card card-stat">
            <div className="card-stat-label">Total Earnings</div>
            <div className="card-stat-value" style={{ color: '#22c55e' }}>
              ${parseFloat(overview?.total_earnings || 0).toFixed(2)}
            </div>
          </div>
          <div className="card card-stat">
            <div className="card-stat-label">Total Paid Out</div>
            <div className="card-stat-value" style={{ color: '#3b82f6' }}>
              ${parseFloat(overview?.total_paid_out || 0).toFixed(2)}
            </div>
          </div>
          <div className="card card-stat">
            <div className="card-stat-label">Pending Payouts</div>
            <div className="card-stat-value" style={{ color: '#f59e0b' }}>
              ${parseFloat(overview?.total_pending || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>🤖 AI Assistant</h2>
            <button
              onClick={() => setShowAI(!showAI)}
              className="btn btn-primary btn-small"
            >
              {showAI ? 'Close' : 'Open'}
            </button>
          </div>

          {showAI && (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              background: '#f9fafb',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Chat Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                {aiChat.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      background: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                      color: msg.role === 'user' ? '#fff' : '#1f2937',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleAISubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="form-input"
                  placeholder="Ask me anything..."
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOverviewPage;
