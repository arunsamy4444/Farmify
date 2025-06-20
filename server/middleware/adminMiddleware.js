// middleware/adminMiddleware.js
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // assuming user ID is stored in req.user
        if (user && user.role === 'admin') {
            return next(); // Allow admin to proceed
        }
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = adminMiddleware;
