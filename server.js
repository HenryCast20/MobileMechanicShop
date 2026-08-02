const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const express = require('express');
const authroutes = require('./backend/routes/authroutes');

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authroutes);

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
