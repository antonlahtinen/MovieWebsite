const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // If no roles specified or user's role is in allowed roles, proceed
            if (allowedRoles.length === 0 || allowedRoles.includes(decoded.role)) {
                req.user = decoded;
                next();
            } else {
                console.log('Access denied. User role:', decoded.role, 'Allowed roles:', allowedRoles);
                return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
            }
        } catch (err) {
            console.error('Token verification error:', err);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
};

module.exports = authenticate;