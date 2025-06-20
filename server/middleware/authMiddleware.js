const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Token Received:", token); // Debugging

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded User:", req.user); // Debugging
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};


module.exports = authMiddleware;