import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import * as api from '../utils/api';

function AdminPayoutsPage({ adminToken, onLogout }) {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    loadPayouts();
  }, [filter]);

  const loadPayouts = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminPayouts(filter);
      setPayouts(response.data);
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.updatePayoutStatus(id, 'approved', editNote);
      setEditingId(null);
      setEditNote('');
      loadPayouts();
    } catch (error) {
      console.error('Failed to approve payout:', error);
    }
  };

  const handleDeny = async (id) => {
    try {
      await api.updatePayoutStatus(id, 'denied', editNote);
      setEditingId(null);
      setEditNote('');
      loadPayouts();
    } catch (error) {
      console.error('Failed to deny payout:', error);
    }
  };

  if (loading) return <AdminLayout adminToken={adminToken} onLogout={onLogout}><div className="loading">Loading...</div></AdminLayout>;

  return (
    <AdminLayout adminToken={adminToken} onLogout={onLogout}>
      <div>
        <h1 style={{ marginBottom: '2rem' }}>Payout Requests</h1>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
          {['pending', 'approved', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: filter === status ? '3px solid #3b82f6' : 'none',
                color: filter === status ? '#3b82f6' : '#666',
                marginBottom: '-1rem',
                paddingBottom: '1.5rem',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payouts Table */}
        <div className="card">
          {payouts.length === 0 ? (
            <p style={{ color: '#999' }}>No {filter} payout requests.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>
                      <strong>{payout.username}</strong>
                      <br />
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>{payout.email}</span>
                    </td>
                    <td>${parseFloat(payout.amount).toFixed(2)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{payout.payment_method}</td>
                    <td style={{ fontSize: '0.9rem', color: '#666' }}>{payout.payment_details}</td>
                    <td>{new Date(payout.created_at).toLocaleDateString()}</td>
                    <td>
                      {filter === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setEditingId(payout.id)}
                            className="btn btn-success btn-small"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setEditingId(-payout.id)}
                            className="btn btn-danger btn-small"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`badge badge-${payout.status === 'approved' ? 'success' : 'danger'}`}
                        >
                          {payout.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {editingId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingId > 0 ? 'Approve' : 'Deny'} Payout</h3>
              <div className="form-group">
                <label className="form-label">Admin Note (Optional)</label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="form-textarea"
                  placeholder="Add a note about this decision..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => {
                    if (editingId > 0) {
                      handleApprove(editingId);
                    } else {
                      handleDeny(-editingId);
                    }
                  }}
                  className={`btn ${editingId > 0 ? 'btn-success' : 'btn-danger'}`}
                  style={{ flex: 1 }}
                >
                  {editingId > 0 ? 'Approve' : 'Deny'}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditNote('');
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1, color: '#666', borderColor: '#ccc' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPayoutsPage;
