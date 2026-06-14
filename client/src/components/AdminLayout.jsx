import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLayout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '250px' : '80px',
          background: '#1f2937',
          color: '#fff',
          padding: '1.5rem 1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0 }}>⚙️ {sidebarOpen ? 'Admin' : ''}</h3>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'background 0.3s',
              fontSize: sidebarOpen ? '1rem' : '0.9rem',
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.target.style.background = 'none')}
          >
            {sidebarOpen ? 'Overview' : '📊'}
          </button>
          <button
            onClick={() => navigate('/admin/payouts')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'background 0.3s',
              fontSize: sidebarOpen ? '1rem' : '0.9rem',
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.target.style.background = 'none')}
          >
            {sidebarOpen ? 'Payouts' : '💰'}
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'background 0.3s',
              fontSize: sidebarOpen ? '1rem' : '0.9rem',
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.target.style.background = 'none')}
          >
            {sidebarOpen ? 'Users' : '👥'}
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'background 0.3s',
              fontSize: sidebarOpen ? '1rem' : '0.9rem',
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.target.style.background = 'none')}
          >
            {sidebarOpen ? 'Settings' : '⚙️'}
          </button>
        </nav>

        <button
          onClick={() => {
            onLogout();
            navigate('/');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: sidebarOpen ? '1rem' : '0.9rem',
          }}
        >
          {sidebarOpen ? 'Logout' : '🚪'}
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ background: '#fff', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
          <h2 style={{ margin: 0, color: '#1f2937' }}>💰 AdEarn Admin</h2>
          <div style={{ color: '#666' }}>{user?.email}</div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
