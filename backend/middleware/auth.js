// Middleware to check if the user is authenticated
const { verifyToken } = require('../util/jwt');

// Authentication function
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.autorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided!' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Unauthorized: Invalid token!' });
    }

    req.user = decoded;
    next();
}

module.exports = authenticateToken;