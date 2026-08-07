const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
// Grab the token securely from the HTTP-only cookie
    const token = req.cookies && req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // This populates req.user with { customer_id: ... }
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
