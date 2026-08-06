const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //expecting a bearer token 

    if(!token){ // if wrong user 
    return res.status(401).json({ error: 'Access denied. No token provided.' });  
}

try {
    const verified = jwt.verify(token, process.env.JWT_SECRECT);
    req.user = verified;
    next()
} catch (err){
    res.status(403).json({ error: 'Invalid or expired token.' });
}
};

module.exports = verifytoken;
