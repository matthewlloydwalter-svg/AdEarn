import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import * as api from '../utils/api';

function AdminUsersPage({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminUsers(search);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewUser = async (userId) => {
    try {
      const response = await api.getAdminUser(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  if (loading) return <AdminLayout user={user} onLogout={onLogout}><div className="loading">Loading...</div></AdminLayout>;

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Users</h1>

        {/* Search */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            placeholder="Search by email or username..."
          />
        </div>

        {/* Users Table */}
        <div className="card">
          {users.length === 0 ? (
            <p style={{ color: '#999' }}>No users found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Total Earned</th>
                  <th>Total Withdrawn</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.email}</td>
                    <td>${parseFloat(u.balance).toFixed(2)}</td>
                    <td className="text-success">${parseFloat(u.total_earned).toFixed(2)}</td>
                    <td className="text-primary">${parseFloat(u.total_withdrawn).toFixed(2)}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => viewUser(u.id)}
                        className="btn btn-primary btn-small"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                ✕
              </button>

              <h2>{selectedUser.user.username}</h2>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>{selectedUser.user.email}</p>

              {/* Stats */}
              <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '2rem' }}>
                <div className="card card-stat">
                  <div className="card-stat-label">Current Balance</div>
                  <div className="card-stat-value">${parseFloat(selectedUser.user.balance).toFixed(2)}</div>
                </div>
                <div className="card card-stat">
                  <div className="card-stat-label">Total Earned</div>
                  <div className="card-stat-value" style={{ color: '#22c55e' }}>
                    ${parseFloat(selectedUser.user.total_earned).toFixed(2)}
                  </div>
                </div>
                <div className="card card-stat">
                  <div className="card-stat-label">Total Withdrawn</div>
                  <div className="card-stat-value" style={{ color: '#3b82f6' }}>
                    ${parseFloat(selectedUser.user.total_withdrawn).toFixed(2)}
                  </div>
                </div>
                <div className="card card-stat">
                  <div className="card-stat-label">Joined</div>
                  <div style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#666' }}>
                    {new Date(selectedUser.user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Earnings */}
              {selectedUser.earnings.length > 0 && (
                <div className="card">
                  <h3>Recent Earnings</h3>
                  <table className="table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.earnings.slice(0, 5).map((earning) => (
                        <tr key={earning.id}>
                          <td>{new Date(earning.created_at).toLocaleDateString()}</td>
                          <td>{earning.ad_type}</td>
                          <td className="text-success">+${parseFloat(earning.amount).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Payouts */}
              {selectedUser.payouts.length > 0 && (
                <div className="card">
                  <h3>Payout Requests</h3>
                  <table className="table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.payouts.map((payout) => (
                        <tr key={payout.id}>
                          <td>{new Date(payout.created_at).toLocaleDateString()}</td>
                          <td>${parseFloat(payout.amount).toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-${payout.status === 'approved' ? 'success' : payout.status === 'denied' ? 'danger' : 'warning'}`}>
                              {payout.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;
