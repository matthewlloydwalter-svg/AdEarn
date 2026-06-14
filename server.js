import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize database
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        balance DECIMAL(10, 2) DEFAULT 0,
        total_earned DECIMAL(10, 2) DEFAULT 0,
        total_withdrawn DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS earnings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        ad_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payout_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_details VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        admin_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default ad value if not exists
    const result = await pool.query("SELECT * FROM app_settings WHERE setting_key = 'video_ad_value'");
    if (result.rows.length === 0) {
      await pool.query(
        "INSERT INTO app_settings (setting_key, setting_value) VALUES ('video_ad_value', '0.05')"
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDatabase();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// AUTH
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username, role',
      [email, hashedPassword, username]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        balance: user.balance,
        total_earned: user.total_earned,
        total_withdrawn: user.total_withdrawn,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, role, balance, total_earned, total_withdrawn FROM users WHERE id = $1', [
      req.user.id,
    ]);
    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER DASHBOARD
app.get('/api/user/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, username, role, balance, total_earned, total_withdrawn FROM users WHERE id = $1', [
      req.user.id,
    ]);

    const earnings = await pool.query(
      'SELECT * FROM earnings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    res.json({
      user: user.rows[0],
      recent_earnings: earnings.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EARNINGS
app.post('/api/earnings/log', authenticateToken, async (req, res) => {
  try {
    const { amount, ad_type } = req.body;

    // Log earning
    const earningResult = await pool.query(
      'INSERT INTO earnings (user_id, amount, ad_type) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, amount, ad_type]
    );

    // Update user balance
    await pool.query(
      'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
      [amount, req.user.id]
    );

    res.json(earningResult.rows[0]);
  } catch (error) {
    console.error('Earnings log error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/earnings/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM earnings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PAYOUTS
app.post('/api/payouts/request', authenticateToken, async (req, res) => {
  try {
    const { amount, payment_method, payment_details } = req.body;

    const user = await pool.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    if (parseFloat(user.rows[0].balance) < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (amount < 1) {
      return res.status(400).json({ error: 'Minimum payout is $1' });
    }

    const result = await pool.query(
      'INSERT INTO payout_requests (user_id, amount, payment_method, payment_details) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, amount, payment_method, payment_details]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Payout request error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payouts/requests', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payout_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN
app.get('/api/admin/overview', authenticateToken, adminOnly, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = \'user\'');
    const totalEarnings = await pool.query('SELECT SUM(amount) as total FROM earnings');
    const totalPaidOut = await pool.query(
      "SELECT SUM(amount) as total FROM payout_requests WHERE status = 'approved'"
    );
    const totalPending = await pool.query(
      "SELECT SUM(amount) as total FROM payout_requests WHERE status = 'pending'"
    );

    res.json({
      total_users: totalUsers.rows[0].count,
      total_earnings: totalEarnings.rows[0].total || 0,
      total_paid_out: totalPaidOut.rows[0].total || 0,
      total_pending: totalPending.rows[0].total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/payouts', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT pr.*, u.email, u.username FROM payout_requests pr JOIN users u ON pr.user_id = u.id';
    
    if (status) {
      query += " WHERE pr.status = '" + status + "'";
    }
    
    query += ' ORDER BY pr.created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/admin/payouts/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    const { id } = req.params;

    const payout = await pool.query('SELECT * FROM payout_requests WHERE id = $1', [id]);
    if (payout.rows.length === 0) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    if (status === 'approved') {
      // Deduct from user balance
      await pool.query(
        'UPDATE users SET balance = balance - $1, total_withdrawn = total_withdrawn + $1 WHERE id = $2',
        [payout.rows[0].amount, payout.rows[0].user_id]
      );
    }

    const result = await pool.query(
      'UPDATE payout_requests SET status = $1, admin_note = $2, processed_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, admin_note || null, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Payout update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, email, username, balance, total_earned, total_withdrawn, created_at FROM users WHERE role = \'user\'';
    
    if (search) {
      query += " AND (email ILIKE '%" + search + "%' OR username ILIKE '%" + search + "%')";
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      'SELECT id, email, username, balance, total_earned, total_withdrawn, created_at FROM users WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const earnings = await pool.query('SELECT * FROM earnings WHERE user_id = $1 ORDER BY created_at DESC', [id]);
    const payouts = await pool.query('SELECT * FROM payout_requests WHERE user_id = $1 ORDER BY created_at DESC', [id]);

    res.json({
      user: user.rows[0],
      earnings: earnings.rows,
      payouts: payouts.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/settings', authenticateToken, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM app_settings');
    const settings = {};
    result.rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/settings', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { setting_key, setting_value } = req.body;

    const result = await pool.query(
      'INSERT INTO app_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [setting_key, setting_value]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/settings/video-ad-value', async (req, res) => {
  try {
    const result = await pool.query("SELECT setting_value FROM app_settings WHERE setting_key = 'video_ad_value'");
    if (result.rows.length === 0) {
      return res.json({ video_ad_value: '0.05' });
    }
    res.json({ video_ad_value: result.rows[0].setting_value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
