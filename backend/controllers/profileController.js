const db = require('../config/db');

const updateProfile = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First and last name are required.' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const [result] = await db.query(
      `UPDATE customers
       SET first_name = ?, last_name = ?, phone_number = ?, email = ?
       WHERE customer_id = ?`,
      [
        firstName.trim(),
        lastName.trim(),
        phoneNumber ? phoneNumber.trim() : null,
        email ? email.trim().toLowerCase() : null,
        customerId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Profile updated.',
      user: {
        id: customerId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phoneNumber ? phoneNumber.trim() : null,
        email: email ? email.trim().toLowerCase() : null
      }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That email is already registered.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
};

module.exports = { updateProfile };
