import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import * as api from './utils/api';

// User Pages
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EarnPage from './pages/EarnPage';
import HistoryPage from './pages/HistoryPage';
import CashOutPage from './pages/CashOutPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminPayoutsPage from './pages/AdminPayoutsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

const ADMIN_PATH = '/admin/matthew1lloyd4walter8adearndaddy';

function App() {
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyUser();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyUser = async () => {
    try {
      const response = await api.verifyToken();
      setUser(response.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage setUser={setUser} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />

        {/* User Routes */}
        <Route path="/dashboard" element={user && user.role !== 'admin' ? <DashboardPage user={user} /> : <Navigate to="/" />} />
        <Route path="/earn" element={user && user.role !== 'admin' ? <EarnPage user={user} /> : <Navigate to="/" />} />
        <Route path="/history" element={user && user.role !== 'admin' ? <HistoryPage user={user} /> : <Navigate to="/" />} />
        <Route path="/cashout" element={user && user.role !== 'admin' ? <CashOutPage user={user} /> : <Navigate to="/" />} />

        {/* Admin Routes */}
        <Route
          path={ADMIN_PATH}
          element={
            adminToken ? (
              <AdminOverviewPage adminToken={adminToken} onLogout={handleAdminLogout} />
            ) : (
              <AdminLoginPage onLogin={handleAdminLogin} />
            )
          }
        />
        <Route
          path={`${ADMIN_PATH}/payouts`}
          element={
            adminToken ? (
              <AdminPayoutsPage adminToken={adminToken} onLogout={handleAdminLogout} />
            ) : (
              <Navigate to={ADMIN_PATH} />
            )
          }
        />
        <Route
          path={`${ADMIN_PATH}/users`}
          element={
            adminToken ? (
              <AdminUsersPage adminToken={adminToken} onLogout={handleAdminLogout} />
            ) : (
              <Navigate to={ADMIN_PATH} />
            )
          }
        />
        <Route
          path={`${ADMIN_PATH}/settings`}
          element={
            adminToken ? (
              <AdminSettingsPage adminToken={adminToken} onLogout={handleAdminLogout} />
            ) : (
              <Navigate to={ADMIN_PATH} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
