import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';

function UserLayout({ children, user, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div className="container" style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#3b82f6', margin: 0 }}>💰 AdEarn</h2>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#666' }}>Dashboard</Link>
            <Link to="/earn" style={{ textDecoration: 'none', color: '#666' }}>Earn</Link>
            <Link to="/history" style={{ textDecoration: 'none', color: '#666' }}>History</Link>
            <Link to="/cashout" style={{ textDecoration: 'none', color: '#666' }}>Cash Out</Link>
            <button
              onClick={onLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Banner Ad */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{
          background: '#e5e7eb',
          height: '100px',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.9rem',
        }}>
          📢 Banner Ad Slot (Replace with Google AdSense)
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {children}
      </div>
    </div>
  );
}

export default UserLayout;
