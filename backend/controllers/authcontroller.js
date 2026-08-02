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
        email: user.email
      }
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

    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
    } = payload;

    if (!email) {
      return res.status(400).json({
        message: 'Google account email is required.'
      });
    }

    // First look for an existing Google account
    const [googleAccounts] = await db.query(
      `SELECT
        a.customer_id,
        a.username,
        c.first_name,
        c.last_name,
        c.phone_number,
        c.email
      FROM accounts a
      JOIN customers c ON a.customer_id = c.customer_id
      WHERE a.google_id = ?`,
      [googleId]
    );

    let user;

    if (googleAccounts.length > 0) {

      const account = googleAccounts[0];

      user = {
        id: account.customer_id,
        username: account.username,
        firstName: account.first_name,
        lastName: account.last_name,
        phone: account.phone_number,
        email: account.email
      };

    } else {

      // No Google account found. Check if email already exists.
      const [emailAccounts] = await db.query(
        `SELECT
          a.customer_id,
          a.username,
          c.first_name,
          c.last_name,
          c.phone_number,
          c.email
        FROM accounts a
        JOIN customers c ON a.customer_id = c.customer_id
        WHERE c.email = ?`,
        [email]
      );

      if (emailAccounts.length > 0) {

        const account = emailAccounts[0];

        // Link Google account to existing account
        await db.query(
          `UPDATE accounts
          SET google_id = ?
          WHERE customer_id = ?`,
          [googleId, account.customer_id]
        );

        user = {
          id: account.customer_id,
          username: account.username,
          firstName: account.first_name,
          lastName: account.last_name,
          phone: account.phone_number,
          email: account.email
        };

      } else {

        // Create a new customer
        const [customerResult] = await db.query(
          `INSERT INTO customers
          (first_name, last_name, email)
          VALUES (?, ?, ?)`,
          [
            firstName || 'Google',
            lastName || 'User',
            email
          ]
        );

        const customerId = customerResult.insertId;

        // Create account
        await db.query(
          `INSERT INTO accounts
          (customer_id, username, password_hash, google_id)
          VALUES (?, ?, NULL, ?)`,
          [
            customerId,
            email,
            googleId
          ]
        );

        user = {
          id: customerId,
          username: email,
          firstName: firstName || 'Google',
          lastName: lastName || 'User',
          phone: null,
          email
        };

      }
    }

    return res.status(200).json({
      message: 'Google login successful!',
      user
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(401).json({
      message: 'Google authentication failed.'
    });
  }
};
//register a user 
const register = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({
      message: 'First name, last name, username, and password are required.'
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check username
    const [existingUsername] = await connection.query(
      'SELECT customer_id FROM accounts WHERE username = ?',
      [username]
    );

    if (existingUsername.length > 0) {
      await connection.rollback();
      connection.release();

      return res.status(409).json({
        message: 'Username already exists.'
      });
    }

    // Check email
    if (email) {
      const [existingEmail] = await connection.query(
        'SELECT customer_id FROM customers WHERE email = ?',
        [email]
      );

      if (existingEmail.length > 0) {
        await connection.rollback();
        connection.release();

        return res.status(409).json({
          message: 'Email already registered.'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert customer
    const [customerResult] = await connection.query(
      `INSERT INTO customers
      (first_name, last_name, phone_number, email)
      VALUES (?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        phoneNumber || null,
        email || null
      ]
    );

    const customerId = customerResult.insertId;

    // Insert account
    await connection.query(
      `INSERT INTO accounts
      (customer_id, username, password_hash)
      VALUES (?, ?, ?)`,
      [
        customerId,
        username,
        passwordHash
      ]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: customerId,
        username,
        firstName,
        lastName,
        phone: phoneNumber || null,
        email: email || null
      }
    });

  } catch (error) {

    await connection.rollback();

    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Server error during registration.'
    });

  } finally {

    connection.release();

  }
};

module.exports = {
  loginUser,
  googleLogin,
  register,
};
