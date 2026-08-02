const path = require('path');
const express = require('express');
const db = require('./backend/db'); // Imports your MySQL pool
const app = express();

// Middleware to parse incoming JSON data from React
app.use(express.json());

// ==========================================
// API ROUTES (Must go BEFORE static/catch-all)
// ==========================================

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Query the accounts table for matching email
    const [rows] = await db.query(
      'SELECT id, email, password FROM accounts WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Check if plain text password matches database
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      user: { id: user.id, email: user.email },
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
