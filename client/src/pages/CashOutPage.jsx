import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import * as api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function CashOutPage({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'paypal',
    payment_details: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(user.balance);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.requestPayout(
        parseFloat(formData.amount),
        formData.payment_method,
        formData.payment_details
      );

      setSuccess('Payout request submitted! Check your history for status.');
      setFormData({
        amount: '',
        payment_method: 'paypal',
        payment_details: '',
      });

      // Update balance
      setUserBalance(parseFloat(userBalance) - parseFloat(formData.amount));
    } catch (err) {
      setError(err.response?.data?.error || 'Payout request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout user={user} onLogout={() => {
      localStorage.removeItem('token');
      navigate('/');
    }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Cash Out</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>Withdraw your earnings to PayPal or Cash App</p>

        <div style={{ maxWidth: '600px' }}>
          {/* Current Balance */}
          <div className="card card-stat" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="card-stat-label">Current Balance</div>
            <div className="card-stat-value">${parseFloat(userBalance).toFixed(2)}</div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              {parseFloat(userBalance) >= 1 ? '✓ You can cash out!' : '✗ Minimum balance is $1'}
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit}>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="form-group">
                <label className="form-label">Withdrawal Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter amount (minimum $1)"
                  step="0.01"
                  min="1"
                  max={userBalance}
                  required
                />
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                  Maximum: ${parseFloat(userBalance).toFixed(2)}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="paypal">PayPal</option>
                  <option value="cashapp">Cash App</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {formData.payment_method === 'paypal' ? 'PayPal Email' : 'Cash App $Cashtag'} *
                </label>
                <input
                  type="text"
                  name="payment_details"
                  value={formData.payment_details}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={
                    formData.payment_method === 'paypal'
                      ? 'your@email.com'
                      : '$yourusername'
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-block"
                disabled={loading || parseFloat(formData.amount || 0) < 1 || parseFloat(userBalance) < 1}
              >
                {loading ? 'Processing...' : 'Request Payout'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="card" style={{ background: '#e0f2fe', border: '1px solid #0284c7' }}>
            <h4 style={{ color: '#0369a1', marginTop: 0 }}>ℹ️ How it Works</h4>
            <ul style={{ marginLeft: '1.5rem', color: '#0369a1' }}>
              <li>Minimum payout is $1</li>
              <li>Submit your payout request with a valid email or Cash App handle</li>
              <li>Payouts are typically processed within 24-48 hours</li>
              <li>You'll receive an email confirmation when your payout is approved</li>
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default CashOutPage;
