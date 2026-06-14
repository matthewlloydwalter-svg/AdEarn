import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#3b82f6', margin: 0 }}>💰 AdEarn</h2>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-outline btn-small">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-small">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Earn Money Watching Ads</h1>
          <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Watch video ads and earn real money. Get 20% of every ad value. Cash out to PayPal or Cash App.
          </p>
          <Link to="/signup" className="btn btn-success" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started Free</Link>
        </div>
      </section>

      {/* Banner Ad Slots */}
      <section style={{ padding: '2rem 1rem', background: '#fff', marginBottom: '2rem' }}>
        <div className="container">
          <div style={{
            background: '#e5e7eb',
            height: '100px',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            📢 Banner Ad Slot (Replace with Google AdSense)
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '3rem 1rem', background: '#fff' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card">
              <h3 style={{ color: '#3b82f6' }}>1. Sign Up</h3>
              <p>Create a free account in seconds. No credit card required.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#3b82f6' }}>2. Watch Ads</h3>
              <p>Watch short video ads or let them play continuously. Earn 20% of ad revenue.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#3b82f6' }}>3. Cash Out</h3>
              <p>Once you reach $1, cash out instantly via PayPal or Cash App.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: '#fff', padding: '2rem 1rem', textAlign: 'center', marginTop: '3rem' }}>
        <div className="container">
          <p style={{ margin: 0, color: '#d1d5db' }}>&copy; 2026 AdEarn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
