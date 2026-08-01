const path = require('path');
const express = require('express');
const app = express();

// Middleware for parsing JSON, API routes, etc.
app.use(express.json());

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
