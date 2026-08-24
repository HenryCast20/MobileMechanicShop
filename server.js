const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const express = require('express');
const authroutes = require('./backend/routes/authroutes');
const vehicleRoutes = require('./backend/routes/vehicleRoutes');
const repairRoutes = require('./backend/routes/repairRoutes');
const cookieParser = require('cookie-parser');
const profileRoutes = require('./backend/routes/profileRoutes');
const app = express();



// Middleware to parse incoming JSON data
app.use(express.json());
app.use(cookieParser())

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authroutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/profile', profileRoutes);
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
