const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./backend/config/db'); // Imports your MySQL pool
const authRoutes = require('./backend/routes/authRoutes');

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// ==========================================
// API ROUTES (Must go BEFORE static/catch-all)
// ==========================================

app.post('/api/login', async (req, res) => {
  // Support either 'username' or 'email' from request body
  const loginInput = req.body.username || req.body.email;
  const { password } = req.body;

  if (!loginInput || !password) {
    return res.status(400).json({ message: 'Username/Email and password are required.' });
  }

  try {
    // Query accounts & customers for matching username or email
    const [rows] = await db.query(
      `SELECT 
        a.customer_id, 
        a.username, 
        a.password_hash, 
        c.first_name, 
        c.last_name, 
        c.phone_number, 
        c.email 
       FROM accounts a
       JOIN customers c ON a.customer_id = c.customer_id
       WHERE a.username = ? OR c.email = ?`,
      [loginInput, loginInput]
    );

    if (rows.length === 0 || !rows[0].password_hash) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare entered password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.customer_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Database login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// ==========================================
// FRONTEND STATIC FILES & CATCH-ALL ROUTE
// ==========================================

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
