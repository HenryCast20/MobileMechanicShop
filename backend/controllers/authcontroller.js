const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. Standard Bcrypt Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
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
       WHERE a.username = ?`,
      [username]
    );

    if (rows.length === 0 || !rows[0].password_hash) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

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
};

// 2. Google OAuth Handler
const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Google token is required.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

    const [existingAccounts] = await db.query(
      `SELECT a.customer_id, a.username, c.first_name, c.last_name, c.phone_number, c.email 
       FROM accounts a
       JOIN customers c ON a.customer_id = c.customer_id
       WHERE a.google_id = ?`,
      [googleId]
    );

    let user;

    if (existingAccounts.length > 0) {
      user = existingAccounts[0];
    } else {
      const [customerResult] = await db.query(
        `INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?)`,
        [firstName || 'Google', lastName || 'User', email]
      );

      const customerId = customerResult.insertId;

      await db.query(
        `INSERT INTO accounts (customer_id, username, google_id) VALUES (?, ?, ?)`,
        [customerId, email, googleId]
      );

      user = {
        id: customerId,
        username: email,
        firstName,
        lastName,
        phone: null,
        email,
      };
    }

    return res.status(200).json({
      message: 'Google login successful!',
      user,
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(401).json({ message: 'Google authentication failed.' });
  }
};

// 3. User Registration
const register = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ message: 'First name, last name, username, and password are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert into customers table first
    const [customerResult] = await db.query(
      'INSERT INTO customers (first_name, last_name, phone_number, email) VALUES (?, ?, ?, ?)',
      [firstName, lastName, phoneNumber || null, email || null]
    );
    const customerId = customerResult.insertId;

    // Insert into accounts table linked to the new customer
    await db.query(
      'INSERT INTO accounts (customer_id, username, password_hash) VALUES (?, ?, ?)',
      [customerId, username, passwordHash]
    );

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

module.exports = {
  loginUser,
  googleLogin,
  register,
};
